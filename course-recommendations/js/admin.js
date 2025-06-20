document.addEventListener('DOMContentLoaded', function() {
    // Restrict access to admins only
    if (localStorage.getItem('role') !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Initialize dashboard
    loadDashboardStats();
    loadUsers();
    loadCourses();

    // Event listeners
    document.getElementById('addCourseForm').addEventListener('submit', handleAddCourse);
});

// Tab switching functionality
function showTab(tabName) {
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected content section
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab
    event.target.classList.add('active');
}

// Load dashboard statistics
function loadDashboardStats() {
    fetch('http://127.0.0.1:5000/api/admin/dashboard', {
        headers: {
            'X-User-Role': 'admin'
        }
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('totalUsers').textContent = data.total_users;
        document.getElementById('totalCourses').textContent = data.total_courses;
        document.getElementById('totalStudents').textContent = data.students;
        document.getElementById('totalInstructors').textContent = data.instructors;
    })
    .catch(err => {
        showMessage('Failed to load dashboard statistics', 'error');
    });
}

// Load users
function loadUsers() {
    fetch('http://127.0.0.1:5000/api/users', {
        headers: {
            'X-User-Role': 'admin'
        }
    })
    .then(res => res.json())
    .then(users => {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';
        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                    <select data-user-id="${user.id}" class="role-select">
                        <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
                        <option value="instructor" ${user.role === 'instructor' ? 'selected' : ''}>Instructor</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-primary" onclick="updateUserRole(${user.id})">
                        <i class="fas fa-save"></i> Update
                    </button>
                    <button class="btn btn-danger" onclick="deleteUser(${user.id}, '${user.username}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
                <td>
                    ${user.role === 'student' ? `<button class="btn btn-success" onclick="openCourseModal(${user.id}, '${user.username}', 'student')"><i class='fas fa-book'></i> Manage Courses</button>` : user.role === 'instructor' ? `<button class="btn btn-success" onclick="openCourseModal(${user.id}, '${user.username}', 'instructor')"><i class='fas fa-chalkboard-teacher'></i> Manage Courses</button>` : '-'}
                </td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(err => {
        showMessage('Failed to load users', 'error');
    });
}

// Load courses
function loadCourses() {
    fetch('http://127.0.0.1:5000/api/courses')
    .then(res => res.json())
    .then(courses => {
        const tbody = document.querySelector('#coursesTable tbody');
        tbody.innerHTML = '';
        
        courses.forEach(course => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${course.id}</td>
                <td>${course.title}</td>
                <td>${course.author}</td>
                <td>${course.rating} ⭐</td>
                <td>
                    <button class="btn btn-primary" onclick="editCourse(${course.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteCourse(${course.id}, '${course.title}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(err => {
        showMessage('Failed to load courses', 'error');
    });
}

// Update user role
function updateUserRole(userId) {
    const select = document.querySelector(`select[data-user-id="${userId}"]`);
    const newRole = select.value;
    
    fetch(`http://127.0.0.1:5000/api/users/${userId}/role`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-User-Role': 'admin'
        },
        body: JSON.stringify({ role: newRole })
    })
    .then(res => res.json().then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
        if (ok) {
            showMessage(data.message, 'success');
            loadUsers();
            loadDashboardStats();
        } else {
            showMessage(data.message || 'Failed to update role', 'error');
        }
    })
    .catch(() => {
        showMessage('Failed to update role', 'error');
    });
}

// Delete user
function deleteUser(userId, username) {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) {
        return;
    }
    
    fetch(`http://127.0.0.1:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'X-User-Role': 'admin'
        }
    })
    .then(res => res.json().then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
        if (ok) {
            showMessage(data.message, 'success');
            loadUsers();
            loadDashboardStats();
        } else {
            showMessage(data.message || 'Failed to delete user', 'error');
        }
    })
    .catch(() => {
        showMessage('Failed to delete user', 'error');
    });
}

// Delete course
function deleteCourse(courseId, title) {
    if (!confirm(`Are you sure you want to delete course "${title}"?`)) {
        return;
    }
    
    fetch(`http://127.0.0.1:5000/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
            'X-User-Role': 'admin'
        }
    })
    .then(res => res.json().then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
        if (ok) {
            showMessage(data.message, 'success');
            loadCourses();
            loadDashboardStats();
        } else {
            showMessage(data.message || 'Failed to delete course', 'error');
        }
    })
    .catch(() => {
        showMessage('Failed to delete course', 'error');
    });
}

// Handle add course form submission
function handleAddCourse(event) {
    event.preventDefault();
    
    const formData = {
        title: document.getElementById('courseTitle').value,
        author: document.getElementById('courseAuthor').value,
        image: document.getElementById('courseImage').value,
        rating: parseFloat(document.getElementById('courseRating').value),
        detail_page: document.getElementById('detailPage').value || null
    };
    
    fetch('http://127.0.0.1:5000/api/courses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-User-Role': 'admin'
        },
        body: JSON.stringify(formData)
    })
    .then(res => res.json().then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
        if (ok) {
            showMessage(data.message, 'success');
            event.target.reset();
            loadCourses();
            loadDashboardStats();
            showTab('courses');
        } else {
            showMessage(data.message || 'Failed to add course', 'error');
        }
    })
    .catch(() => {
        showMessage('Failed to add course', 'error');
    });
}

