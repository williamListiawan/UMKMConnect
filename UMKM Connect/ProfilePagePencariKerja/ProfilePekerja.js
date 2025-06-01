// DOM Elements
const userAvatar = document.getElementById('userAvatar');
const dropdownMenu = document.getElementById('dropdownMenu');
const downloadCvBtn = document.getElementById('downloadCvBtn');
const editModal = document.getElementById('editModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const statNumbers = document.querySelectorAll('.stat-number');

// User data
const userData = {
    name: 'Chilly Willy',
    role: 'Pencari Kerja',
    avatar: '/placeholder.svg?height=40&width=40',
    personalInfo: {
        fullName: 'Chilly Willy',
        email: 'chilly.willy@email.com',
        phone: '+62 812-3456-7890',
        location: 'Jakarta, Indonesia',
        aboutMe: 'Saya adalah seorang profesional muda yang berpengalaman dalam bidang kuliner dengan latar belakang pendidikan Tata Boga. Memiliki passion yang tinggi dalam memasak dan mengembangkan kreativitas dalam menciptakan hidangan yang lezat dan menarik. Saya memiliki kemampuan bekerja dalam tim, disiplin, dan selalu berusaha memberikan yang terbaik dalam setiap pekerjaan.'
    },
    education: [
        {
            id: 1,
            degree: 'SMK',
            school: 'SMKN 1 Depok',
            major: 'Jurusan Tataboga',
            startDate: 'Sep 2021',
            endDate: 'Jun 2024'
        },
        {
            id: 2,
            degree: 'S1 Tataboga',
            school: 'SMKN 1 Depok',
            major: 'Jurusan Tataboga',
            startDate: 'Sep 2024',
            endDate: 'Sekarang'
        }
    ],
    skills: ['Disiplin', 'Pekerja keras', 'Komunikatif', 'Manajemen Waktu'],
    experience: [
        {
            id: 1,
            position: 'Juru Masak',
            company: 'Mie Yamin 88',
            startDate: 'Jan 2022',
            endDate: '2024',
            description: 'Merencanakan dan menyiapkan berbagai jenis hidangan sesuai dengan standar restoran. Mengelola bahan makanan, mulai dari persiapan hingga proses memasak. Menjaga kebersihan dapur dan mematuhi standar kebersihan serta keamanan makanan (food safety).'
        }
    ],
    stats: {
        applications: 12,
        interviews: 3,
        profileCompletion: 85
    }
};

// Current editing section
let currentEditingSection = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeUser();
    animateStatNumbers();
    setupEventListeners();
    addAnimations();
    updateProfileCompletion();
});

// Initialize user data
function initializeUser() {
    userAvatar.src = userData.avatar;
    userAvatar.alt = userData.name;
    
    // Update profile name
    document.querySelector('.profile-name').textContent = userData.name;
    
    // Update personal info fields
    document.getElementById('fullName').value = userData.personalInfo.fullName;
    document.getElementById('email').value = userData.personalInfo.email;
    document.getElementById('phone').value = userData.personalInfo.phone;
    document.getElementById('location').value = userData.personalInfo.location;
    document.getElementById('aboutMe').value = userData.personalInfo.aboutMe;
}

// Animate stat numbers
function animateStatNumbers() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(number => {
        observer.observe(number);
    });
}

function animateNumber(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (element.parentElement.querySelector('.stat-label').textContent === 'Profile') {
            element.textContent = Math.floor(current) + '%';
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Setup event listeners
function setupEventListeners() {
    // Download CV button
    downloadCvBtn.addEventListener('click', handleDownloadCV);
    
    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            handleEditSection(section);
        });
    });
    
    // Modal close
    closeModal.addEventListener('click', closeEditModal);
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
    
    // Section action buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-cancel')) {
            const section = e.target.dataset.section;
            cancelEdit(section);
        }
        
        if (e.target.classList.contains('btn-save')) {
            const section = e.target.dataset.section;
            saveEdit(section);
        }
    });
    
    // Add skill functionality
    document.addEventListener('click', function(e) {
        if (e.target.id === 'addSkillBtn' || e.target.closest('#addSkillBtn')) {
            addSkill();
        }
        
        if (e.target.classList.contains('skill-remove') || e.target.closest('.skill-remove')) {
            const skillTag = e.target.closest('.skill-tag');
            removeSkill(skillTag);
        }
    });
    
    // Enter key for skill input
    document.addEventListener('keydown', function(e) {
        if (e.target.id === 'skillInput' && e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    });
}

