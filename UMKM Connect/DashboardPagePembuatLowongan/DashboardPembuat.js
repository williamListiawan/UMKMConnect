// DOM Elements
const userAvatar = document.getElementById('userAvatar');
const dropdownMenu = document.getElementById('dropdownMenu');
const createJobBtn = document.getElementById('createJobBtn');
const createJobModal = document.getElementById('createJobModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const jobForm = document.getElementById('jobForm');
const filterStatus = document.getElementById('filterStatus');
const refreshBtn = document.getElementById('refreshBtn');
const jobsList = document.getElementById('jobsList');
const activityList = document.getElementById('activityList');
const statNumbers = document.querySelectorAll('.stat-number');

// Company data
const companyData = {
    name: 'Nasi Hitam',
    role: 'Pembuat Lowongan',
    avatar: '/placeholder.svg?height=40&width=40'
};

// Jobs data
let jobsData = [
    {
        id: 1,
        title: 'Cleaning Service',
        status: 'inactive',
        createdDate: null,
        endDate: null,
        salary: 'Rp2.750.000',
        location: 'Jakarta',
        description: 'Mencari cleaning service yang berpengalaman untuk menjaga kebersihan area restoran.',
        type: 'part-time',
        applications: 15
    },
    {
        id: 2,
        title: 'Waiters',
        status: 'active',
        createdDate: '12 hari yang lalu',
        endDate: '30 hari lagi',
        salary: 'Rp2.750.000',
        location: 'Jakarta',
        description: 'Mencari waiters yang ramah dan berpengalaman untuk melayani pelanggan.',
        type: 'full-time',
        applications: 23
    }
];

// Activities data
let activitiesData = [
    {
        id: 1,
        type: 'new-application',
        title: 'Lamaran Baru',
        description: 'Chilly Willy, melamar Kasir',
        time: '2 menit yang lalu'
    },
    {
        id: 2,
        type: 'job-published',
        title: 'Lowongan Dipublikasi',
        description: 'Waiters telah aktif',
        time: '1 jam yang lalu'
    },
    {
        id: 3,
        type: 'candidate-invited',
        title: 'Kandidat Diundang',
        description: '3 kandidat diundang untuk interview',
        time: '3 jam yang lalu'
    }
];

// Statistics data
let statsData = {
    totalJobs: 12,
    activeJobs: 8,
    totalApplications: 247,
    newApplications: 89
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeCompany();
    animateStatNumbers();
    setupEventListeners();
    renderJobs();
    renderActivities();
    addAnimations();
});

// Initialize company data
function initializeCompany() {
    userAvatar.src = companyData.avatar;
    userAvatar.alt = companyData.name;
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
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Setup event listeners
function setupEventListeners() {
    // Create job button
    createJobBtn.addEventListener('click', openCreateJobModal);
    
    // Modal close buttons
    closeModal.addEventListener('click', closeCreateJobModal);
    cancelBtn.addEventListener('click', closeCreateJobModal);
    
    // Modal overlay click
    createJobModal.addEventListener('click', function(e) {
        if (e.target === createJobModal) {
            closeCreateJobModal();
        }
    });
    
    // Job form submission
    jobForm.addEventListener('submit', handleJobFormSubmit);
    
    // Filter change
    filterStatus.addEventListener('change', handleFilterChange);
    
    // Refresh button
    refreshBtn.addEventListener('click', handleRefresh);
    
    // Job action buttons
    setupJobActionButtons();
}

// Open create job modal
function openCreateJobModal() {
    createJobModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('jobTitle').focus();
    }, 300);
}

// Close create job modal
function closeCreateJobModal() {
    createJobModal.classList.remove('active');
    document.body.style.overflow = '';
    jobForm.reset();
}

