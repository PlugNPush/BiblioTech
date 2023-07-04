print("Importing libraries... To install or update them, please run 'pip install -r requirements.txt'.")
import os
import queue
import multiprocessing
import threading
from flask import Flask, request
import hashlib
from segment_anything import SamAutomaticMaskGenerator, sam_model_registry, SamPredictor
from typing import Any, Dict, List
import cv2  # type: ignore
from PIL import Image
import easyocr
import requests
from tqdm import tqdm
import shutil
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
print("Libraries imported!")


debug = True

app = Flask(__name__)
task_queue = queue.Queue()

sam_file_name = "sam_vit_h_4b8939.pth"
sam_url = "https://dl.fbaipublicfiles.com/segment_anything/sam_vit_h_4b8939.pth"

# Check if the file exists in the current directory
if not os.path.exists(sam_file_name):
    print("Downloading SAM file... This may take a while.")
    response = requests.get(sam_url, stream=True)
    total_size = int(response.headers.get('content-length', 0))
    block_size = 1024  # 1 KB
    progress_bar = tqdm(total=total_size, unit='B', unit_scale=True)

    with open(sam_file_name, 'wb') as file:
        for data in response.iter_content(block_size):
            progress_bar.update(len(data))
            file.write(data)

    progress_bar.close()
    print("SAM file download complete!")
else:
    print("SAM file already exists in the current directory.")

print("Loading SAM model...")
sam_checkpoint = os.path.join(os.getcwd(), "sam_vit_h_4b8939.pth")
model_type = "vit_h"
device = "cpu"
sam = sam_model_registry[model_type](checkpoint=sam_checkpoint)
sam.to(device=device)
mask_generator = SamAutomaticMaskGenerator(sam)
mask_predictor = SamPredictor(sam)
print("SAM model loaded!")

print("Loading OCR models... This may take a while.")
reader_latin = easyocr.Reader(['cs', 'cy', 'da', 'de', 'en', 'es', 'et', 'fr', 'hr', 'hu', 'is', 'it', 'lt', 'lv', 'nl', 'no', 'oc', 'pl', 'pt', 'ro', 'rs_latin', 'sk', 'sl', 'sq', 'sv', 'tr', 'vi']) # this needs to run only once to load the model into memory
reader_cyrillic = easyocr.Reader(['be', 'bg', 'che', 'mn', 'rs_cyrillic', 'ru', 'uk']) # this needs to run only once to load the model into memory
reader_china = easyocr.Reader(['ch_sim']) # this needs to run only once to load the model into memory
reader_thai = easyocr.Reader(['th']) # this needs to run only once to load the model into memory
reader_japan = easyocr.Reader(['ja']) # this needs to run only once to load the model into memory
reader_korea = easyocr.Reader(['ko']) # this needs to run only once to load the model into memory
reader_india = easyocr.Reader(['hi', 'ne']) # this needs to run only once to load the model into memory
reader_arabic = easyocr.Reader(['ar', 'ug']) # this needs to run only once to load the model into memory
#readers = [reader_latin, reader_cyrillic, reader_china, reader_thai, reader_japan, reader_korea, reader_india, reader_arabic, reader_asia]
readers = [reader_latin]
print("OCR models loaded!")


def write_masks_to_folder(masks: List[Dict[str, Any]], path: str) -> None:
    header = "id,area,bbox_x0,bbox_y0,bbox_w,bbox_h,point_input_x,point_input_y,predicted_iou,stability_score,crop_box_x0,crop_box_y0,crop_box_w,crop_box_h"  # noqa
    metadata = [header]
    for i, mask_data in enumerate(masks):
        print("Processing mask " + path + "/" + str(i) + ".png")
        mask = mask_data["segmentation"]
        filename = f"{i}.png"
        cv2.imwrite(os.path.join(path, filename), mask * 255)
        mask_metadata = [
            str(i),
            str(mask_data["area"]),
            *[str(x) for x in mask_data["bbox"]],
            *[str(x) for x in mask_data["point_coords"][0]],
            str(mask_data["predicted_iou"]),
            str(mask_data["stability_score"]),
            *[str(x) for x in mask_data["crop_box"]],
        ]
        row = ",".join(mask_metadata)
        metadata.append(row)
    metadata_path = os.path.join(path, "metadata.csv")
    with open(metadata_path, "w") as f:
        f.write("\n".join(metadata))

    return

