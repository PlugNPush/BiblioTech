import stitching

from matplotlib import pyplot as plt
import cv2 as cv
import numpy as np

def plot_image(img, figsize_in_inches=(5,5)):
    fig, ax = plt.subplots(figsize=figsize_in_inches)
    ax.imshow(cv.cvtColor(img, cv.COLOR_BGR2RGB))
    plt.show()
    
def plot_images(imgs, figsize_in_inches=(5,5)):
    fig, axs = plt.subplots(1, len(imgs), figsize=figsize_in_inches)
    for col, img in enumerate(imgs):
        axs[col].imshow(cv.cvtColor(img, cv.COLOR_BGR2RGB))
    plt.show()

weir_imgs = ["/Users/plugn/Downloads/Image-Stitching-OpenCV-new/images/IMG_4494 Large.jpeg", "/Users/plugn/Downloads/Image-Stitching-OpenCV-new/images/IMG_4496 Large.jpeg", "/Users/plugn/Downloads/Image-Stitching-OpenCV-new/images/IMG_4497 Large.jpeg"]
print(weir_imgs)

from stitching.image_handler import ImageHandler

img_handler = ImageHandler()
img_handler.set_img_names(weir_imgs)

medium_imgs = list(img_handler.resize_to_medium_resolution())
low_imgs = list(img_handler.resize_to_low_resolution(medium_imgs))
final_imgs = list(img_handler.resize_to_final_resolution())

#stitcher = stitching.Stitcher()
#settings = {"detector": "sift", "confidence_threshold": 0.2}
#stitcher = stitching.Stitcher(**settings)
#panorama = stitcher.stitch(["images/1.jpg", "images/2.jpg", "images/3.jpg"])


from stitching.feature_detector import FeatureDetector

finder = FeatureDetector(detector='orb', nfeatures=3000)
features = [finder.detect_features(img) for img in medium_imgs]
keypoints_center_img = finder.draw_keypoints(medium_imgs[1], features[1])

#plot_image(keypoints_center_img, (15,10))

from stitching.feature_matcher import FeatureMatcher

matcher = FeatureMatcher()
matches = matcher.match_features(features)

all_relevant_matches = matcher.draw_matches_matrix(medium_imgs, features, matches, conf_thresh=0.4, 
                                                   inliers=True, matchColor=(0, 255, 0))

print(matcher.get_confidence_matrix(matches))

for idx1, idx2, img in all_relevant_matches:
    print(f"Matches Image {idx1+1} to Image {idx2+1}")
    #plot_image(img, (20,10))



stitcher = stitching.Stitcher()
settings = {"detector": "sift", "confidence_threshold": 0}
stitcher = stitching.Stitcher(**settings)
panorama = stitcher.stitch(["/Users/plugn/Downloads/Image-Stitching-OpenCV-new/images/IMG_4496 Large.jpeg", "/Users/plugn/Downloads/Image-Stitching-OpenCV-new/images/IMG_4497 Large.jpeg"])
plot_image(panorama, (20,10))