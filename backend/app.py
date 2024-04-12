from flask import Flask
from config import Config
from services.jobs import update_processing_detections
from services.onnx import OnnxService
from database.connection import db
from dotenv import load_dotenv
from flask_migrate import Migrate
from flask_executor import Executor
from flask_cors import CORS
from flask_apscheduler import APScheduler

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    
    db.init_app(app)
    Migrate(app, db)

    setup_scheduler(app)
    setup_executor(app)

    from routes import main
    app.register_blueprint(main)

    return app

def setup_scheduler(app):
    scheduler = APScheduler()
    scheduler.init_app(app)

    def job_wrapper():
        with app.app_context():
            update_processing_detections()

    scheduler.add_job(
        id='Update Idle Processing Detections',
        func=job_wrapper,
        trigger='interval',
        minutes=5,
        next_run_time=None
    )
    scheduler.start()

def setup_executor(app):
    executor = Executor(app)
    app.executor = executor
    app.model = OnnxService("yolov8n")

if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', debug=app.config['DEBUG'])