def show_anns(anns):
    if len(anns) == 0:
        return
    sorted_anns = sorted(anns, key=(lambda x: x['area']), reverse=True)
    ax = plt.gca()
    ax.set_autoscale_on(False)

    img = np.ones((sorted_anns[0]['segmentation'].shape[0], sorted_anns[0]['segmentation'].shape[1], 4))
    img[:,:,3] = 0
    for ann in sorted_anns:
        m = ann['segmentation']
        color_mask = np.concatenate([np.random.random(3), [0.35]])
        img[m] = color_mask
    ax.imshow(img)

def show_mask(mask, ax, random_color=False):
    if random_color:
        color = np.concatenate([np.random.random(3), np.array([0.6])], axis=0)
    else:
        color = np.array([30/255, 144/255, 255/255, 0.6])
    h, w = mask.shape[-2:]
    mask_image = mask.reshape(h, w, 1) * color.reshape(1, 1, -1)
    ax.imshow(mask_image)

def draw_masks(image, masks, image_folder, trained = False):
    print("Drawing masks...")
    plt.figure(figsize=(20,20))
    plt.imshow(image)
    if trained:
        for mask in masks:
            show_mask(mask, plt.gca(), True)
    else:
        show_anns(masks)
    plt.axis('off')
    if trained:
        plt.savefig(os.path.join(f"{image_folder}", "masks_trained.png"), bbox_inches='tight', pad_inches=0)
    else:
        plt.savefig(os.path.join(f"{image_folder}", "masks.png"), bbox_inches='tight', pad_inches=0) 
    plt.close()
    print("Masks drawn.")

def preprocess_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    edged = cv2.Canny(blurred, 1, 50)
    return edged

def find_contours(image):
    contours, _ = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    return contours

def draw_bounding_boxes(image, contours):
    boxes = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        # Check if the longest edge is at least 4 times longer than the shortest one
        # and if the tallest side is at least 5% of the image height
        if max(w, h) >= 3 * min(w, h) and max(w, h) >= 0.05 * image.shape[0]:
            cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
            boxes.append(np.array([x, y, x + w, y + h]))
            
    return boxes, image

def train_model(image_path):
    print("Training model...")
    image_folder = os.path.dirname(image_path)
    image = cv2.imread(image_path)
    processed_image = preprocess_image(image)
    contours = find_contours(processed_image)
    
    boxes, image_with_boxes = draw_bounding_boxes(image.copy(), contours)
    cv2.imwrite(os.path.join(f"{image_folder}", "training.png"), image_with_boxes)
    print("Model trained.")
    return boxes

def generate_masks(image_path):
    image_folder = os.path.dirname(image_path)

    trained_boxes = train_model(image_path)

    print("Generating masks... This may take a while.")
    os.makedirs(os.path.join(f"{image_folder}", "sam_masks"), exist_ok=True)
    #os.makedirs(os.path.join(f"{image_folder}", "sam_masks_trained"), exist_ok=True)
    
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    masks = mask_generator.generate(image)
    
    #trained_masks = []

    #mask_predictor.set_image(image)
    #i = 0
    #for box in trained_boxes:
    #    i += 1
    #    print("Predicting trained mask for box number " + str(i))
    #    masks_predict, _, _ = mask_predictor.predict(
    #        box=box,
    #        multimask_output=False
    #    )
    #    trained_masks.append(masks_predict[0])

    draw_masks(image, masks, image_folder)
    #draw_masks(image, trained_masks, image_folder, trained=True)

    write_masks_to_folder(masks, os.path.join(f"{image_folder}", "sam_masks"))
    #write_masks_to_folder(trained_masks, os.path.join(f"{image_folder}", "sam_masks_trained"))
    print("Masks generated.")
    return masks

