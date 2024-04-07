from database.connection import db

class Detection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_path = db.Column(db.String(), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    iou = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='processing')
    results = db.Column(db.JSON, nullable=True)
