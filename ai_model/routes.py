from flask import Blueprint, current_app as app, request, jsonify
from models.prediction import Prediction
from enums.detection import DetectionStatus
from models.detection import Detection
from models.video import Video
from services.onnx import OnnxService
from database.connection import db
from services.detection import process_video_blob
from werkzeug.utils import secure_filename

main = Blueprint('main', __name__)

@main.route('/process_video/<int:video_id>', methods=['POST'])
def process_video(video_id):
    data = request.get_json()

    confidence = data.get('confidence')
    iou = data.get('iou')

    if confidence is None:
        return jsonify({'error': 'Confidence not provided'}), 400
    if iou is None:
        return jsonify({'error': 'IoU not provided'}), 400


    video = Video.query.get(video_id)
    if not video:
        return jsonify({'error': 'Video not found'}), 404
    
    detection = Detection.query.filter_by(video_id=video_id, confidence=confidence, iou=iou, model_name=app.model.model_name).first()
    
    if detection and detection.status in [DetectionStatus.PROCESSING, DetectionStatus.SUCCESS]:
        return jsonify({'message': 'Detection is already processing or has been processed successfully.'}), 200

    try:
        app.executor.submit(process_video_blob, video.video_data, video_id, confidence, iou, app.model.model_name)
        return jsonify({'message': 'Video processing started'}), 202
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

@main.route('/detections', methods=['GET'])
def get_detections():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    paginated_detections = Detection.query.paginate(page=page, per_page=per_page, error_out=False)
    detections_data = []

    for detection in paginated_detections.items:
        detections_data.append({
            'id': detection.id,
            'confidence': detection.confidence,
            'iou': detection.iou,
            'status': detection.status.name,
            'model_name': detection.model_name,
            'video_id': detection.video_id,
        })
    
    return jsonify({
        'detections': detections_data,
        'total': paginated_detections.total,
        'pages': paginated_detections.pages,
        'current_page': paginated_detections.page
    }), 200

@main.route('/detections/<int:detection_id>', methods=['GET'])
def get_detection(detection_id):
    detection = Detection.query.get(detection_id)
    if not detection:
        return jsonify({'error': 'Detection not found'}), 404
    detection_data = detection.to_json()
    
    predictions = Prediction.query.filter_by(detection_id=detection.id).all()
    prediction_data = [{
        'id': prediction.id,
        'class_name': prediction.class_name,
        'confidence': float(prediction.confidence),
        'box_left': prediction.box_left,
        'box_top': prediction.box_top,
        'box_width': prediction.box_width,
        'box_height': prediction.box_height,
        'created_at': prediction.created_at.isoformat(),
        'frame_number': prediction.frame_number,
        'timestamp': float(prediction.timestamp)
    } for prediction in predictions]

    detection_data['predictions'] = prediction_data

    return jsonify(detection_data)


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