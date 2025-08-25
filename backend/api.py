from flask import request, jsonify, Blueprint, current_app, send_from_directory
from flask_login import login_required, current_user
from extensions import db
from models import Clothing, Outfit
import os
from werkzeug.utils import secure_filename
import subprocess
import uuid

# Create API blueprint
api_bp = Blueprint('api', __name__)

ALLOWED_EXTENSIONS = {'png'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api_bp.route('/upload_clothing', methods=['POST'])
@login_required
def upload_clothing():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    category = request.form.get('category')
    color = request.form.get('color')
    season = request.form.get('season')
    occasion = request.form.get('occasion')
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file'}), 400
    filename = secure_filename(file.filename)
    save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(save_path)
    clothing = Clothing(filename=filename, category=category, user_id=current_user.id, color=color, season=season, occasion=occasion)
    db.session.add(clothing)
    db.session.commit()
    return jsonify({'message': 'Clothing uploaded successfully'}), 201

@api_bp.route('/clothes', methods=['GET'])
@login_required
def get_clothes():
    clothes = Clothing.query.filter_by(user_id=current_user.id).all()
    return jsonify([
        {
            'id': c.id,
            'filename': c.filename,
            'category': c.category,
            'color': c.color,
            'season': c.season,
            'occasion': c.occasion
        } for c in clothes
    ])

@api_bp.route('/outfits', methods=['POST'])
@login_required
def save_outfit():
    data = request.get_json()
    top_id = data.get('top_id')
    bottom_id = data.get('bottom_id')
    one_piece_id = data.get('one_piece_id')
    name = data.get('name')
    description = data.get('description')
    outfit = Outfit(user_id=current_user.id, top_id=top_id, bottom_id=bottom_id, one_piece_id=one_piece_id, name=name, description=description)
    db.session.add(outfit)
    db.session.commit()
    return jsonify({'message': 'Outfit saved successfully'}), 201

@api_bp.route('/outfits', methods=['GET'])
@login_required
def get_outfits():
    outfits = Outfit.query.filter_by(user_id=current_user.id).all()
    return jsonify([
        {
            'id': o.id,
            'top_id': o.top_id,
            'bottom_id': o.bottom_id,
            'one_piece_id': o.one_piece_id,
            'name': o.name,
            'description': o.description
        } for o in outfits
    ])

VITON_HD_PATH = os.path.join(os.path.dirname(__file__), 'VITON-HD')

@api_bp.route('/virtual_try_on', methods=['POST'])
@login_required
def virtual_try_on():
    if 'user_image' not in request.files or 'clothing_image' not in request.files:
        return jsonify({'error': 'User image and clothing image are required'}), 400

    user_image = request.files['user_image']
    clothing_image = request.files['clothing_image']

    if user_image.filename == '' or clothing_image.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Secure filenames and create unique names
    user_filename = secure_filename(f"{uuid.uuid4()}.png")
    clothing_filename = secure_filename(f"{uuid.uuid4()}.png")
    
    # Define paths
    viton_dataroot = os.path.join(VITON_HD_PATH, 'datasets', 'test')
    user_image_dir = os.path.join(viton_dataroot, 'image')
    clothing_image_dir = os.path.join(viton_dataroot, 'cloth')
    result_dir = os.path.join(VITON_HD_PATH, 'results', 'test', 'try-on')

    # Create directories if they don't exist
    os.makedirs(user_image_dir, exist_ok=True)
    os.makedirs(clothing_image_dir, exist_ok=True)
    os.makedirs(result_dir, exist_ok=True)

    # Save images
    user_image_path = os.path.join(user_image_dir, user_filename)
    clothing_image_path = os.path.join(clothing_image_dir, clothing_filename)
    user_image.save(user_image_path)
    clothing_image.save(clothing_image_path)

    # Create the test pairs file
    with open(os.path.join(viton_dataroot, 'test_pairs.txt'), 'w') as f:
        f.write(f'{user_filename} {clothing_filename}')

    # Run VITON-HD script
    try:
        subprocess.run(
            [current_app.config['PYTHON_EXECUTABLE'], 'test.py', '--dataroot', './datasets/test', '--name', 'test', '--model', 'tryon'],
            cwd=VITON_HD_PATH,
            check=True,
            capture_output=True,
            text=True
        )
    except subprocess.CalledProcessError as e:
        return jsonify({'error': 'Failed to run VITON-HD', 'details': e.stderr}), 500

    # Result image path
    result_filename = f"{user_filename.split('.')[0]}_{clothing_filename.split('.')[0]}.png"
    result_image_path = os.path.join(result_dir, result_filename)

    if not os.path.exists(result_image_path):
        return jsonify({'error': 'Result image not found'}), 404

    return jsonify({'result_url': f'/api/results/{result_filename}'})

@api_bp.route('/results/<path:filename>')
def get_result(filename):
    result_dir = os.path.join(VITON_HD_PATH, 'results', 'test', 'try-on')
    return send_from_directory(result_dir, filename)
