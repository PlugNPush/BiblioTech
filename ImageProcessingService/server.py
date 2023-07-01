print("Importing libraries... To install or update them, please run 'pip install -r requirements.txt'.")
import os
import queue
import multiprocessing
import threading
from flask import Flask, request
import hashlib
from segment_anything import SamAutomaticMaskGenerator, sam_model_registry
from typing import Any, Dict, List
import cv2  # type: ignore
from PIL import Image
import easyocr
import requests
from tqdm import tqdm
import shutil
print("Libraries imported!")

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


def generate_masks(image_path):
    image_folder = os.path.dirname(image_path)

    print("Generating masks... This may take a while.")
    os.makedirs(os.path.join(f"{image_folder}", "sam_masks"), exist_ok=True)
    
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    masks = mask_generator.generate(image)
    write_masks_to_folder(masks, os.path.join(f"{image_folder}", "sam_masks"))
    print("Masks generated.")
    return masks

def overlay_masks(image_path, masks):
    print("Overlaying masks...")
    image_folder = os.path.dirname(image_path)
    os.makedirs(os.path.join(f"{image_folder}", "sam_overlays"), exist_ok=True)
    # load images
    for i in range(0, len(masks)):
        print("Overlaying mask " + str(i) + ".png")
        img_org  = cv2.imread(image_path)
        img_mask = cv2.imread(os.path.join(f"{image_folder}", "sam_masks", f"{i}.png"))

    # convert colors
    #img_org  = cv2.cvtColor(img_org, ???)
        img_mask = cv2.cvtColor(img_mask, cv2.COLOR_BGR2GRAY)

    # the same size

    # add alpha channel 
        b, g, r = cv2.split(img_org)
        img_output = cv2.merge([b, g, r, img_mask], 4)

    # write as png which keeps alpha channel 
        cv2.imwrite(os.path.join(f"{image_folder}", "sam_overlays", f"{i}.png"), img_output)
        
    print("Masks overlayed.")

def crop_masks(image_path, masks):
    print("Cropping masks...")
    image_folder = os.path.dirname(image_path)
    os.makedirs(os.path.join(f"{image_folder}", "sam_cropped"), exist_ok=True)
    for i in range(0, len(masks)):
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
        # and if the tallest side is at least 5% of the image height
        if max(w, h) >= 2 * min(w, h) and max(w, h) >= 0.05 * image.shape[0]:
            print("Mask " + str(i) + " is rectangular enough.")
            shutil.copy2(os.path.join(f"{image_folder}", "sam_cropped", f"{i}.png"), os.path.join(f"{image_folder}", "sam_filtered", f"{i}.png"))
            filtered_indexes.append(i)
        else:
            print("Mask " + str(i) + " is not rectangular enough. Removing...")
    print("Masks filtered.")
    return filtered_indexes
    
def read_ocr_text(image_path, indexes):
    print("Reading OCR text...")
    image_folder = os.path.dirname(image_path)
    os.makedirs(os.path.join(f"{image_folder}", "sam_ocr"), exist_ok=True)
    for i in indexes:
        print("Reading OCR text for mask " + str(i) + ".png")
        result = []
        for reader in readers:
            result += reader.readtext(os.path.join(f"{image_folder}", "sam_filtered", f"{i}.png"), detail = 0, min_size=80, rotation_info=[90, 180 ,270], text_threshold=0.8, low_text=0.5)
        with open(os.path.join(f"{image_folder}", "sam_ocr", f"{i}.txt"), "w") as f:
            for text in result:
                f.write(text + " ")
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

def process_image(image_path):
    # Perform image processing here using the loaded script
    print("Processing image:", image_path)
    # Step 1: Use Segment Anything to generate all the masks
    masks = generate_masks(image_path)

    # Step 2: Overlay each mask on the image
    overlay_masks(image_path, masks)

    # Step 3: Crop each overlayed mask
    crop_masks(image_path, masks)

    # Step 4: Filter out masks that are not rectangular enough
    indexes = filter_masks(image_path, masks)

    # Step 5: Read the OCR text for each overlayed mask
    read_ocr_text(image_path, indexes)

    # Step 6: Merge the OCR text for each overlayed mask
    merge_ocr_text(image_path, indexes)

    # Step 6: For each OCR text, call the Google Books API to get the book metadata

    # Step 7: For each book metadata, call the database API to save the book metadata
    
        



def process_worker():
    while True:
        image_path = task_queue.get()  # Get an image path from the task queue

        # Check for a termination signal
        if image_path is None:
            break

        # Process the image
        process_image(image_path)


@app.route("/process_image", methods=["POST"])
def handle_process_image():
    if "image" not in request.files:
        return "No image uploaded.", 400

    image_file = request.files["image"]
    image_hash = hashlib.md5(image_file.read()).hexdigest()
    filename = f"base.{image_file.filename.rsplit('.', 1)[-1].lower()}"
    os.makedirs(os.path.join(os.getcwd(), "processing_requests", f"{image_hash}"), exist_ok=True)
    image_path = os.path.join(os.getcwd(), "processing_requests", f"{image_hash}", filename)
    image_file.seek(0)
    image_file.save(image_path)
    task_queue.put(image_path)
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
