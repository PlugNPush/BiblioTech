import cv2

# load images
for i in range(0,99):
	img_org  = cv2.imread('IMG_2699.jpeg')
	img_mask = cv2.imread('segmentanythingdemo.jpeg/IMG_2699/' + 
str(i) + '.png')

# convert colors
#img_org  = cv2.cvtColor(img_org, ???)
	img_mask = cv2.cvtColor(img_mask, cv2.COLOR_BGR2GRAY)

# the same size

# add alpha channel 
	b, g, r = cv2.split(img_org)
	img_output = cv2.merge([b, g, r, img_mask], 4)

# write as png which keeps alpha channel 
	cv2.imwrite('output-cv2-' + str(i) + '.png', img_output)
