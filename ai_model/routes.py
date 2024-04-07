from flask import Blueprint, current_app as app, request, jsonify
from models.detection import Detection
from models.video import Video
from services.onnx import OnnxService
from database.connection import db
from services.detection import process_detection
from werkzeug.utils import secure_filename

main = Blueprint('main', __name__)

@main.route('/detect', methods=['POST'])
def detect():
    data = request.json
    detection = Detection(
        image_path=data['image_path'],
        confidence=data['confidence'],
        iou=data['iou'],
        status='processing'
    )

    db.session.add(detection)
    db.session.commit()

    app.executor.submit(process_detection, detection.id)

    return jsonify({"message": "Your detection request is being processed", "id": detection.id})

@main.route('/health_check', methods=['GET'])
def health_check():
    if app.model is None:
        return "Model is not loaded"
    return f"Model {app.model.model_name} is loaded"

@main.route('/load_model', methods=['POST'])
def load_model():
    model_name = request.json['model_name']
    app.model = OnnxService(model_name)
    return f"Model {model_name} is loaded"

@main.route('/videos', methods=['GET'])
def get_videos():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    paginated_videos = Video.query.paginate(page=page, per_page=per_page, error_out=False)
    videos_data = []

    for video in paginated_videos.items:
        videos_data.append({
            'id': video.id,
            'name': video.name,
            'created_at': video.created_at.isoformat(),
        })
    
    return jsonify({
        'videos': videos_data,
        'total': paginated_videos.total,
        'pages': paginated_videos.pages,
        'current_page': paginated_videos.page
    }), 200

@main.route('/upload_video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video part'}), 400
    file = request.files['video']
    if file.filename == '':
        return jsonify({'error': 'No video provided'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        video_data = file.read()
        
        new_video = Video(name=filename, video_data=video_data)
        db.session.add(new_video)
        db.session.commit()
        
        return jsonify({'message': 'Video uploaded successfully', 'id': new_video.id}), 201
    else:
        return jsonify({'error': 'Invalid video format'}), 400

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'mp4', 'avi', 'mov'}