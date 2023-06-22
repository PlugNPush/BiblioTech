import easyocr
reader = easyocr.Reader(['fr','en']) # this needs to run only once to load the model into memory
result = reader.readtext('output-cv2-11-result.png', detail = 0)
result2 = reader.readtext('output-cv2-11-result-side.png', detail = 0)
print(result)
print(result2)