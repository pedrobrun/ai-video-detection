from PIL import Image
from flask import Flask, request, jsonify
from smart_open import open
from services.onnx import ONNX
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

model = ONNX("yolov8s")

@app.route('/detect', methods=['POST'])
def detect():
    image_path = request.json['image_path']
    confidence = request.json['confidence']
    iou = request.json['iou']
    with open(image_path, 'rb') as f:
        original_img = Image.open(f).convert('RGB')
    predictions = model(original_img, confidence, iou)
    detections = [p.to_dict() for p in predictions]

    return jsonify(detections)

@app.route('/health_check', methods=['GET'])
def health_check():
    if model is None:
        return "Model is not loaded"
    return f"Model {model.model_name} is loaded"

@app.route('/load_model', methods=['POST'])
def load_model():
    model_name = request.json['model_name']
    global model
    model = ONNX(model_name)
    return f"Model {model_name} is loaded"

if __name__ == "__main__":
    app.run(host='0.0.0.0')
