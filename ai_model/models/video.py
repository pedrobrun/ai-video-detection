from database.connection import db

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    video_data = db.Column(db.LargeBinary, nullable=False)  # Storing video as BLOB
