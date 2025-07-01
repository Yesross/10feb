import cv2
import easyocr
import imutils

# Initialize EasyOCR Reader
reader = easyocr.Reader(['en'])

# Load video
cap = cv2.VideoCapture('car.mp4')

# Output video writer
output = cv2.VideoWriter('output_with_plates.avi',
                         cv2.VideoWriter_fourcc(*'XVID'),
                         20,
                         (int(cap.get(3)), int(cap.get(4))))

# Detect plate based on contour shape
def detect_plate(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    blur = cv2.bilateralFilter(gray, 11, 17, 17)  # Noise reduction
    edged = cv2.Canny(blur, 30, 200)

    # Find contours
    cnts = cv2.findContours(edged.copy(), cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)

    cnts = sorted(cnts, key=cv2.contourArea, reverse=True)[:10]
    screenCnt = None

    for c in cnts:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.018 * peri, True)
        if len(approx) == 4:  # License plate is usually a rectangle
            screenCnt = approx
            break

    if screenCnt is None:
        return None, None

    # Crop the plate region
    mask = cv2.drawContours(cv2.cvtColor(frame.copy(), cv2.COLOR_BGR2GRAY), [screenCnt], -1, 255, -1)
    x, y, w, h = cv2.boundingRect(screenCnt)
    cropped = frame[y:y + h, x:x + w]

    return cropped, screenCnt

# Process the video
while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Resize for consistent processing
    frame = imutils.resize(frame, width=800)

    plate_img, plate_contour = detect_plate(frame)

    if plate_img is not None:
        # OCR on detected plate
        result = reader.readtext(plate_img)

        for (bbox, text, prob) in result:
            if prob > 0.4:  # Confidence threshold
                cv2.drawContours(frame, [plate_contour], -1, (0, 255, 0), 3)
                cv2.putText(frame, text.strip(), (plate_contour[0][0][0], plate_contour[0][0][1] - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 0), 2)

    # Show and save output
    output.write(frame)
    cv2.imshow("Number Plate Detection", frame)

    if cv2.waitKey(1) == 27: 
        break

cap.release()
output.release()
cv2.destroyAllWindows()
