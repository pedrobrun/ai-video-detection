from flask import Blueprint, current_app as app, request, jsonify
from models.detection import Detection
from services.onnx import OnnxService
from database.connection import db
from services.detection import process_detection
from PIL import Image

main = Blueprint('main', __name__)

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

    app.executor.submit(process_detection, detection.id)

    return jsonify({"message": "Your detection request is being processed", "id": detection.id})

@main.route('/health_check', methods=['GET'])
def health_check():
    if app.model is None:
        return "Model is not loaded"
    return f"Model {app.model.model_name} is loaded"

@main.route('/load_model', methods=['POST'])
def load_model():
    model_name = request.json['model_name']
    app.model = OnnxService(model_name)
    return f"Model {model_name} is loaded"
