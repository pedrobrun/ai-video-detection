from dataclasses import dataclass, field
from typing import List
from .bbox import BBOX
from database.connection import db
from datetime import datetime

@dataclass
class PredictionDataclass:
    class_name: str
    confidence: float
    detection_id: int
    boxes: List[BBOX] = field(default_factory=list)

    def to_dict(self):
        return {
            "class_name": self.class_name,
            "confidence": self.confidence,
            "boxes": [box.to_dict() for box in self.boxes]
        }
    
class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(255), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    box_left = db.Column(db.Integer, nullable=False)
    box_top = db.Column(db.Integer, nullable=False)
    box_width = db.Column(db.Integer, nullable=False)
    box_height = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    frame_number = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.Float, nullable=False)

    detection_id = db.Column(db.Integer, db.ForeignKey('detection.id'), nullable=False)
    detection = db.relationship('Detection', backref=db.backref('predictions', lazy=True))
