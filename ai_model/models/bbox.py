from database.connection import db

class BBOX(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    left = db.Column(db.Integer, nullable=False)
    top = db.Column(db.Integer, nullable=False)
    width = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Integer, nullable=False)
    prediction_id = db.Column(db.Integer, db.ForeignKey('prediction.id'))

    prediction = db.relationship('Prediction', backref=db.backref('boxes', lazy=True))

    def to_dict(self):
        return {
            "left": self.left,
            "top": self.top,
            "width": self.width,
            "height": self.height
        }
