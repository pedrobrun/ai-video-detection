from flask_sqlalchemy import SQLAlchemy
import os
from app import app

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')

db = SQLAlchemy(app)
