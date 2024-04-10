from flask import current_app as app
from enums.detection import DetectionStatus
from models.prediction import Prediction
from models.detection import Detection
from PIL import Image
from database.connection import db
import cv2
import tempfile
import os

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
            app.logger.debug("THIS IS THE IMAGE: %s", original_img)
            predictions_data = app.model(original_img, detection.confidence, detection.iou)
            app.logger.info('predictions_data: %s', predictions_data)

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

def process_video_blob(video_data, video_id, confidence, iou, model_name):
    # predictions = []

    detection = Detection.query.filter_by(video_id=video_id, confidence=confidence, iou=iou, model_name=model_name).first()
    if not detection:
        detection = Detection(video_id=video_id, confidence=confidence, iou=iou, model_name=model_name)
        db.session.add(detection)
        db.session.commit()
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp_file:
            tmp_file.write(video_data)
            tmp_file_path = tmp_file.name
        
        cap = cv2.VideoCapture(tmp_file_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        frame_count = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame_image = Image.fromarray(frame_rgb)
            
            app.logger.debug("THIS IS THE FRAME AS PIL IMAGE: %s", frame_image)
            
            result = app.model(frame_image, confidence, iou)
            app.logger.info('Result: %s', result)

            for res in result:
                timestamp = frame_count / fps

                prediction = Prediction(
                    detection_id=detection.id,
                    class_name=res['class_name'],
                    confidence=float(res['confidence']),
                    box_left=res['box']['left'],
                    box_top=res['box']['top'],
                    box_width=res['box']['width'],
                    box_height=res['box']['height'],
                    frame_number=frame_count,
                    timestamp=timestamp
                )
                try:
                    db.session.add(prediction)
                    db.session.commit()
                except Exception as e:
                    # Handle or log the exception
                    app.logger.error(f"Failed to insert prediction: {e}")
                    db.session.rollback()
                
                # predictions.append(prediction)
            
            frame_count += 1

        cap.release()
    except Exception as e:
        app.logger.error(f"Error processing video {video_id}: {e}")
        detection.status = DetectionStatus.FAILED
    finally:
        os.unlink(tmp_file_path)
        detection.status = DetectionStatus.SUCCESS
        # if predictions:
            # db.session.bulk_save_objects(predictions)
        db.session.commit()
