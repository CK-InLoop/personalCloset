# Closet Organizer Backend
# Flask application setup
from flask import Flask
from flask_cors import CORS
import os

from extensions import db, bcrypt, login_manager
from models import User

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    
    # Configure CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Configure application
    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI='sqlite:///closet_organizer.db',
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
    )

    # Create instance folder if it doesn't exist
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Initialize extensions with app
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'

    # Create uploads directory if it doesn't exist
    app.config['UPLOAD_FOLDER'] = os.path.join(app.instance_path, '..', 'uploads')
    app.config['PYTHON_EXECUTABLE'] = os.path.join(os.path.dirname(__file__), '.venv', 'Scripts', 'python.exe')
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Import and register blueprints
    from auth import auth_bp
    from api import api_bp
    
    # Register blueprints with URL prefixes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
