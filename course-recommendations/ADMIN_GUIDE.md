# Admin Dashboard Guide - A2000 Solutions

## 🚀 Overview

The Admin Dashboard provides comprehensive management capabilities for the A2000 Solutions Learning Management System. This guide will help you understand and use all the admin features effectively.

## 🔐 Access Requirements

- **Admin Role Required**: Only users with the 'admin' role can access the admin panel
- **Authentication**: Must be logged in with admin credentials

## 📊 Dashboard Features

### 1. Statistics Overview
The dashboard displays real-time statistics:
- **Total Users**: Count of all registered users
- **Total Courses**: Number of available courses
- **Students**: Count of users with 'student' role
- **Instructors**: Count of users with 'instructor' role

### 2. User Management
**Location**: User Management Tab

**Features**:
- View all registered users
- Change user roles (Student → Instructor → Admin)
- Delete users (with confirmation)
- Real-time updates

**Actions**:
- **Update Role**: Change user role using dropdown and "Update" button
- **Delete User**: Remove user with confirmation dialog

### 3. Course Management
**Location**: Course Management Tab

**Features**:
- View all available courses
- Delete courses (with confirmation)
- Course details display

**Actions**:
- **Delete Course**: Remove course with confirmation dialog
- **Edit Course**: (Coming in next version)

### 4. Add New Course
**Location**: Add Course Tab

**Required Fields**:
- **Course Title**: Name of the course
- **Author**: Course instructor/creator
- **Image Path**: Path to course thumbnail (e.g., `images/course-image.jpg`)
- **Rating**: Course rating (0.0 to 5.0)
- **Button Type**: 'learn' or 'register'
- **Button Label**: Text displayed on the button
- **Detail Page**: (Optional) Link to course detail page

## 🔧 Technical Details

### API Endpoints
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/users` - List all users
- `POST /api/users/{id}/role` - Update user role
- `DELETE /api/users/{id}` - Delete user
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create new course
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course

### Security
- Admin authentication via `X-User-Role` header
- Confirmation dialogs for destructive actions
- Role-based access control

## 👥 User Roles

### Student
- Default role for new registrations
- Can view courses and register
- Limited access to system features

### Instructor
- Can create and manage their own courses
- Access to teaching tools
- Student management capabilities

### Admin
- Full system access
- User management
- Course management
- System configuration
- Access to admin dashboard

## 🎯 Best Practices

### User Management
1. **Role Changes**: Always verify before changing user roles
2. **Deletions**: Use confirmation dialogs to prevent accidental deletions
3. **Monitoring**: Regularly check user statistics

### Course Management
1. **Image Paths**: Ensure image files exist before adding courses
2. **Button Types**: Use 'learn' for available courses, 'register' for upcoming
3. **Ratings**: Maintain realistic ratings (0.0 to 5.0)

### Security
1. **Admin Access**: Limit admin accounts to trusted personnel
2. **Logout**: Always logout after admin sessions
3. **Passwords**: Use strong passwords for admin accounts

## 🚨 Troubleshooting

### Common Issues

**Admin Link Not Visible**
- Check if user has 'admin' role
- Verify localStorage contains correct role
- Refresh page after role change

**API Errors**
- Ensure backend server is running
- Check network connectivity
- Verify API endpoints are accessible

**Course Images Not Loading**
- Verify image paths are correct
- Check if image files exist in specified location
- Ensure proper file permissions

### Error Messages

**"Admin access required"**
- User doesn't have admin role
- Authentication header missing

**"Failed to load users/courses"**
- Backend server not running
- Network connectivity issues
- Database connection problems

## 📱 Navigation

### From Main Page
1. Login as admin user
2. Click "Admin Panel" link in navigation
3. Access dashboard features

### Direct Access
- Navigate to `admin.html` (requires admin role)

## 🔄 Updates and Maintenance

### Regular Tasks
- Monitor user statistics
- Review course quality
- Manage user roles
- Clean up inactive users

### System Maintenance
- Backup database regularly
- Monitor system performance
- Update course content
- Review security settings

## 📞 Support

For technical support or questions about admin functionality:
- Check this guide first
- Review browser console for errors
- Verify backend server status
- Contact system administrator

---

**Version**: 1.0  
**Last Updated**: June 2024  
**System**: A2000 Solutions LMS 