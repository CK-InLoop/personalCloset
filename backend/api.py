from flask import request, jsonify, Blueprint
from flask_login import login_required, current_user
from app import db
from models import Clothing, Outfit
import os
from werkzeug.utils import secure_filename

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
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
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