// Handle job form submission
function handleJobFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(jobForm);
    const newJob = {
        id: Date.now(),
        title: formData.get('jobTitle'),
        status: 'inactive',
        createdDate: 'Baru dibuat',
        endDate: null,
        salary: formData.get('jobSalary'),
        location: formData.get('jobLocation'),
        description: formData.get('jobDescription'),
        type: formData.get('jobType'),
        applications: 0
    };
    
    // Add to jobs data
    jobsData.unshift(newJob);
    
    // Update statistics
    statsData.totalJobs++;
    updateStatNumber(document.querySelector('.stat-card:first-child .stat-number'), statsData.totalJobs);
    
    // Add activity
    addActivity({
        type: 'job-created',
        title: 'Lowongan Dibuat',
        description: `${newJob.title} berhasil dibuat`,
        time: 'Baru saja'
    });
    
    // Re-render jobs
    renderJobs();
    
    // Close modal
    closeCreateJobModal();
    
    // Show notification
    showNotification(`Lowongan "${newJob.title}" berhasil dibuat!`, 'success');
}

// Handle filter change
function handleFilterChange() {
    const filterValue = filterStatus.value;
    renderJobs(filterValue);
}

// Handle refresh
function handleRefresh() {
    refreshBtn.style.transform = 'rotate(360deg)';
    
    setTimeout(() => {
        refreshBtn.style.transform = 'rotate(0deg)';
        renderJobs();
        renderActivities();
        showNotification('Data berhasil diperbarui', 'success');
    }, 500);
}

// Setup job action buttons
function setupJobActionButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.action-btn')) {
            const btn = e.target.closest('.action-btn');
            const action = btn.dataset.action;
            const jobCard = btn.closest('.job-management-card');
            const jobId = parseInt(jobCard.dataset.jobId);
            const job = jobsData.find(j => j.id === jobId);
            
            handleJobAction(action, job, jobCard);
        }
    });
}

// Handle job actions
function handleJobAction(action, job, jobCard) {
    switch(action) {
        case 'edit':
            editJob(job);
            break;
        case 'publish':
            publishJob(job, jobCard);
            break;
        case 'applications':
            viewApplications(job);
            break;
        case 'delete':
            deleteJob(job, jobCard);
            break;
    }
}

// Edit job
function editJob(job) {
    // Pre-fill form with job data
    document.getElementById('jobTitle').value = job.title;
    document.getElementById('jobLocation').value = job.location;
    document.getElementById('jobSalary').value = job.salary;
    document.getElementById('jobType').value = job.type;
    document.getElementById('jobDescription').value = job.description;
    
    // Open modal
    openCreateJobModal();
    
    // Change form submission to update
    jobForm.onsubmit = function(e) {
        e.preventDefault();
        
        const formData = new FormData(jobForm);
        
        // Update job data
        job.title = formData.get('jobTitle');
        job.location = formData.get('jobLocation');
        job.salary = formData.get('jobSalary');
        job.type = formData.get('jobType');
        job.description = formData.get('jobDescription');
        
        // Add activity
        addActivity({
            type: 'job-updated',
            title: 'Lowongan Diperbarui',
            description: `${job.title} telah diperbarui`,
            time: 'Baru saja'
        });
        
        // Re-render jobs
        renderJobs();
        
        // Close modal
        closeCreateJobModal();
        
        // Reset form handler
        jobForm.onsubmit = handleJobFormSubmit;
        
        showNotification(`Lowongan "${job.title}" berhasil diperbarui!`, 'success');
    };
}

// Publish job
function publishJob(job, jobCard) {
    if (job.status === 'active') {
        showNotification('Lowongan sudah aktif', 'info');
        return;
    }
    
    // Add loading state
    jobCard.classList.add('loading');
    
    setTimeout(() => {
        // Update job status
        job.status = 'active';
        job.createdDate = 'Baru saja';
        job.endDate = '30 hari lagi';
        
        // Update statistics
        statsData.activeJobs++;
        updateStatNumber(document.querySelector('.stat-card:nth-child(2) .stat-number'), statsData.activeJobs);
        
        // Add activity
        addActivity({
            type: 'job-published',
            title: 'Lowongan Dipublikasi',
            description: `${job.title} telah aktif`,
            time: 'Baru saja'
        });
        
        // Remove loading and re-render
        jobCard.classList.remove('loading');
        renderJobs();
        
        showNotification(`Lowongan "${job.title}" berhasil dipublikasi!`, 'success');
    }, 1000);
}

