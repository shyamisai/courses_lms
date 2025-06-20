from app import app, db, User

with app.app_context():
    # Check admin user
    admin_user = User.query.filter_by(email='shyamsaran348@gmail.com').first()
    
    if admin_user:
        print(f"✅ Admin user found:")
        print(f"   Username: {admin_user.username}")
        print(f"   Email: {admin_user.email}")
        print(f"   Role: {admin_user.role}")
        print(f"   ID: {admin_user.id}")
    else:
        print("❌ Admin user not found!")
    
    # List all users
    print("\n📋 All users in database:")
    users = User.query.all()
    for user in users:
        print(f"   {user.id}: {user.username} ({user.email}) - Role: {user.role}")
    
    # Count by role
    students = User.query.filter_by(role='student').count()
    instructors = User.query.filter_by(role='instructor').count()
    admins = User.query.filter_by(role='admin').count()
    
    print(f"\n📊 User counts:")
    print(f"   Students: {students}")
    print(f"   Instructors: {instructors}")
    print(f"   Admins: {admins}") 