// Handle download CV
function handleDownloadCV() {
    showNotification('Mengunduh CV...', 'info');
    
    // Simulate download
    setTimeout(() => {
        showNotification('CV berhasil diunduh!', 'success');
        
        // In real app, this would trigger actual download
        const link = document.createElement('a');
        link.href = '#'; // Would be actual CV file URL
        link.download = `CV_${userData.name.replace(' ', '_')}.pdf`;
        // link.click();
    }, 1500);
}

// Handle edit section
function handleEditSection(section) {
    currentEditingSection = section;
    
    switch(section) {
        case 'personal':
            enablePersonalEdit();
            break;
        case 'education':
            enableEducationEdit();
            break;
        case 'skills':
            enableSkillsEdit();
            break;
        case 'experience':
            enableExperienceEdit();
            break;
    }
}

// Enable personal info editing
function enablePersonalEdit() {
    const section = document.getElementById('personalInfoSection');
    const inputs = section.querySelectorAll('input, textarea');
    const editBtn = section.querySelector('.btn-edit');
    const actions = section.querySelector('.section-actions');
    
    // Enable inputs
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.style.background = 'white';
    });
    
    // Hide edit button, show actions
    editBtn.style.display = 'none';
    actions.style.display = 'flex';
    
    // Focus first input
    inputs[0].focus();
}

// Enable education editing
function enableEducationEdit() {
    const section = document.getElementById('educationSection');
    const editBtn = section.querySelector('.btn-edit');
    const actions = section.querySelector('.section-actions');
    const addBtn = document.getElementById('addEducationBtn');
    
    // Hide edit button, show actions and add button
    editBtn.style.display = 'none';
    actions.style.display = 'flex';
    addBtn.style.display = 'flex';
    
    // Make education items editable
    const educationItems = section.querySelectorAll('.education-item');
    educationItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => editEducationItem(item));
    });
}

// Enable skills editing
function enableSkillsEdit() {
    const section = document.getElementById('skillsSection');
    const editBtn = section.querySelector('.btn-edit');
    const actions = section.querySelector('.section-actions');
    const skillInput = document.querySelector('.skill-input-container');
    const removeButtons = section.querySelectorAll('.skill-remove');
    
    // Hide edit button, show actions and input
    editBtn.style.display = 'none';
    actions.style.display = 'flex';
    skillInput.style.display = 'flex';
    
    // Show remove buttons
    removeButtons.forEach(btn => {
        btn.style.display = 'flex';
    });
}

// Enable experience editing
function enableExperienceEdit() {
    const section = document.getElementById('experienceSection');
    const editBtn = section.querySelector('.btn-edit');
    const actions = section.querySelector('.section-actions');
    const addBtn = document.getElementById('addExperienceBtn');
    
    // Hide edit button, show actions and add button
    editBtn.style.display = 'none';
    actions.style.display = 'flex';
    addBtn.style.display = 'flex';
    
    // Make experience items editable
    const experienceItems = section.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => editExperienceItem(item));
    });
}

// Cancel edit
function cancelEdit(section) {
    switch(section) {
        case 'personal':
            cancelPersonalEdit();
            break;
        case 'education':
            cancelEducationEdit();
            break;
        case 'skills':
            cancelSkillsEdit();
            break;
        case 'experience':
            cancelExperienceEdit();
            break;
    }
    
    currentEditingSection = null;
}

// Cancel personal edit
function cancelPersonalEdit() {
    const section = document.getElementById('personalInfoSection');
    const inputs = section.querySelectorAll('input, textarea');
    const editBtn = section.querySelector('.btn-edit');
    const actions = section.querySelector('.section-actions');
    
    // Reset values and disable inputs
    document.getElementById('fullName').value = userData.personalInfo.fullName;
    document.getElementById('email').value = userData.personalInfo.email;
    document.getElementById('phone').value = userData.personalInfo.phone;
    document.getElementById('location').value = userData.personalInfo.location;
    document.getElementById('aboutMe').value = userData.personalInfo.aboutMe;
    
    inputs.forEach(input => {
        input.setAttribute('readonly', true);
        input.style.background = '#f8f9fa';
    });
    
    // Show edit button, hide actions
    editBtn.style.display = 'flex';
    actions.style.display = 'none';
}