// View applications
function viewApplications(job) {
    showNotification(`Membuka ${job.applications} lamaran untuk ${job.title}`, 'info');
    
    // In real app, this would open applications page
    setTimeout(() => {
        showNotification('Halaman lamaran berhasil dimuat', 'success');
    }, 1000);
}

// Delete job
function deleteJob(job, jobCard) {
    if (confirm(`Apakah Anda yakin ingin menghapus lowongan "${job.title}"?`)) {
        // Add loading state
        jobCard.classList.add('loading');
        
        setTimeout(() => {
            // Remove from data
            const index = jobsData.findIndex(j => j.id === job.id);
            if (index > -1) {
                jobsData.splice(index, 1);
            }
            
            // Update statistics
            statsData.totalJobs--;
            if (job.status === 'active') {
                statsData.activeJobs--;
                updateStatNumber(document.querySelector('.stat-card:nth-child(2) .stat-number'), statsData.activeJobs);
            }
            updateStatNumber(document.querySelector('.stat-card:first-child .stat-number'), statsData.totalJobs);
            
            // Add activity
            addActivity({
                type: 'job-deleted',
                title: 'Lowongan Dihapus',
                description: `${job.title} telah dihapus`,
                time: 'Baru saja'
            });
            
            // Remove card with animation
            jobCard.style.transform = 'translateX(-100%)';
            jobCard.style.opacity = '0';
            
            setTimeout(() => {
                renderJobs();
                showNotification(`Lowongan "${job.title}" berhasil dihapus`, 'success');
            }, 300);
        }, 1000);
    }
}

