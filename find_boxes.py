import cv2
import numpy as np

# Load image
img = cv2.imread(r"c:\Users\USER\Documents\SQR400\SQR400\public\temp\1.jpeg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Threshold to get black lines
_, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

h_img, w_img = img.shape[:2]
boxes = []
for cnt in contours:
    x, y, w, h = cv2.boundingRect(cnt)
    # Filter small noise and very large borders
    if w > 50 and h > 20 and w < w_img*0.9 and h < h_img*0.9:
        boxes.append({
            'x': x, 'y': y, 'w': w, 'h': h,
            'left_pct': (x / w_img) * 100,
            'top_pct': (y / h_img) * 100,
            'w_pct': (w / w_img) * 100,
            'h_pct': (h / h_img) * 100
        })

# Sort by top to bottom, then left to right
boxes.sort(key=lambda b: (round(b['top_pct']/5)*5, b['left_pct']))

for i, b in enumerate(boxes):
    print(f"Box {i}: left={b['left_pct']:.1f}%, top={b['top_pct']:.1f}%, w={b['w_pct']:.1f}%, h={b['h_pct']:.1f}%")