// Cancel education edit
function cancelEducationEdit() {
    const section = document.getElementById('educationSection');
    const editBtn = section.querySelector('.btn-edit');
    const actions = section.querySelector('.section-actions');
    const addBtn = document.getElementById('addEducationBtn');
    
    // Show edit button, hide actions and add button
    editBtn.style.display = 'flex';
    actions.style.display = 'none';
    addBtn.style.display = 'none';
    
    // Reset education items
    renderEducation();
}

// Cancel skills edit
function cancelSkillsEdit() {
    const section = document.getElementById('skillsSection');
    const editBtn = section.querySelector('.btn-edit');
    const actions = section.querySelector('.section-actions');
    const skillInput = document.querySelector('.skill-input-container');
    const removeButtons = section.querySelectorAll('.skill-remove');
    
    // Show edit button, hide actions and input
    editBtn.style.display = 'flex';
    actions.style.display = 'none';
    skillInput.style.display = 'none';
    
    // Hide remove buttons
    removeButtons.forEach(btn => {
        btn.style.display = 'none';
    });
    
    // Clear input
    document.getElementById('skillInput').value = '';
    
    // Reset skills
    renderSkills();
}

// Cancel experience edit
function cancelExperienceEdit() {
    const section = document.getElementById('experienceSection');
    const editBtn = section.querySelector('.btn-edit');
    const actions = section.querySelector('.section-actions');
    const addBtn = document.getElementById('addExperienceBtn');
    
    // Show edit button, hide actions and add button
    editBtn.style.display = 'flex';
    actions.style.display = 'none';
    addBtn.style.display = 'none';
    
    // Reset experience items
    renderExperience();
}

// Save edit
function saveEdit(section) {
    switch(section) {
        case 'personal':
            savePersonalEdit();
            break;
        case 'education':
            saveEducationEdit();
            break;
        case 'skills':
            saveSkillsEdit();
            break;
        case 'experience':
            saveExperienceEdit();
            break;
    }
    
    currentEditingSection = null;
    updateProfileCompletion();
}

// Save personal edit
function savePersonalEdit() {
    const section = document.getElementById('personalInfoSection');
    
    // Update user data
    userData.personalInfo.fullName = document.getElementById('fullName').value;
    userData.personalInfo.email = document.getElementById('email').value;
    userData.personalInfo.phone = document.getElementById('phone').value;
    userData.personalInfo.location = document.getElementById('location').value;
    userData.personalInfo.aboutMe = document.getElementById('aboutMe').value;
    
    // Update profile name
    document.querySelector('.profile-name').textContent = userData.personalInfo.fullName;
    userData.name = userData.personalInfo.fullName;
    
    cancelPersonalEdit();
    showNotification('Informasi pribadi berhasil diperbarui!', 'success');
}

// Save education edit
function saveEducationEdit() {
    cancelEducationEdit();
    showNotification('Pendidikan berhasil diperbarui!', 'success');
}

// Save skills edit
function saveSkillsEdit() {
    cancelSkillsEdit();
    showNotification('Keahlian berhasil diperbarui!', 'success');
}

// Save experience edit
function saveExperienceEdit() {
    cancelExperienceEdit();
    showNotification('Pengalaman kerja berhasil diperbarui!', 'success');
}

// Add skill
function addSkill() {
    const skillInput = document.getElementById('skillInput');
    const skillValue = skillInput.value.trim();
    
    if (skillValue && !userData.skills.includes(skillValue)) {
        userData.skills.push(skillValue);
        renderSkills();
        skillInput.value = '';
        skillInput.focus();
    }
}

// Remove skill
function removeSkill(skillTag) {
    const skillValue = skillTag.dataset.skill;
    const index = userData.skills.indexOf(skillValue);
    
    if (index > -1) {
        userData.skills.splice(index, 1);
        skillTag.remove();
    }
}

// Render skills
function renderSkills() {
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    
    userData.skills.forEach(skill => {
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.dataset.skill = skill;
        
        skillTag.innerHTML = `
            <span>${skill}</span>
            <button class="skill-remove" style="display: none;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `;
        
        skillsList.appendChild(skillTag);
    });
}

