document.addEventListener('DOMContentLoaded', function() {
    // Check user role and show admin link if admin
    const userRole = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    
    if (userRole === 'admin') {
        const adminLink = document.getElementById('adminLink');
        if (adminLink) {
            adminLink.style.display = 'block';
        }
    }
    
    // Display user information
    const userInfo = document.getElementById('userInfo');
    if (userInfo && username) {
        userInfo.textContent = `Welcome, ${username} (${userRole || 'Student'})`;
    }

    // Update the main welcome message
    const welcomeHeading = document.getElementById('recommended-heading');
    if (welcomeHeading) {
        if (username) {
            welcomeHeading.textContent = `Welcome Back, ${username}!`;
        } else {
            welcomeHeading.textContent = 'Welcome Back!';
        }
    }
    // Dynamically update the 'My Courses' heading for instructors
    const myCoursesHeading = document.getElementById('my-courses-heading');
    if (userRole === 'instructor' && myCoursesHeading) {
        myCoursesHeading.textContent = 'Courses Assigned to You';
    }

    // Header scroll effect
    const header = document.querySelector('.main-header');
    let lastScroll = 0;

    // Remove courseCards from here for dynamic re-querying

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Search functionality
    const searchForm = document.querySelector('.search-container form');
    const searchInput = searchForm.querySelector('input');
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();

        // Re-query courseCards after they are dynamically loaded
        document.querySelectorAll('.course-card').forEach(card => {
            const courseTitle = card.querySelector('.course-content h3').textContent.toLowerCase();
            if (courseTitle.includes(searchTerm)) {
                card.style.display = 'block'; // Or 'flex' if you use flexbox for cards
            } else {
                card.style.display = 'none';
            }
        });

        // If search term is empty, show all cards
        if (searchTerm === '') {
            document.querySelectorAll('.course-card').forEach(card => {
                card.style.display = 'block'; // Or 'flex'
            });
        }
    });

    // Mobile navigation
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Handle image loading (will work on dynamically loaded images too)
    // Existing images from HTML will be handled, new ones need event listeners re-attached if dynamically added
    // For now, assume this runs once. If new images are added, this needs to be called again.
    // Or better, use event delegation

    // Add hover effect to course cards
    // This will now apply to dynamically loaded cards as well because courseCards is re-queried

    // Add click handlers for tags
    // This will now apply to dynamically loaded cards as well

    // Add keyboard navigation
    // This will now apply to dynamically loaded cards as well

    // Add focus styles
    // This will now apply to dynamically loaded cards as well

    // --- Functions for Dynamic Course Loading (moved from outside DOMContentLoaded) ---

    // Function to create a course card HTML element
    function createCourseCard(course, isLocked, showButton) {
        let buttonHtml = '';
        let lockedOverlay = '';
        let cardClass = 'course-card';
        const userRole = localStorage.getItem('role');
        // Fallbacks for buttonType and buttonLabel
        const buttonType = course.buttonType || course.button_type || 'learn';
        const buttonLabel = course.buttonLabel || course.button_label || 'Learn';
        if (isLocked && userRole === 'student') {
            lockedOverlay = `<div style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(255,255,255,0.7);z-index:2;display:flex;align-items:center;justify-content:center;"><span style='font-size:2.5rem;color:#b91c1c;'><i class='fas fa-lock'></i></span></div>`;
        }
        if (showButton && !isLocked) {
            if (buttonType === 'learn') {
                buttonHtml = `<button class="btn btn-learn" onclick="window.location.href='course-detail.html?course_id=${course.id}'" aria-label="${buttonLabel}">
                    <svg viewBox="0 0 24 24" fill="currentColor" height="18" width="18" xmlns="http://www.w3.org/2000/svg" style="margin-right:6px;"><path d="M19 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h11a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-1 16H9V4h9zm-9 2V4a1 1 0 0 1 1-1h1v16H9a1 1 0 0 1-1-1z"/></svg>
                    <span>${buttonLabel}</span>
                </button>`;
            } else if (buttonType === 'register') {
                buttonHtml = `<button class="btn btn-register" aria-label="${buttonLabel}">Register</button>`;
            }
        } else if (showButton && userRole !== 'student') {
            if (buttonType === 'learn') {
                buttonHtml = `<button class="btn btn-learn" onclick="window.location.href='course-detail.html?course_id=${course.id}'" aria-label="${buttonLabel}">
                    <svg viewBox="0 0 24 24" fill="currentColor" height="18" width="18" xmlns="http://www.w3.org/2000/svg" style="margin-right:6px;"><path d="M19 2H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h11a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-1 16H9V4h9zm-9 2V4a1 1 0 0 1 1-1h1v16H9a1 1 0 0 1-1-1z"/></svg>
                    <span>${buttonLabel}</span>
                </button>`;
            } else if (buttonType === 'register') {
                buttonHtml = `<button class="btn btn-register" aria-label="${buttonLabel}">Register</button>`;
            }
        }
        return `
            <div class="${cardClass}" tabindex="0" role="article" style="position:relative;">
                <div class="course-image">
                    <img src="${course.image}" alt="${course.title} course thumbnail" loading="lazy">
                    ${lockedOverlay}
                </div>
                <div class="course-content">
                    <h3>${course.title}</h3>
                    <p class="author">${course.author}</p>
                    <div class="rating" aria-label="${course.rating}.0 out of 5 stars">
                        <span class="stars" aria-hidden="true">★★★★★</span>
                        <span class="rating-value">${course.rating}.0</span>
                    </div>
                    <div class="card-actions">
                        ${buttonHtml}
                    </div>
                </div>
            </div>
        `;
    }

    // Function to render courses into a specific grid
    function renderCourses(coursesToRender, targetGridElement, isLocked, showButton) {
        if (!targetGridElement) return;
        targetGridElement.innerHTML = '';
        coursesToRender.forEach(course => {
            targetGridElement.innerHTML += createCourseCard(course, isLocked, showButton);
        });
    }

    // --- Fetch Courses from Backend API and Render ---

    const myCoursesSection = document.getElementById('my-courses-section');
    const myCoursesGrid = document.getElementById('my-courses-grid');
    const otherCoursesSection = document.getElementById('other-courses-section');
    const otherCoursesGrid = document.getElementById('other-courses-grid');
    const recommendedSection = document.getElementById('recommended-section');
    const recommendedCoursesGrid = document.getElementById('recommended-courses-grid');
    const exploreSection = document.getElementById('explore-section');
    const exploreCoursesGrid = document.getElementById('explore-courses-grid');
    const instructorCoursesSection = document.getElementById('instructor-courses-section');
    const instructorCoursesGrid = document.getElementById('instructor-courses-grid');

    // Always get the email from localStorage
    const userEmail = localStorage.getItem('email') || '';

    // Debug: Log the value of userRole
    console.log('DEBUG userRole:', userRole);

    // Fetch courses with the email header
    fetch('http://127.0.0.1:5000/api/courses', {
        headers: {
            'X-User-Email': userEmail
        }
    })
    .then(async response => {
        const raw = await response.clone().text();
        console.log('DEBUG raw response:', raw);
        return response.json();
    })
    .then(courses => {
        console.log('DEBUG parsed courses:', courses);
        if (userRole === 'student') {
            // Split into myCourses (unlocked) and otherCourses (locked)
            const myCourses = courses.filter(course => course.locked === false);
            const otherCourses = courses.filter(course => course.locked === true);
            // Show/hide sections
            myCoursesSection.style.display = 'block';
            otherCoursesSection.style.display = 'block';
            recommendedSection.style.display = 'none';
            exploreSection.style.display = 'none';
            instructorCoursesSection.style.display = 'none';
            // Render
            renderCourses(myCourses, myCoursesGrid, false, true);
            renderCourses(otherCourses, otherCoursesGrid, true, false);
        } else if (userRole === 'instructor') {
            // Show only assigned courses for instructors in a dedicated section
            myCoursesSection.style.display = 'none';
            otherCoursesSection.style.display = 'none';
            recommendedSection.style.display = 'none';
            exploreSection.style.display = 'none';
            instructorCoursesSection.style.display = 'block';
            if (courses.length === 0) {
                instructorCoursesGrid.innerHTML = '<p>No courses assigned to you yet.</p>';
            } else {
                renderCourses(courses, instructorCoursesGrid, false, true);
            }
        } else {
            // Admin: show all courses
            myCoursesSection.style.display = 'none';
            otherCoursesSection.style.display = 'none';
            recommendedSection.style.display = 'block';
            exploreSection.style.display = 'block';
            instructorCoursesSection.style.display = 'none';
            const recommendedCourses = courses.filter(course => course.buttonType === 'learn');
            const exploreCourses = courses.filter(course => course.buttonType === 'register');
            renderCourses(recommendedCourses, recommendedCoursesGrid, false, true);
            renderCourses(exploreCourses, exploreCoursesGrid, false, true);
        }
    })
    .catch(error => {
        console.error('Error fetching courses:', error);
        if (myCoursesGrid) {
            myCoursesGrid.innerHTML = '<p>Failed to load courses. Please try again later.</p>';
        }
        if (otherCoursesGrid) {
            otherCoursesGrid.innerHTML = '<p>Failed to load courses. Please try again later.</p>';
        }
        if (recommendedCoursesGrid) {
            recommendedCoursesGrid.innerHTML = '<p>Failed to load recommended courses. Please try again later.</p>';
        }
        if (exploreCoursesGrid) {
            exploreCoursesGrid.innerHTML = '<p>Failed to load other courses. Please try again later.</p>';
        }
    });

    // --- Logout functionality ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            window.location.href = 'login.html';
        });
    }

    // --- Toast/Alert Logic ---
    function showToast(message, type = 'success', duration = 3000) {
        let toast = document.getElementById('global-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'global-toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout(() => { toast.className = `toast ${type}`; }, duration);
    }
    // Usage: showToast('Saved!', 'success');

    // --- Loading Spinner Helper ---
    function showLoading(target) {
        if (!target) return;
        target.innerHTML = '<div class="loading-spinner"></div>';
    }
    function hideLoading(target) {
        if (!target) return;
        target.innerHTML = '';
    }
}); 