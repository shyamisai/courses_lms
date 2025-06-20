from app import app, db, User, bcrypt

with app.app_context():
    # Create a test user
    test_user = User(
        username='Test User',
        email='test@example.com',
        role='student'
    )
    test_user.set_password('password123')
    
    # Check if user already exists
    existing_user = User.query.filter_by(email='test@example.com').first()
    if not existing_user:
        db.session.add(test_user)
        db.session.commit()
        print('Test user created successfully!')
        print('Email: test@example.com')
        print('Password: password123')
        print('Role: student')
    else:
        print('Test user already exists!') 