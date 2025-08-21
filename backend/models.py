from .app import db
from flask_login import UserMixin
from datetime import datetime

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    clothes = db.relationship('Clothing', backref='owner', lazy=True)
    outfits = db.relationship('Outfit', backref='user', lazy=True)

class Clothing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(256), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # 'top', 'bottom', 'one-piece'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    color = db.Column(db.String(50))
    season = db.Column(db.String(50))
    occasion = db.Column(db.String(50))

class Outfit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    top_id = db.Column(db.Integer, db.ForeignKey('clothing.id'))
    bottom_id = db.Column(db.Integer, db.ForeignKey('clothing.id'))
    one_piece_id = db.Column(db.Integer, db.ForeignKey('clothing.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # Optionally, you can add a name or description for the outfit
    name = db.Column(db.String(100))
    description = db.Column(db.String(300))
