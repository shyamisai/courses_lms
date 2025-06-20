// course-detail.js

// Get course_id from URL and make it global
const params = new URLSearchParams(window.location.search);
const courseId = params.get('course_id');

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

document.addEventListener('DOMContentLoaded', () => {
    if (!courseId) {
        document.getElementById('course-title').textContent = 'Course Not Found';
        document.getElementById('course-error-message').style.display = '';
        // Optionally hide the rest of the content
        document.querySelectorAll('.course-banner, .course-tags, .progress-bar-container, .instructor-card, #yt-section, #modules-lessons-section, .modules-lessons-section, #lesson-content-modal, #module-modal, #lesson-modal, #course-info, #course-files').forEach(el => { if (el) el.style.display = 'none'; });
        return;
    }

    // Fetch course info
    fetch(`http://127.0.0.1:5000/api/courses/${courseId}`, {
        headers: {
            'X-User-Email': localStorage.getItem('email') || ''
        }
    })
    .then(res => res.json())
    .then(course => {
        console.log('[DEBUG] Loaded course:', course);
        // Banner
        document.querySelector('.course-banner-img').src = course.image;
        document.querySelector('.banner-title').textContent = course.title;
        document.querySelector('.banner-instructor').textContent = 'by ' + course.instructor_name;
        // Tags
        document.querySelector('.course-tags').innerHTML = `
          <span class="tag">${course.category}</span>
          <span class="tag">${course.level}</span>
          <span class="tag">${course.language}</span>
        `;
        // Progress Bar
        document.querySelector('.progress-bar').style.width = (course.progress || 0) + '%';
        document.querySelector('.progress-label').textContent = (course.progress || 0) + '% completed';
        // Instructor Card
        document.querySelector('.instructor-photo').src = course.instructor_photo;
        document.querySelector('.instructor-name').textContent = course.instructor_name;
        document.querySelector('.instructor-bio').textContent = course.instructor_bio;
        document.getElementById('course-title').textContent = course.title;
        document.getElementById('course-info').innerHTML = `
            <h2>${course.title}</h2>
            <p><strong>Author:</strong> ${course.author}</p>
            <p><strong>Description:</strong> ${course.description || 'No description yet.'}</p>
        `;
        insertYouTubeSection(course);
    })
    .catch(() => {
        document.getElementById('course-title').textContent = 'Course Not Found';
        document.getElementById('course-error-message').style.display = '';
        // Do NOT hide the rest of the content, so the details remain visible for debugging or partial data.
        // document.querySelectorAll('.course-banner, .course-tags, .progress-bar-container, .instructor-card, #yt-section, #modules-lessons-section, .modules-lessons-section, #lesson-content-modal, #module-modal, #lesson-modal, #course-info, #course-files').forEach(el => { if (el) el.style.display = 'none'; });
    });

    // Placeholder for files (to be implemented with backend)
    document.getElementById('file-list').innerHTML = '<li>Files will appear here once uploaded by the instructor.</li>';

    // Show upload form for instructors/admins
    const userRole = localStorage.getItem('role');
    const uploadForm = document.getElementById('file-upload-form');
    const fileInput = document.getElementById('file-input');
    const uploadStatus = document.getElementById('upload-status');
    if (userRole === 'admin' || userRole === 'instructor') {
        uploadForm.style.display = '';
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const file = fileInput.files[0];
            if (!file) return;
            uploadStatus.textContent = 'Uploading...';
            const formData = new FormData();
            formData.append('file', file);
            fetch(`http://127.0.0.1:5000/api/courses/${courseId}/files`, {
                method: 'POST',
                headers: {
                    'X-User-Email': localStorage.getItem('email') || ''
                },
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.file) {
                    uploadStatus.textContent = 'Upload successful!';
                    fileInput.value = '';
                    loadFileList();
                } else {
                    uploadStatus.textContent = data.message || 'Upload failed.';
                }
            })
            .catch(() => {
                uploadStatus.textContent = 'Upload failed.';
            });
        });
    }

    // Load file list for the course
    function loadFileList() {
        fetch(`http://127.0.0.1:5000/api/courses/${courseId}/files`, {
            headers: {
                'X-User-Email': localStorage.getItem('email') || ''
            }
        })
        .then(res => res.json())
        .then(files => {
            const fileList = document.getElementById('file-list');
            if (!files.length) {
                fileList.innerHTML = '<li>No files uploaded yet.</li>';
                return;
            }
            function getFileIcon(filename) {
                const ext = filename.split('.').pop().toLowerCase();
                if (ext === 'pdf') return '📄';
                if (["doc", "docx"].includes(ext)) return '📝';
                if (["jpg", "jpeg", "png", "gif"].includes(ext)) return '🖼️';
                if (["zip", "rar", "7z"].includes(ext)) return '🗜️';
                return '📁';
            }
            fileList.innerHTML = files.map(f => {
                let deleteBtn = '';
                if (userRole === 'admin' || userRole === 'instructor') {
                    deleteBtn = ` <button class='btn btn-danger btn-sm' style='margin-left:1em;' onclick='deleteFile(${f.id})'>Delete</button>`;
                }
                // Add file icon before filename
                return `<li><button class='btn btn-primary btn-sm' onclick='downloadFile(${f.id}, \"${f.filename.replace(/"/g, '\\"')}\")'>Download</button> <span style='margin-left:0.5em;'>${getFileIcon(f.filename)} ${f.filename}</span> <span style='color:#888;font-size:0.9em;'>(uploaded by ${f.uploaded_by}, ${f.upload_date})</span>${deleteBtn}</li>`;
            }).join('');
        })
        .catch(() => {
            document.getElementById('file-list').innerHTML = '<li>Could not load files.</li>';
        });
    }

    // Add deleteFile to window for inline onclick
    window.deleteFile = function(fileId) {
        if (!confirm('Are you sure you want to delete this file?')) return;
        fetch(`http://127.0.0.1:5000/api/files/${fileId}`, {
            method: 'DELETE',
            headers: {
                'X-User-Email': localStorage.getItem('email') || ''
            }
        })
        .then(res => res.json())
        .then(data => {
            loadFileList();
        });
    }

    // Add downloadFile to window for inline onclick
    window.downloadFile = function(fileId, filename) {
        const userEmail = localStorage.getItem('email');
        if (!userEmail) {
            alert('You must be logged in to download files.');
            return;
        }
        fetch(`http://127.0.0.1:5000/api/files/${fileId}`, {
            headers: {
                'X-User-Email': userEmail
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to download file');
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || 'downloaded_file';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(err => alert('Download failed: ' + err.message));
    }

    // --- Modules and Lessons ---
    const modulesList = document.getElementById('modules-list');
    const addModuleBtn = document.getElementById('add-module-btn');
    const userEmail = localStorage.getItem('email');

    // Show Add Module button for admin/instructor
    if (userRole === 'admin' || userRole === 'instructor') {
        addModuleBtn.style.display = '';
    } else {
        addModuleBtn.style.display = 'none';
    }

    // Load modules for the course
    function loadModules() {
        fetch(`http://127.0.0.1:5000/api/courses/${courseId}/modules`, {
            headers: { 'X-User-Email': userEmail || '' }
        })
        .then(res => res.json())
        .then(modules => {
            if (!modules.length) {
                modulesList.innerHTML = '<p>No modules added yet.</p>';
                return;
            }
            modulesList.innerHTML = modules.map(module => {
                let fileUploadSection = '';
                let fileListSection = `<ul id="module-file-list-${module.id}" class="file-list"></ul>`;
                if (userRole === 'admin' || userRole === 'instructor') {
                    fileUploadSection = `
                      <div class="module-upload-row">
                        <form class="module-file-upload-form" data-module-id="${module.id}" enctype="multipart/form-data" autocomplete="off">
                          <input type="file" name="file" required style="display:none;">
                          <button type="button" class="btn custom-file-btn ripple-effect touch-target" aria-label="Choose file to upload"><i class="fas fa-upload"></i> Choose File</button>
                          <span class="file-name-span" style="min-width:120px;"></span>
                          <button type="submit" class="btn upload-btn ripple-effect touch-target" aria-label="Upload File"><i class="fas fa-cloud-upload-alt"></i> Upload File</button>
                          <span class="upload-status" style="margin-left:1em;"></span>
                        </form>
                      </div>
                    `;
                }
                return `
                  <div class="module-block modern-module-card fade-in" tabindex="0" role="region" aria-label="Module: ${module.title}">
                    <div class="module-accent"></div>
                    <div class="module-header">
                      <div class="module-title-group">
                        <span class="module-title">${module.title}</span>
                        <span class="module-order-badge" title="Module Order">${module.order}</span>
                      </div>
                      <button class="icon-btn focus-outline module-menu-btn" aria-label="Module actions" data-tooltip><i class="fas fa-ellipsis-h"></i><span class="tooltip">Module Actions</span></button>
                    </div>
                    <div class="module-yt-section"></div>
                    <div class="module-upload-section">
                      ${fileUploadSection}
                      ${fileListSection}
                    </div>
                  </div>
                `;
            }).join('');
            // Animate all module cards
            document.querySelectorAll('.module-block').forEach(card => animateModuleCard(card));
            // Enhance file inputs and upload logic
            enhanceModuleFileInputs();
            // Attach upload handlers and load file lists for each module
            document.querySelectorAll('.module-file-upload-form').forEach(form => {
                const moduleId = form.getAttribute('data-module-id');
                const fileInput = form.querySelector('input[type="file"]');
                const customBtn = form.querySelector('.custom-file-btn');
                const fileNameSpan = form.querySelector('.file-name-span');
                const uploadBtn = form.querySelector('.upload-btn');
                const statusSpan = form.querySelector('.upload-status');
                // Custom file button logic
                customBtn.onclick = () => fileInput.click();
                fileInput.onchange = () => {
                    fileNameSpan.textContent = fileInput.files[0] ? fileInput.files[0].name : '';
                };
                form.onsubmit = function(e) {
                    e.preventDefault();
                    const file = fileInput.files[0];
                    if (!file) return;
                    statusSpan.textContent = 'Uploading...';
                    uploadBtn.disabled = true;
                    const formData = new FormData();
                    formData.append('file', file);
                    fetch(`http://127.0.0.1:5000/api/modules/${moduleId}/files`, {
                        method: 'POST',
                        headers: { 'X-User-Email': userEmail || '' },
                        body: formData
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.file) {
                            statusSpan.textContent = 'Upload successful!';
                            fileInput.value = '';
                            fileNameSpan.textContent = '';
                            loadModuleFileList(moduleId);
                        } else {
                            statusSpan.textContent = data.message || 'Upload failed.';
                        }
                    })
                    .catch(() => {
                        statusSpan.textContent = 'Upload failed.';
                    })
                    .finally(() => {
                        uploadBtn.disabled = false;
                    });
                };
            });
            modules.forEach(module => loadModuleFileList(module.id));
        })
        .catch(err => {
            modulesList.innerHTML = '<p style="color:red;">Failed to load modules.</p>';
        });
    }

    function loadModuleFileList(moduleId) {
        fetch(`http://127.0.0.1:5000/api/modules/${moduleId}/files`, {
            headers: { 'X-User-Email': userEmail || '' }
        })
        .then(res => res.json())
        .then(files => {
            const fileList = document.getElementById(`module-file-list-${moduleId}`);
            if (!fileList) return;
            if (!files.length) {
                fileList.innerHTML = '<li>No files uploaded yet.</li>';
                return;
            }
            function getFileIcon(filename) {
                const ext = filename.split('.').pop().toLowerCase();
                if (ext === 'pdf') return '📄';
                if (["doc", "docx"].includes(ext)) return '📝';
                if (["jpg", "jpeg", "png", "gif"].includes(ext)) return '🖼️';
                if (["zip", "rar", "7z"].includes(ext)) return '🗜️';
                return '📁';
            }
            fileList.innerHTML = files.map(f => {
                let deleteBtn = '';
                if (userRole === 'admin' || userRole === 'instructor') {
                    deleteBtn = ` <button class='btn btn-danger btn-sm' style='margin-left:1em;' onclick='deleteFile(${f.id})'>Delete</button>`;
                }
                return `<li><button class='btn btn-primary btn-sm' onclick='downloadFile(${f.id}, \"${f.filename.replace(/\"/g, '\\\"')}\")'>Download</button> <span style='margin-left:0.5em;'>${getFileIcon(f.filename)} ${f.filename}</span> <span style='color:#888;font-size:0.9em;'>(uploaded by ${f.uploaded_by}, ${f.upload_date})</span>${deleteBtn}</li>`;
            }).join('');
        })
        .catch(() => {
            const fileList = document.getElementById(`module-file-list-${moduleId}`);
            if (fileList) fileList.innerHTML = '<li>Could not load files.</li>';
        });
    }

    // --- Modal logic for Add Module ---
    const addModuleModal = document.getElementById('add-module-modal');
    const closeAddModuleModal = document.getElementById('close-add-module-modal');
    const addModuleForm = document.getElementById('add-module-form');
    const moduleTitleInput = document.getElementById('module-title-input');

    addModuleBtn.onclick = function() {
        addModuleModal.style.display = 'block';
        moduleTitleInput.value = '';
        moduleTitleInput.focus();
    };
    closeAddModuleModal.onclick = function() {
        addModuleModal.style.display = 'none';
    };
    window.onclick = function(event) {
        if (event.target === addModuleModal) {
            addModuleModal.style.display = 'none';
        }
    };
    addModuleForm.onsubmit = function(e) {
        e.preventDefault();
        const title = moduleTitleInput.value.trim();
        if (!title) return;
        fetch(`http://127.0.0.1:5000/api/courses/${courseId}/modules`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Email': userEmail || ''
            },
            body: JSON.stringify({ title })
        })
        .then(res => res.json())
        .then(data => {
            addModuleModal.style.display = 'none';
            loadModules();
        })
        .catch(err => alert('Failed to add module.'));
    };

    // Initial load
    loadModules();
    window.loadModules = loadModules; // For debugging

    // Load file list for the course
    loadFileList();

    // --- Module Edit/Delete Logic ---
    function renderModuleActions(module) {
        const userRole = localStorage.getItem('role');
        if (userRole === 'admin' || userRole === 'instructor') {
            return `
                <div class="module-actions">
                    <button class="icon-btn focus-outline" onclick="editModule(${module.id})" data-tooltip><i class="fas fa-edit"></i><span class="tooltip">Edit Module</span></button>
                    <button class="icon-btn focus-outline" onclick="deleteModule(${module.id}, '${module.title}')" data-tooltip><i class="fas fa-trash"></i><span class="tooltip">Delete Module</span></button>
                </div>
            `;
        }
        return '';
    }
    window.editModule = function(moduleId) {
        // Find module data and open modal pre-filled
        fetch(`http://127.0.0.1:5000/api/modules/${moduleId}`)
            .then(res => res.json())
            .then(module => {
                document.getElementById('module-id').value = module.id;
                document.getElementById('module-title').value = module.title;
                document.getElementById('module-description').value = module.description || '';
                document.getElementById('module-order').value = module.order || 0;
                document.getElementById('module-release-date').value = module.release_date || '';
                document.getElementById('module-modal-title').textContent = 'Edit Module';
                document.getElementById('module-modal').style.display = 'block';
            });
    };
    // --- Animate module add/remove, highlight, and undo ---
    let lastDeletedModule = null;
    let lastDeletedModuleIndex = null;
    function showUndoToast(message, undoCallback) {
        showToast(message + ' <button class="btn btn-secondary btn-sm" id="undo-btn">Undo</button>', 'success', 5000);
        setTimeout(() => {
            const btn = document.getElementById('undo-btn');
            if (btn) btn.onclick = null;
        }, 5000);
        setTimeout(() => {
            if (document.getElementById('undo-btn')) {
                document.getElementById('undo-btn').remove();
            }
        }, 5100);
        setTimeout(() => {
            lastDeletedModule = null;
            lastDeletedModuleIndex = null;
        }, 5100);
        setTimeout(() => {
            if (undoCallback) undoCallback();
        }, 0);
    }
    window.deleteModule = function(moduleId, title) {
        if (!confirm(`Are you sure you want to delete module "${title}"?`)) return;
        // Find module index and data before deleting
        fetch(`http://127.0.0.1:5000/api/courses/${courseId}/modules`)
            .then(res => res.json())
            .then(modules => {
                const idx = modules.findIndex(m => m.id === moduleId);
                lastDeletedModule = modules[idx];
                lastDeletedModuleIndex = idx;
                fetch(`http://127.0.0.1:5000/api/modules/${moduleId}`, {
                    method: 'DELETE',
                    headers: { 'X-User-Role': localStorage.getItem('role') || '' }
                })
                .then(res => res.json().then(data => ({ ok: res.ok, data })))
                .then(({ ok, data }) => {
                    if (ok) {
                        showUndoToast('Module deleted!', () => {
                            const btn = document.getElementById('undo-btn');
                            if (btn) {
                                btn.onclick = function() {
                                    // Simulate restore (in real app, re-POST to backend)
                                    fetch(`http://127.0.0.1:5000/api/courses/${courseId}/modules`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'X-User-Role': localStorage.getItem('role') || ''
                                        },
                                        body: JSON.stringify({
                                            title: lastDeletedModule.title,
                                            description: lastDeletedModule.description,
                                            order: lastDeletedModule.order,
                                            release_date: lastDeletedModule.release_date
                                        })
                                    }).then(() => loadModules());
                                    btn.remove();
                                };
                            }
                        });
                        loadModules();
                    } else {
                        showToast(data.message || 'Failed to delete module', 'error');
                    }
                })
                .catch(() => showToast('Failed to delete module', 'error'));
            });
    };
    // --- Animate module add/edit ---
    function animateModuleCard(card) {
        card.classList.add('fade-in', 'highlight');
        setTimeout(() => card.classList.remove('highlight'), 1200);
    }
    // --- Animate lesson add ---
    function animateLessonList() {
        document.querySelectorAll('.lesson-list li').forEach(li => {
            li.classList.add('slide-in');
            setTimeout(() => li.classList.remove('slide-in'), 800);
        });
    }

    // --- Custom File Input Logic for all module upload forms ---
    function enhanceModuleFileInputs() {
        document.querySelectorAll('.module-file-upload-form').forEach(form => {
            const fileInput = form.querySelector('input[type="file"]');
            if (!fileInput) return;
            // Remove any previous custom button and file name span
            form.querySelectorAll('.custom-file-btn, .file-name-span').forEach(el => el.remove());
            // Hide the native input
            fileInput.style.display = 'none';
            // Create custom button
            const customBtn = document.createElement('button');
            customBtn.type = 'button';
            customBtn.className = 'btn custom-file-btn ripple-effect touch-target';
            customBtn.innerHTML = '<i class="fas fa-upload"></i> Choose File';
            customBtn.setAttribute('aria-label', 'Choose file to upload');
            // Insert before the file input
            fileInput.parentNode.insertBefore(customBtn, fileInput);
            // File name span
            const fileNameSpan = document.createElement('span');
            fileNameSpan.className = 'file-name-span';
            fileInput.parentNode.insertBefore(fileNameSpan, fileInput.nextSibling);
            // Button click opens file dialog
            customBtn.onclick = () => fileInput.click();
            // Show file name on change
            fileInput.onchange = () => {
                fileNameSpan.textContent = fileInput.files[0] ? fileInput.files[0].name : '';
            };
        });
    }
    // Call after modules are rendered
    const origLoadModules = window.loadModules;
    window.loadModules = function() {
        origLoadModules.apply(this, arguments);
        setTimeout(enhanceModuleFileInputs, 0);
    };
});