// Render education
function renderEducation() {
    const educationList = document.getElementById('educationList');
    educationList.innerHTML = '';
    
    userData.education.forEach(edu => {
        const educationItem = document.createElement('div');
        educationItem.className = 'education-item';
        educationItem.dataset.educationId = edu.id;
        
        educationItem.innerHTML = `
            <div class="education-header">
                <div class="education-degree">${edu.degree}</div>
                <div class="education-period">${edu.startDate} - ${edu.endDate}</div>
            </div>
            <div class="education-school">${edu.school}</div>
            <div class="education-major">${edu.major}</div>
        `;
        
        educationList.appendChild(educationItem);
    });
}

// Render experience
function renderExperience() {
    const experienceList = document.getElementById('experienceList');
    experienceList.innerHTML = '';
    
    userData.experience.forEach(exp => {
        const experienceItem = document.createElement('div');
        experienceItem.className = 'experience-item';
        experienceItem.dataset.experienceId = exp.id;
        
        experienceItem.innerHTML = `
            <div class="experience-header">
                <div class="experience-position">${exp.position}</div>
                <div class="experience-period">${exp.startDate} - ${exp.endDate}</div>
            </div>
            <div class="experience-company">${exp.company}</div>
            <div class="experience-description">${exp.description}</div>
        `;
        
        experienceList.appendChild(experienceItem);
    });
}

// Edit education item
function editEducationItem(item) {
    const educationId = parseInt(item.dataset.educationId);
    const education = userData.education.find(edu => edu.id === educationId);
    
    if (!education) return;
    
    modalTitle.textContent = 'Edit Pendidikan';
    modalBody.innerHTML = `
        <form id="educationForm">
            <div class="form-grid">
                <div class="form-group">
                    <label for="eduDegree">Tingkat Pendidikan</label>
                    <input type="text" id="eduDegree" value="${education.degree}" required>
                </div>
                <div class="form-group">
                    <label for="eduSchool">Nama Sekolah/Universitas</label>
                    <input type="text" id="eduSchool" value="${education.school}" required>
                </div>
                <div class="form-group">
                    <label for="eduMajor">Jurusan</label>
                    <input type="text" id="eduMajor" value="${education.major}" required>
                </div>
                <div class="form-group">
                    <label for="eduStartDate">Tanggal Mulai</label>
                    <input type="text" id="eduStartDate" value="${education.startDate}" required>
                </div>
                <div class="form-group">
                    <label for="eduEndDate">Tanggal Selesai</label>
                    <input type="text" id="eduEndDate" value="${education.endDate}" required>
                </div>
            </div>
            <div class="section-actions">
                <button type="button" class="btn-cancel" onclick="closeEditModal()">Batal</button>
                <button type="submit" class="btn-save">Simpan</button>
            </div>
        </form>
    `;
    
    openEditModal();
    
    // Handle form submission
    document.getElementById('educationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        education.degree = document.getElementById('eduDegree').value;
        education.school = document.getElementById('eduSchool').value;
        education.major = document.getElementById('eduMajor').value;
        education.startDate = document.getElementById('eduStartDate').value;
        education.endDate = document.getElementById('eduEndDate').value;
        
        renderEducation();
        closeEditModal();
        showNotification('Pendidikan berhasil diperbarui!', 'success');
    });
}

// Edit experience item
function editExperienceItem(item) {
    const experienceId = parseInt(item.dataset.experienceId);
    const experience = userData.experience.find(exp => exp.id === experienceId);
    
    if (!experience) return;
    
    modalTitle.textContent = 'Edit Pengalaman Kerja';
    modalBody.innerHTML = `
        <form id="experienceForm">
            <div class="form-grid">
                <div class="form-group">
                    <label for="expPosition">Posisi</label>
                    <input type="text" id="expPosition" value="${experience.position}" required>
                </div>
                <div class="form-group">
                    <label for="expCompany">Perusahaan</label>
                    <input type="text" id="expCompany" value="${experience.company}" required>
                </div>
                <div class="form-group">
                    <label for="expStartDate">Tanggal Mulai</label>
                    <input type="text" id="expStartDate" value="${experience.startDate}" required>
                </div>
                <div class="form-group">
                    <label for="expEndDate">Tanggal Selesai</label>
                    <input type="text" id="expEndDate" value="${experience.endDate}" required>
                </div>
            </div>
            <div class="form-group full-width">
                <label for="expDescription">Deskripsi Pekerjaan</label>
                <textarea id="expDescription" rows="4" required>${experience.description}</textarea>
            </div>
            <div class="section-actions">
                <button type="button" class="btn-cancel" onclick="closeEditModal()">Batal</button>
                <button type="submit" class="btn-save">Simpan</button>
            </div>
        </form>
    `;
    
    openEditModal();
    
    // Handle form submission
    document.getElementById('experienceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        experience.position = document.getElementById('expPosition').value;
        experience.company = document.getElementById('expCompany').value;
        experience.startDate = document.getElementById('expStartDate').value;
        experience.endDate = document.getElementById('expEndDate').value;
        experience.description = document.getElementById('expDescription').value;
        
        renderExperience();
        closeEditModal();
        showNotification('Pengalaman kerja berhasil diperbarui!', 'success');
    });
}

