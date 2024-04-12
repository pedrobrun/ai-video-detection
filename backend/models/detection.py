from datetime import datetime
from enums.detection import DetectionStatus
from database.connection import db
import base64
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Detection(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    confidence = db.Column(db.Float, nullable=False)
    iou = db.Column(db.Float, nullable=False)
    status = db.Column(db.Enum(DetectionStatus), default=DetectionStatus.PROCESSING, nullable=False)
    model_name = db.Column(db.String(255), nullable=False)
    video_id = db.Column(UUID(as_uuid=True), db.ForeignKey('video.id'), nullable=False)
    video = db.relationship('Video', backref=db.backref('detection_configs', lazy=True))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now())
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now(), onupdate=datetime.now())

    def to_json(self):
        video = {
            'id': self.video.id,
            'name': self.video.name,
            'created_at': self.video.created_at.isoformat(),
            'updated_at': self.video.updated_at.isoformat(),
            'video_data': base64.b64encode(self.video.video_data).decode('utf-8') if self.video.video_data else None
        }
        return {
            'id': self.id,
            'confidence': self.confidence,
            'iou': self.iou,
            'status': self.status.name if self.status else None,
            'model_name': self.model_name,
            'video_id': self.video_id,
            'video': video
        }