// Edit course (placeholder for future implementation)
function editCourse(courseId) {
    showMessage('Edit functionality will be implemented in the next version', 'error');
}

// Show message
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.href = 'login.html';
}

// Modal logic for course assignment
let currentCourseUserId = null;
function openCourseModal(userId, username, role) {
    const modal = document.getElementById('courseModal');
    const modalTitle = document.getElementById('modalTitle');
    const courseCheckboxes = document.getElementById('courseCheckboxes');
    modal.style.display = 'flex';
    modalTitle.textContent = `Manage Courses for ${role.charAt(0).toUpperCase() + role.slice(1)}: ${username}`;
    courseCheckboxes.innerHTML = '<div class="loading">Loading courses...</div>';
    // Fetch all courses
    fetch('http://127.0.0.1:5000/api/courses', { headers: { 'X-User-Role': 'admin' } })
        .then(res => res.json())
        .then(courses => {
            // Fetch assigned courses for this user
            let url = role === 'student'
                ? `http://127.0.0.1:5000/api/users/${userId}/courses`
                : `http://127.0.0.1:5000/api/instructors/${userId}/courses`;
            fetch(url, { headers: { 'X-User-Role': 'admin' } })
                .then(res => res.json())
                .then(data => {
                    const assigned = data.course_ids || [];
                    courseCheckboxes.innerHTML = courses.map(course => `
                        <div style='margin-bottom:0.5em;'>
                            <label><input type='checkbox' name='course' value='${course.id}' ${assigned.includes(course.id) ? 'checked' : ''}> ${course.title}</label>
                        </div>
                    `).join('');
                });
        });
    // Save handler
    const form = document.getElementById('courseAssignForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        const checked = Array.from(form.elements['course'])
            .filter(cb => cb.checked)
            .map(cb => parseInt(cb.value));
        // Fetch current assignments
        let url = role === 'student'
            ? `http://127.0.0.1:5000/api/users/${userId}/courses`
            : `http://127.0.0.1:5000/api/instructors/${userId}/courses`;
        fetch(url, { headers: { 'X-User-Role': 'admin' } })
            .then(res => res.json())
            .then(data => {
                const assigned = data.course_ids || [];
                // Find to add and remove
                const toAdd = checked.filter(id => !assigned.includes(id));
                const toRemove = assigned.filter(id => !checked.includes(id));
                // Add assignments
                Promise.all([
                    ...toAdd.map(courseId => fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-User-Role': 'admin' },
                        body: JSON.stringify({ course_id: courseId })
                    })),
                    ...toRemove.map(courseId => fetch(`${url}/${courseId}`, {
                        method: 'DELETE',
                        headers: { 'X-User-Role': 'admin' }
                    }))
                ]).then(() => {
                    showMessage('Courses updated!', 'success');
                    modal.style.display = 'none';
                });
            });
    };
    // Close handler
    document.getElementById('closeModalBtn').onclick = function() {
        modal.style.display = 'none';
    };
}

// --- Edit Course Modal Logic ---
window.editCourse = function(courseId) {
    // Find course data from the table row
    const row = Array.from(document.querySelectorAll('#coursesTable tbody tr')).find(tr => tr.querySelector('td') && tr.querySelector('td').textContent == courseId);
    if (!row) return;
    document.getElementById('editCourseId').value = courseId;
    document.getElementById('editCourseTitle').value = row.children[1].textContent;
    document.getElementById('editCourseAuthor').value = row.children[2].textContent;
    document.getElementById('editCourseImage').value = '';
    document.getElementById('editCourseRating').value = parseFloat(row.children[3].textContent);
    // Optionally fetch full course data from backend for image path
    fetch(`http://127.0.0.1:5000/api/courses/${courseId}`)
      .then(res => res.json())
      .then(course => {
        document.getElementById('editCourseImage').value = course.image || '';
      });
    document.getElementById('editCourseModal').style.display = '';
}
document.getElementById('closeEditCourseModal').onclick = function() {
    document.getElementById('editCourseModal').style.display = 'none';
};
document.getElementById('cancelEditCourseBtn').onclick = function() {
    document.getElementById('editCourseModal').style.display = 'none';
};
document.getElementById('editCourseForm').onsubmit = function(e) {
    e.preventDefault();
    const id = document.getElementById('editCourseId').value;
    const data = {
        title: document.getElementById('editCourseTitle').value,
        author: document.getElementById('editCourseAuthor').value,
        image: document.getElementById('editCourseImage').value,
        rating: parseFloat(document.getElementById('editCourseRating').value)
    };
    fetch(`http://127.0.0.1:5000/api/courses/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-User-Role': 'admin'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json().then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
        if (ok) {
            showMessage('Course updated!', 'success');
            document.getElementById('editCourseModal').style.display = 'none';
            loadCourses();
        } else {
            showMessage(data.message || 'Failed to update course', 'error');
        }
    })
    .catch(() => {
        showMessage('Failed to update course', 'error');
    });
}; 