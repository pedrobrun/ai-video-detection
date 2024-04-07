from flask import current_app as app
from models.detection import Detection
from PIL import Image
from database.connection import db

def process_detection(detection_id):
    with app.app_context():
        detection = Detection.query.get(detection_id)
        if not detection:
            app.logger.error(f"Detection ID {detection_id} not found.")
            return

        image_path = detection.image_path
        try:
            with open(image_path, 'rb') as f:
                original_img = Image.open(f).convert('RGB')
        except Exception as e:
            app.logger.error(f"Error loading image {image_path}: {e}")
            detection.status = 'failed'
            db.session.commit()
            return

        try:
            predictions_data = app.model(original_img, detection.confidence, detection.iou)
            serialized_predictions = []

            for prediction_data in predictions_data:
                bbox_data = prediction_data['box']
                app.logger.info("prediction_data", prediction_data)
                serialized_predictions.append({
                    'class_name': prediction_data['class_name'],
                    'confidence': float(prediction_data['confidence']),
                    'box': {
                        'left': bbox_data['left'],
                        'top': bbox_data['top'],
                        'width': bbox_data['width'],
                        'height': bbox_data['height']
                    }
                })

            detection.results = serialized_predictions
            detection.status = 'completed'
            db.session.commit()
            app.logger.info(f"Detection {detection_id} processed successfully.")

        except Exception as e:
            app.logger.error(f"Error processing detection {detection_id}: {e}")
            detection.status = 'failed'
            db.session.commit()

        db.session.commit()