// --- YouTube Video Upload/Display Logic ---
function renderYouTubeSection(course) {
    const userRole = localStorage.getItem('role');
    let html = '';
    if (course.youtube_url) {
        // Show the mini player for all users
        const videoId = extractYouTubeId(course.youtube_url);
        if (videoId) {
            html += `<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
        }
    } else {
        html += `<div class="video-container" style="text-align:center; color:#888; margin-bottom:1em;">No course video available yet.</div>`;
    }
    if (userRole === 'admin' || userRole === 'instructor') {
        html += `<form id="youtube-link-form" style="margin-bottom:1.5em;">
            <label for="youtube-link-input"><b>YouTube Video Link:</b></label>
            <input type="url" id="youtube-link-input" value="${course.youtube_url || ''}" placeholder="https://youtu.be/..." style="width:60%;margin:0 1em 0 0;">
            <button type="submit" class="btn btn-primary">Save</button>
        </form>`;
    }
    return html;
}
function extractYouTubeId(url) {
    // Handles both youtu.be and youtube.com URLs
    let match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
    return match ? match[1] : '';
}
// Insert YouTube section into course detail
function insertYouTubeSection(course) {
    const container = document.querySelector('.course-detail-card');
    if (!container) return;
    let ytSection = document.getElementById('yt-section');
    if (!ytSection) {
        ytSection = document.createElement('div');
        ytSection.id = 'yt-section';
        container.insertBefore(ytSection, container.children[1]); // after banner
    }
    ytSection.innerHTML = renderYouTubeSection(course);
    // Add form handler if present
    const form = document.getElementById('youtube-link-form');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            setButtonLoading(btn, true);
            const link = document.getElementById('youtube-link-input').value.trim();
            const userRole = localStorage.getItem('role');
            // Debug: Log current userRole and courseId
            console.log('[DEBUG] Attempting to save YouTube link:', link, 'userRole:', userRole, 'courseId:', courseId);
            if (userRole !== 'admin' && userRole !== 'instructor') {
                showToast('You must be an instructor or admin to update the YouTube link.', 'error');
                console.error('[DEBUG] Blocked: userRole is not admin/instructor:', userRole);
                setButtonLoading(btn, false);
                return;
            }
            if (!extractYouTubeId(link)) {
                showToast('Please enter a valid YouTube link', 'error');
                setButtonLoading(btn, false);
                return;
            }
            fetch(`http://127.0.0.1:5000/api/courses/${courseId}/youtube`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Role': userRole
                },
                body: JSON.stringify({ youtube_url: link })
            })
            .then(async res => {
                const data = await res.json();
                console.log('[DEBUG] Backend response:', res.status, data);
                setButtonLoading(btn, false);
                return { ok: res.ok, data };
            })
            .then(({ ok, data }) => {
                if (ok) {
                    showToast('YouTube link updated!', 'success');
                    course.youtube_url = link;
                    insertYouTubeSection(course);
                } else {
                    showToast(data.message || 'Failed to update YouTube link', 'error');
                }
            })
            .catch(err => {
                showToast('Failed to update YouTube link', 'error');
                console.error('[DEBUG] Fetch error:', err);
                setButtonLoading(btn, false);
            });
        };
    }
}

// Add loading spinner to Save buttons during async actions
function setButtonLoading(btn, loading) {
    if (loading) {
        btn.classList.add('btn-loading');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Saving...';
    } else {
        btn.classList.remove('btn-loading');
        btn.disabled = false;
        btn.innerHTML = 'Save';
    }
} 