def overlay_masks(image_path, indexes):
    print("Overlaying masks...")
    image_folder = os.path.dirname(image_path)
    os.makedirs(os.path.join(f"{image_folder}", "sam_overlays"), exist_ok=True)
    # load images
    img_org  = cv2.imread(image_path)
    b, g, r = cv2.split(img_org)

    for i in indexes:
        print("Overlaying mask " + str(i) + ".png")
        img_mask = cv2.imread(os.path.join(f"{image_folder}", "sam_filtered", f"{i}.png"))

    # convert colors
    #img_org  = cv2.cvtColor(img_org, ???)
        img_mask = cv2.cvtColor(img_mask, cv2.COLOR_BGR2GRAY)

    # the same size

    # add alpha channel 
        img_output = cv2.merge([b, g, r, img_mask], 4)
        img_output[:, :, 0] *= img_output[:, :, 3] // 255  # Blue channel
        img_output[:, :, 1] *= img_output[:, :, 3] // 255  # Green channel
        img_output[:, :, 2] *= img_output[:, :, 3] // 255  # Red channel

    # write as png which keeps alpha channel 
        cv2.imwrite(os.path.join(f"{image_folder}", "sam_overlays", f"{i}.png"), img_output)
        
    print("Masks overlayed.")



def crop_masks(image_path, indexes):
    print("Cropping masks...")
    image_folder = os.path.dirname(image_path)
    os.makedirs(os.path.join(f"{image_folder}", "sam_cropped"), exist_ok=True)
    for i in indexes:
        print("Cropping mask " + str(i) + ".png")
        # Load image
        im = Image.open(os.path.join(f"{image_folder}", "sam_overlays", f"{i}.png"))

        # Extract alpha channel as new Image and get its bounding box
        alpha = im.getchannel('A')
        bbox  = alpha.getbbox()

        # Apply bounding box to original image
        res = im.crop(bbox)
        res.save(os.path.join(f"{image_folder}", "sam_cropped", f"{i}.png"))

    print("Masks cropped.")

def filter_masks(image_path, masks):
    print("Filtering masks...")
    image_folder = os.path.dirname(image_path)
    image = cv2.imread(image_path)
    os.makedirs(os.path.join(f"{image_folder}", "sam_filtered"), exist_ok=True)
    filtered_indexes = []
    for i, mask_data in enumerate(masks):
        _, _, w, h = mask_data["bbox"]
        # Check if the longest edge is at least 3 times longer than the shortest one
        # and if the tallest side is at least 35% of the image height
        if max(w, h) >= 2 * min(w, h) and max(w, h) >= 0.35 * image.shape[0]:
            print("Mask " + str(i) + " is rectangular enough.")
            shutil.copy2(os.path.join(f"{image_folder}", "sam_masks", f"{i}.png"), os.path.join(f"{image_folder}", "sam_filtered", f"{i}.png"))
            filtered_indexes.append(i)
        else:
            print("Mask " + str(i) + " is not rectangular enough. Removing...")
    print("Masks filtered.")
    return filtered_indexes
    
