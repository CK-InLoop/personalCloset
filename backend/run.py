from app import create_app, db
from models import User, Clothing, Outfit

def init_db():
    app = create_app()
    with app.app_context():
        # Drop all tables
        db.drop_all()
        
        # Create all tables
        db.create_all()
        
        # Create a test user
        from app import bcrypt
        hashed_password = bcrypt.generate_password_hash('test123').decode('utf-8')
        user = User(username='testuser', email='test@example.com', password=hashed_password)
        db.session.add(user)
        db.session.commit()
        
        print("Database initialized successfully!")

if __name__ == '__main__':
    init_db()
    print("Starting the Flask application...")
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
