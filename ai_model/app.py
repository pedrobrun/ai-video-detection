from flask import Flask
from services.onnx import OnnxService
from database.connection import db
from dotenv import load_dotenv
import os
from flask_migrate import Migrate
from flask_executor import Executor
from flask_cors import CORS

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

    db.init_app(app)

    migrate = Migrate(app, db)

    model = OnnxService("yolov8s")

    executor = Executor(app)

    app.model = model
    app.executor = executor

    with app.app_context():
        from routes import main
        app.register_blueprint(main)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', debug=True)