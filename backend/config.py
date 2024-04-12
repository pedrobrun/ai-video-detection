import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    EXECUTOR_TYPE = 'process'
    EXECUTOR_MAX_WORKERS = 4
    DEBUG = True
