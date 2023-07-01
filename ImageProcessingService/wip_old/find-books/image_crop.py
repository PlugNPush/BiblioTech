from PIL import Image

# Load image
im = Image.open('output-cv2-11.png')

# Extract alpha channel as new Image and get its bounding box
alpha = im.getchannel('A')
bbox  = alpha.getbbox()

# Apply bounding box to original image
res = im.crop(bbox)
res.save('output-cv2-11-result.png')