// Render jobs
function renderJobs(filter = 'all') {
    let filteredJobs = jobsData;
    
    if (filter !== 'all') {
        filteredJobs = jobsData.filter(job => job.status === filter);
    }
    
    jobsList.innerHTML = '';
    
    filteredJobs.forEach(job => {
        const jobCard = createJobCard(job);
        jobsList.appendChild(jobCard);
    });
    
    if (filteredJobs.length === 0) {
        jobsList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <h3>Tidak ada lowongan ditemukan</h3>
                <p>Coba ubah filter atau buat lowongan baru</p>
            </div>
        `;
    }
}

// Create job card element
function createJobCard(job) {
    const jobCard = document.createElement('div');
    jobCard.className = `job-management-card ${job.status}`;
    jobCard.dataset.jobId = job.id;
    
    const statusText = job.status === 'active' ? 'Aktif' : 'Nonaktif';
    const statusClass = job.status;
    
    jobCard.innerHTML = `
        <div class="job-header">
            <h3 class="job-title">${job.title}</h3>
            <div class="job-status ${statusClass}">${statusText}</div>
        </div>
        
        <div class="job-details-grid">
            <div class="job-detail">
                <span class="detail-label">Dibuat:</span>
                <span class="detail-value">${job.createdDate || '-'}</span>
            </div>
            <div class="job-detail">
                <span class="detail-label">Berakhir:</span>
                <span class="detail-value">${job.endDate || '-'}</span>
            </div>
            <div class="job-detail">
                <span class="detail-label">Gaji:</span>
                <span class="detail-value">${job.salary}</span>
            </div>
            <div class="job-detail">
                <span class="detail-label">Lokasi:</span>
                <span class="detail-value">${job.location}</span>
            </div>
        </div>
        
        <div class="job-actions">
            <button class="action-btn edit" data-action="edit" title="Edit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Edit
            </button>
            ${job.status === 'active' ? `
                <button class="action-btn applications" data-action="applications" title="Lihat Lamaran">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Lihat Lamaran
                </button>
            ` : `
                <button class="action-btn publish" data-action="publish" title="Publikasi">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Publikasi
                </button>
            `}
            <button class="action-btn delete" data-action="delete" title="Hapus">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Hapus
            </button>
        </div>
    `;
    
    // Add animation
    jobCard.classList.add('fade-in');
    
    return jobCard;
}

// Render activities
function renderActivities() {
    activityList.innerHTML = '';
    
    activitiesData.slice(0, 5).forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityList.appendChild(activityItem);
    });
}

// Create activity item element
function createActivityItem(activity) {
    const activityItem = document.createElement('div');
    activityItem.className = `activity-item ${activity.type}`;
    
    let iconSvg = '';
    switch(activity.type) {
        case 'new-application':
            iconSvg = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="8.5" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20 8V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 11H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            break;
        case 'job-published':
        case 'job-created':
            iconSvg = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            break;
        case 'candidate-invited':
            iconSvg = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            break;
        default:
            iconSvg = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
    }
    
    activityItem.innerHTML = `
        <div class="activity-icon">
            ${iconSvg}
        </div>
        <div class="activity-info">
            <div class="activity-title">${activity.title}</div>
            <div class="activity-description">${activity.description}</div>
            <div class="activity-time">${activity.time}</div>
        </div>
    `;
    
    return activityItem;
}

// Add new activity
function addActivity(activity) {
    activity.id = Date.now();
    activitiesData.unshift(activity);
    
    // Keep only last 10 activities
    if (activitiesData.length > 10) {
        activitiesData = activitiesData.slice(0, 10);
    }
    
    renderActivities();
}

// Update stat number
function updateStatNumber(element, newValue) {
    const currentValue = parseInt(element.textContent);
    const difference = newValue - currentValue;
    const duration = 1000;
    const step = difference / (duration / 16);
    let current = currentValue;
    
    const timer = setInterval(() => {
        current += step;
        if ((step > 0 && current >= newValue) || (step < 0 && current <= newValue)) {
            current = newValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
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
    const managementBanner = document.querySelector('.management-banner');
    const statCards = document.querySelectorAll('.stat-card');
    const jobCards = document.querySelectorAll('.job-management-card');
    const activityItems = document.querySelectorAll('.activity-item');
    
    // Animate banner
    managementBanner.classList.add('fade-in');
    
    // Animate stat cards with delay
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('slide-in-left');
        }, index * 100);
    });
    
    // Animate job cards
    jobCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, 300 + index * 150);
    });
    
    // Animate activity items
    activityItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('slide-in-right');
        }, 500 + index * 100);
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
            case 'Profile Perusahaan':
                showNotification('Mengarahkan ke halaman profile perusahaan...', 'info');
                break;
            case 'Kelola Lowongan':
                showNotification('Anda sudah berada di halaman kelola lowongan', 'info');
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
            case 'n':
                e.preventDefault();
                openCreateJobModal();
                break;
            case 'r':
                e.preventDefault();
                handleRefresh();
                break;
        }
    }
    
    // ESC to close modal
    if (e.key === 'Escape' && createJobModal.classList.contains('active')) {
        closeCreateJobModal();
    }
});

// Simulate real-time updates
function simulateRealTimeUpdates() {
    setInterval(() => {
        if (Math.random() > 0.8) { // 20% chance
            const newApplications = Math.floor(Math.random() * 3) + 1;
            statsData.newApplications += newApplications;
            statsData.totalApplications += newApplications;
            
            updateStatNumber(document.querySelector('.stat-card:nth-child(4) .stat-number'), statsData.newApplications);
            updateStatNumber(document.querySelector('.stat-card:nth-child(3) .stat-number'), statsData.totalApplications);
            
            // Add activity
            const candidates = ['Ahmad Rizki', 'Sari Dewi', 'Budi Santoso', 'Maya Putri'];
            const positions = ['Kasir', 'Waiters', 'Cleaning Service'];
            const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
            const randomPosition = positions[Math.floor(Math.random() * positions.length)];
            
            addActivity({
                type: 'new-application',
                title: 'Lamaran Baru',
                description: `${randomCandidate}, melamar ${randomPosition}`,
                time: 'Baru saja'
            });
        }
    }, 30000); // Check every 30 seconds
}

// Start real-time updates
setTimeout(() => {
    simulateRealTimeUpdates();
}, 5000);