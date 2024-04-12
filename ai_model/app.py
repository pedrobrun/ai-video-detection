from flask import Flask
from services.jobs import update_processing_detections
from services.onnx import OnnxService
from database.connection import db
from dotenv import load_dotenv
import os
from flask_migrate import Migrate
from flask_executor import Executor
from flask_cors import CORS
from flask_apscheduler import APScheduler

scheduler = APScheduler()

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.app_context().push()
    
    db.init_app(app)
    # db.create_all()

    migrate = Migrate(app, db)

    model = OnnxService("yolov8s")

    app.config['EXECUTOR_TYPE'] = 'thread'
    app.config['EXECUTOR_MAX_WORKERS'] = 4

    executor = Executor(app)

    app.model = model
    app.executor = executor

    with app.app_context():
        from routes import main
        app.register_blueprint(main)

        # Wrapper function that sets up the application context for the job
        def job_wrapper():
            with app.app_context():
                update_processing_detections()

        scheduler.add_job(id='Update Idle Processing Detections',
                          func=job_wrapper,
                          trigger='interval', minutes=1)
        scheduler.start()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', debug=True)