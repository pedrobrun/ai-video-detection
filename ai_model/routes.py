# routes.py
from flask import Blueprint, request, jsonify
from models.detection import Detection
from services.onnx import OnnxService
from database.connection import db
from PIL import Image
from smart_open import open

main = Blueprint('main', __name__)

model = OnnxService("yolov8s")

# @app.route('/detect', methods=['POST'])
# def detect():
#     image_path = request.json['image_path']
#     confidence = request.json['confidence']
#     iou = request.json['iou']
#     with open(image_path, 'rb') as f:
#         original_img = Image.open(f).convert('RGB')
#     predictions = model(original_img, confidence, iou)
#     detections = [p.to_dict() for p in predictions]

#     return jsonify(detections)

@main.route('/detect', methods=['POST'])
def detect():
    data = request.json
    detection = Detection(
        image_path=data['image_path'],
        confidence=data['confidence'],
        iou=data['iou'],
        status='processing'
    )
    db.session.add(detection)
    db.session.commit()

    return jsonify({"message": "Your detection request is being processed", "id": detection.id})

@main.route('/health_check', methods=['GET'])
def health_check():
    if model is None:
        return "Model is not loaded"
    return f"Model {model.model_name} is loaded"

@main.route('/load_model', methods=['POST'])
def load_model():
    model_name = request.json['model_name']
    global model
    model = OnnxService(model_name)
    return f"Model {model_name} is loaded"
