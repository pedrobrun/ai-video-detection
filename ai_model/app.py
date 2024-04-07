from flask import Flask
from database.connection import db
from dotenv import load_dotenv
import os
from flask_migrate import Migrate
from flask_executor import Executor

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

    db.init_app(app)

    migrate = Migrate(app, db)

    executor = Executor(app)

    def process_detection(detection_id):
        app.logger.info(f"Processing detection for ID 1: {detection_id}")
        pass

    app.process_detection = process_detection
    app.executor = executor

    with app.app_context():
        from routes import main
        app.register_blueprint(main)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', debug=True)