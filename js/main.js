document.addEventListener('DOMContentLoaded', () => {
    const recommendedCoursesGrid = document.getElementById('recommended-courses-grid');
    const exploreCoursesGrid = document.getElementById('explore-courses-grid');

    // Function to create a course card HTML element
    function createCourseCard(course) {
        let buttonHtml = '';
        if (course.buttonType === 'learn') {
            buttonHtml = `<button class="btn btn-learn" aria-label="${course.buttonLabel}" onclick="window.location.href='${course.detailPage || 'course-detail.html'}'"><i class="fas fa-book-open"></i> Learn</button>`;
        } else if (course.buttonType === 'register') {
            buttonHtml = `<button class="btn btn-register" aria-label="${course.buttonLabel}"><i class="fas fa-user-plus"></i> Register</button>`;
        }

        return `
            <div class="course-card" tabindex="0" role="article">
                <div class="course-image">
                    <img src="${course.image}" alt="${course.title} course thumbnail" loading="lazy">
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
    function renderCourses(coursesToRender, targetGridElement) {
        if (!targetGridElement) return;
        targetGridElement.innerHTML = ''; // Clear existing content
        coursesToRender.forEach(course => {
            targetGridElement.innerHTML += createCourseCard(course);
        });
    }

    // Separate courses for recommended and explore sections
    // This is a simplified split; in a real LMS, this would come from a backend or user preferences
    const recommendedCourses = courses.filter(course => course.id === 'ai-foundations' || course.id === 'erp-essentials');
    const exploreCourses = courses.filter(course => course.id !== 'ai-foundations' && course.id !== 'erp-essentials');

    renderCourses(recommendedCourses, recommendedCoursesGrid);
    renderCourses(exploreCourses, exploreCoursesGrid);
}); 