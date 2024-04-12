from database.connection import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid
    
class Prediction(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    class_name = db.Column(db.String(255), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    box_left = db.Column(db.Integer, nullable=False)
    box_top = db.Column(db.Integer, nullable=False)
    box_width = db.Column(db.Integer, nullable=False)
    box_height = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    frame_number = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.Float, nullable=False)

    detection_id = db.Column(UUID(as_uuid=True), db.ForeignKey('detection.id'), nullable=False)
    detection = db.relationship('Detection', backref=db.backref('predictions', lazy=True))
