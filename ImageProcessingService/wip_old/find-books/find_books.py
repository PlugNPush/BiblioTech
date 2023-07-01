import cv2
import numpy as np

def preprocess_image(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    edged = cv2.Canny(blurred, 1, 50)
    return edged

def find_contours(image):
    contours, _ = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    return contours

def draw_bounding_boxes(image, contours):
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        # Check if the longest edge is at least 3 times longer than the shortest one
        # and if the tallest side is at least 5% of the image height
        if max(w, h) >= 2 * min(w, h) and max(w, h) >= 0.05 * image.shape[0]:
            cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)

    return image

def main(image_path):
    image = cv2.imread(image_path)
    processed_image = preprocess_image(image)
    contours = find_contours(processed_image)
    
    image_with_boxes = draw_bounding_boxes(image.copy(), contours)
    cv2.imshow("All Contours", image_with_boxes)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

image_path = "bookshelf.jpg"
main(image_path)
