from enums.detection import DetectionStatus
from database.connection import db

class Detection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # image_path = db.Column(db.String(), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    iou = db.Column(db.Float, nullable=False)
    status = db.Column(db.Enum(DetectionStatus), default=DetectionStatus.PROCESSING, nullable=False)
    # results = db.Column(db.JSON, nullable=True)
    model_name = db.Column(db.String(255), nullable=False)
    video_id = db.Column(db.Integer, db.ForeignKey('video.id'), nullable=False)
    video = db.relationship('Video', backref=db.backref('detection_configs', lazy=True))
