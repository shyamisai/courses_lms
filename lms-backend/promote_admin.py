from app import app, db, User

with app.app_context():
    user = User.query.filter_by(email='shyamsaran348@gmail.com').first()
    if user:
        user.role = 'admin'
        db.session.commit()
        print(f'{user.username} promoted to admin!')
    else:
        print('User not found.') 