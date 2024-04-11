from datetime import datetime, timedelta
from database.connection import db
from flask import current_app as app
from enums.detection import DetectionStatus
from models.prediction import Prediction
from models.detection import Detection

def update_processing_detections():
    ten_minutes_ago = datetime.now() - timedelta(minutes=10)
    
    # Query for detections that are PROCESSING and have not had a new prediction in the last 10 minutes
    detections_to_update = Detection.query.filter(
        Detection.status == DetectionStatus.PROCESSING,
        Detection.predictions.any(Prediction.created_at < ten_minutes_ago) | ~Detection.predictions.any()
    ).all()
    
    for detection in detections_to_update:
        detection.status = DetectionStatus.STOPPED
        app.logger.info(f"Updated detection {detection.id} to STOPPED.")
    
    db.session.commit()