// Open edit modal
function openEditModal() {
    editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close edit modal
function closeEditModal() {
    editModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Update profile completion
function updateProfileCompletion() {
    let completion = 0;
    const totalSections = 5;
    
    // Personal info (20%)
    if (userData.personalInfo.fullName && userData.personalInfo.email && 
        userData.personalInfo.phone && userData.personalInfo.location && 
        userData.personalInfo.aboutMe) {
        completion += 20;
    }
    
    // Education (20%)
    if (userData.education.length > 0) {
        completion += 20;
    }
    
    // Skills (20%)
    if (userData.skills.length >= 3) {
        completion += 20;
    } else if (userData.skills.length > 0) {
        completion += 10;
    }
    
    // Experience (20%)
    if (userData.experience.length > 0) {
        completion += 20;
    }
    
    // Avatar (20%)
    completion += 20; // Assuming avatar is set
    
    // Update UI
    userData.stats.profileCompletion = completion;
    document.querySelector('.completion-percentage').textContent = completion + '%';
    document.querySelector('.completion-fill').style.width = completion + '%';
    
    // Update stat number
    const profileStatNumber = document.querySelector('.stat-item:last-child .stat-number');
    profileStatNumber.textContent = completion + '%';
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#2ECC71' : type === 'error' ? '#E74C3C' : '#3498DB',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        fontSize: '0.9rem',
        fontWeight: '500'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add animations to elements
function addAnimations() {
    const profileCard = document.querySelector('.profile-card');
    const profileSections = document.querySelectorAll('.profile-section');
    
    // Animate profile card
    profileCard.classList.add('slide-in-left');
    
    // Animate profile sections with delay
    profileSections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('fade-in');
        }, 200 + index * 150);
    });
}

// Dropdown menu functionality
document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-profile')) {
        dropdownMenu.style.opacity = '0';
        dropdownMenu.style.visibility = 'hidden';
        dropdownMenu.style.transform = 'translateY(-10px)';
    }
});

// Handle dropdown item clicks
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const action = this.textContent.trim();
        
        switch(action) {
            case 'Edit Profile':
                showNotification('Anda sudah berada di halaman edit profile', 'info');
                break;
            case 'Lowongan Tersimpan':
                showNotification('Mengarahkan ke lowongan tersimpan...', 'info');
                break;
            case 'Riwayat Lamaran':
                showNotification('Mengarahkan ke riwayat lamaran...', 'info');
                break;
            case 'Keluar':
                if (confirm('Apakah Anda yakin ingin keluar?')) {
                    showNotification('Berhasil keluar. Sampai jumpa!', 'success');
                }
                break;
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 's':
                e.preventDefault();
                if (currentEditingSection) {
                    saveEdit(currentEditingSection);
                }
                break;
            case 'd':
                e.preventDefault();
                handleDownloadCV();
                break;
        }
    }
    
    // ESC to close modal or cancel edit
    if (e.key === 'Escape') {
        if (editModal.classList.contains('active')) {
            closeEditModal();
        } else if (currentEditingSection) {
            cancelEdit(currentEditingSection);
        }
    }
});

// Auto-save functionality (optional)
function enableAutoSave() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            if (!input.hasAttribute('readonly') && currentEditingSection === 'personal') {
                // Auto-save personal info
                userData.personalInfo.fullName = document.getElementById('fullName').value;
                userData.personalInfo.email = document.getElementById('email').value;
                userData.personalInfo.phone = document.getElementById('phone').value;
                userData.personalInfo.location = document.getElementById('location').value;
                userData.personalInfo.aboutMe = document.getElementById('aboutMe').value;
                
                console.log('Auto-saved personal info');
            }
        }, 1000));
    });
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize auto-save
// enableAutoSave();