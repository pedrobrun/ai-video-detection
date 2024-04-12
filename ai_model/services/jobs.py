from datetime import datetime, timedelta
from sqlalchemy import func
from database.connection import db
from flask import current_app as app
from enums.detection import DetectionStatus
from models.prediction import Prediction
from models.detection import Detection

def update_processing_detections():
    ten_minutes_ago = datetime.now() - timedelta(minutes=60)
    
    # Query for detections that are PROCESSING and have not had a new prediction in the last 30 minutes
    detections_to_update = Detection.query.join(Prediction, isouter=True).filter(
        Detection.status == DetectionStatus.PROCESSING
    ).group_by(Detection.id).having(
        func.max(Prediction.created_at) < ten_minutes_ago if Prediction.created_at is not None else True
    ).all()

    for detection in detections_to_update:
        detection.status = DetectionStatus.IDLE
        app.logger.info(f"Updated detection {detection.id} to IDLE.")
    
    db.session.commit()