def read_ocr_text(image_path, indexes):
    print("Reading OCR text...")
    image_folder = os.path.dirname(image_path)
    os.makedirs(os.path.join(f"{image_folder}", "sam_ocr"), exist_ok=True)
    os.makedirs(os.path.join(f"{image_folder}", "sam_ocrblocks"), exist_ok=True)
    allowlist = "abcdefghijklmnopqrstuvwxyz" \
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" \
            "áàâäãåāæçćčďéèêëēėęíìîïīįðñńňóòôöõøōœßśšťúùûüūůýÿžźż" \
            "ÁÀÂÄÃÅĀÆÇĆČĎÉÈÊËĒĖĘÍÌÎÏĪĮÐÑŃŇÓÒÔÖÕØŌŒŚßŠŤÚÙÛÜŪŮÝŸŽŹŻ" \
            "0123456789 "

    for i in indexes:
        print("Reading OCR text for mask " + str(i) + ".png")
        result = []
        final_result = []
        finished_text = ""
        for reader in readers:

            ocr_img = cv2.imread(os.path.join(f"{image_folder}", "sam_cropped", f"{i}.png"))

            result = [
                reader.readtext(ocr_img, detail = 1, min_size=20, allowlist=allowlist, paragraph=False, mag_ratio=1.5),
                reader.readtext(ocr_img, detail = 1, rotation_info=[90], min_size=20, allowlist=allowlist, paragraph=False, mag_ratio=1.5),
                reader.readtext(ocr_img, detail = 1, rotation_info=[180], min_size=20, allowlist=allowlist, paragraph=False, mag_ratio=1.5),
                reader.readtext(ocr_img, detail = 1, rotation_info=[270], min_size=20, allowlist=allowlist, paragraph=False, mag_ratio=1.5)
            ]
            
            for (coord, _, _) in result[0]:
                (topleft, _, bottomright, _) = coord
                tx,ty = (int(topleft[0]), int(topleft[1]))
                bx,by = (int(bottomright[0]), int(bottomright[1]))
                cv2.rectangle(ocr_img, (tx,ty), (bx,by), (0, 0, 255), 2)

            cv2.imwrite(os.path.join(f"{image_folder}", "sam_ocrblocks", f"{i}.png"), ocr_img)

            # result is of dimension 4xN, where N is the number of words found
            # we want to keep a single word with the highest probability, BUT also if it is the longest word. Basically, we want to exclude random numbers even if they have a high probability.
            # we do want to store the probability of the word, so we can use it later to filter out false positives.
            # This process happens per word, this means we can keep word 1 from result[0] and word 2 from result[3] if they are the longest words with the highest probability.
            # HOWEVER, we want the longest word to be non-numeric. 
            for iw in range(len(result[0])):
                word = ""
                prob = 0
                for jw in range(len(result)):
                    if len(result[jw]) > iw:
                        if (len(result[jw][iw][1]) > len(word) and result[jw][iw][1].isnumeric() == False) or (len(result[jw][iw][1]) == len(word) and result[jw][iw][2] > prob):
                            word = result[jw][iw][1]
                            prob = result[jw][iw][2]
                final_result.append((word, prob))
                
            # Finally, build the finished text
            # Retain only words that have a probability of 60% or higher
            # Except for single characters, which require a probability of 95% or higher
            # Also, do not add the same word twice
            
            for (word, prob) in final_result:
                if len(word) == 1 and prob < 0.95:
                    continue
                if prob < 0.6:
                    continue
                if word in finished_text:
                    continue
                finished_text += word + " "

            # Remove the last space
            finished_text = finished_text[:-1]

        with open(os.path.join(f"{image_folder}", "sam_ocr", f"{i}.txt"), "w") as f:
            f.write(finished_text)
    print("OCR text read.")

def merge_ocr_text(image_path, indexes):
    print("Merging OCR text...")
    image_folder = os.path.dirname(image_path)
    os.makedirs(os.path.join(f"{image_folder}", "sam_ocr"), exist_ok=True)
    result = ""
    for i in indexes:
        print("Merging OCR text for mask " + str(i) + ".png")
        with open(os.path.join(f"{image_folder}", "sam_ocr", f"{i}.txt"), "r") as f:
            content = f.read()
            if content != "":
                result += content + "\n"
    with open(os.path.join(f"{image_folder}", "final.txt"), "w") as f:
        f.write(result)
    print("OCR text merged.")

def get_book_google(title):
    try:
        response = requests.get(f"https://www.googleapis.com/books/v1/volumes?q={title}")
        data = response.json()
        items = data.get("items", [])
        return items
    except requests.exceptions.RequestException as err:
        print(err)
        return []
    
def get_books(image_path):
    print("Getting books...")
    image_folder = os.path.dirname(image_path)
    with open(os.path.join(f"{image_folder}", "final.txt"), "r") as f:
        content = f.read()
        titles = content.split("\n")
        books = []
        for title in titles:
            print("Getting books from the Google API for title:", title)
            books += get_book_google(title)
    print("Books gotten.")
    return books

def add_book_db(title, author, year, book_type, publisher, owner):
    try:
        url = "http://localhost:8100/api/addbook"
        data = {
            "title": title,
            "owner": owner,
            "author": author,
            "year": year,
            "type": book_type,
            "publisher": publisher
        }
        response = requests.post(url, json=data)
        
        if response.status_code == 200:
            print("livre ajouté")
        else:
            print("Une erreur s'est produite lors de l'ajout du livre.")
            print(f"Code de statut: {response.status_code}")
    except requests.exceptions.RequestException as err:
        print(err)

