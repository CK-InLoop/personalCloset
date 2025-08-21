from app import app, db

with app.app_context():
    # Drop all tables
    db.drop_all()
    
    # Create all tables
    db.create_all()
    
    print("Database initialized successfully!")
    print("You can now start the backend server with: python app.py")
