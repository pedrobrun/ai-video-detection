from database.connection import db

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(255), nullable=False)
    confidence = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "class_name": self.class_name,
            "confidence": self.confidence,
            # Adjusted to dynamically include related BBOXes if needed
            "boxes": [box.to_dict() for box in self.boxes]
        }