def extract_books(books):
    # Json parse books
    result_books = []
    print("Extracting books...")
    for book in books:
        # Initialize variables with default values
        title = "Unknown"
        author = "Unknown"
        year = "Unknown"
        book_type = "Unknown"
        publisher = "Unknown"
        
        # Check if 'items' key exists in the JSON
        if 'volumeInfo' in book:

            volume_info = book['volumeInfo']
            title = volume_info.get('title', title)

            # Extract the author from 'volumeInfo' if available
            authors = volume_info.get('authors')
            author = authors[0] if authors else author

            # Extract the year from 'volumeInfo' if available
            published_date = volume_info.get('publishedDate')
            year = published_date.split('-')[0] if published_date else year

            # Extract the book type from 'volumeInfo' if available
            categories = volume_info.get('categories')
            book_type = categories[0] if categories else book_type

            publisher = volume_info.get('publisher', publisher)
        
        # Return the extracted information
        result_books.append((title, author, year, book_type, publisher))
    print("Books extracted.")
    return result_books


def add_books(books, owner):
    if owner != "":
        print("Adding books...")
        result_books = extract_books(books)
        for book in result_books:
            title, author, year, book_type, publisher = book
            add_book_db(title, author, year, book_type, publisher, owner)
        print("Books added.")
    
def cleanup(image_path):
    if debug == False:
        print("Cleaning up...")
        image_folder = os.path.dirname(image_path)
        shutil.rmtree(image_folder)
        print("Cleaned up.")
    else:
        print("Debug mode is on. Not cleaning up.")

def process_image(image_path, owner):
    # Perform image processing here using the loaded script
    print("Processing image:", image_path)
    # Step 1: Use Segment Anything to generate all the masks
    #masks = generate_masks(image_path)

    # Step 2: Filter out masks that are not rectangular enough
    #indexes = filter_masks(image_path, masks)

    # Step 3: Overlay each mask on the image
    #overlay_masks(image_path, indexes)

    # Step 4: Crop each overlayed mask
    #crop_masks(image_path, indexes)

    # Step 5: Read the OCR text for each overlayed mask
    #read_ocr_text(image_path, indexes)

    # Step 6: Merge the OCR text for each overlayed mask
    #merge_ocr_text(image_path, indexes)

    # Step 7: For each OCR text, call the Google Books API to get the book metadata
    books = get_books(image_path)

    # Step 8: For each book metadata, call the database API to save the book metadata
    add_books(books, owner)
    
    # Step 9: Cleanup
    cleanup(image_path)



def process_worker():
    while True:
        image_path, owner = task_queue.get()  # Get an image path from the task queue

        # Check for a termination signal
        if image_path is None:
            break

        # Process the image
        process_image(image_path, owner)


@app.route("/process_image", methods=["POST"])
def handle_process_image():
    if "image" not in request.files:
        return "No image uploaded.", 400

    image_file = request.files["image"]
    owner = request.form.get("owner", "")
    image_hash = hashlib.md5(image_file.read()).hexdigest()
    filename = f"base.{image_file.filename.rsplit('.', 1)[-1].lower()}"
    os.makedirs(os.path.join(os.getcwd(), "processing_requests", f"{image_hash}"), exist_ok=True)
    image_path = os.path.join(os.getcwd(), "processing_requests", f"{image_hash}", filename)
    image_file.seek(0)
    image_file.save(image_path)
    task_queue.put((image_path, owner))
    return "Image processing task received.", 200

def main():
    # Number of worker processes (adjust as per your server's capacity)
    num_workers = multiprocessing.cpu_count()

    # Create the processing requests folder if it doesn't exist
    os.makedirs(os.path.join(os.getcwd(), "processing_requests"), exist_ok=True)

    # Create multiple threads to run the image processing in parallel
    threads = []
    for _ in range(num_workers):
        t = threading.Thread(target=process_worker, daemon=True).start()
        threads.append(t)

    # Start the Flask app
    app.run(host="0.0.0.0", port=911)

    # Send termination signal to worker processes
    for _ in range(num_workers):
        task_queue.put(None)

    # Wait for the image processing threads to finish

if __name__ == "__main__":
    main()
