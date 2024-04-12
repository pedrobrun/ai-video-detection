from datetime import datetime, timedelta
from sqlalchemy import func
from database.connection import db
from flask import current_app as app
from enums.detection import DetectionStatus
from models.prediction import Prediction
from models.detection import Detection

def update_processing_detections():
    stale_threshold = datetime.now() - timedelta(minutes=60)
    
    # Construct a query to find all detections that are still marked as PROCESSING
    # but haven't received a new prediction in the last X minutes
    query = Detection.query.join(
        Prediction, isouter=True
    ).filter(
        Detection.status == DetectionStatus.PROCESSING
    ).group_by(
        Detection.id
    )

    query = query.having(
        func.coalesce(func.max(Prediction.created_at), datetime.min) < stale_threshold
    )

    detections_to_update = query.all()

    for detection in detections_to_update:
        detection.status = DetectionStatus.IDLE
        app.logger.info(f"Updated detection {detection.id} to IDLE.")
    
    db.session.commit()

