import stitching

stitcher = stitching.Stitcher()
settings = {"detector": "sift", "confidence_threshold": 0.2}
stitcher = Stitcher(**settings)
panorama = stitcher.stitch(["images/1.jpg", "images/2.jpg", 
"images/3.jpg"])


