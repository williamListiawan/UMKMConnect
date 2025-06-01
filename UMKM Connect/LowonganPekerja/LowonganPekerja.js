// DOM Elements
const userAvatar = document.getElementById('userAvatar');
const dropdownMenu = document.getElementById('dropdownMenu');
const searchForm = document.getElementById('searchForm');
const toggleFilters = document.getElementById('toggleFilters');
const filtersContent = document.getElementById('filtersContent');
const sortBy = document.getElementById('sortBy');
const jobsList = document.getElementById('jobsList');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
const applyBtns = document.querySelectorAll('.apply-btn');

// User data
const userData = {
    name: 'Chilly Willy',
    role: 'Pencari Kerja',
    avatar: '/placeholder.svg?height=40&width=40'
};

// Job data
let allJobs = [
    {
        id: 1,
        title: 'Warnetku',
        position: 'Admin',
        location: 'Jakarta',
        type: 'Part Time',
        education: 'SMA/Sederajat',
        salary: 'Rp700.000 - Rp1.200.000',
        salaryMin: 700000,
        salaryMax: 1200000,
        description: 'Kami mencari seorang admin yang handal untuk bergabung bersama Warnetku',
        featured: true,
        datePosted: new Date('2024-01-15'),
        company: 'Warnetku'
    },
    {
        id: 2,
        title: 'Nasi Cumi Hitam Pak Kris',
        position: 'Kasir',
        location: 'Jakarta',
        type: 'Full Time',
        education: 'SMA/Sederajat',
        salary: 'Rp1.750.000',
        salaryMin: 1750000,
        salaryMax: 1750000,
        description: 'Kami mencari seorang kasir yang handal untuk dapat bergabung dalam Nasi Cumi Hitam Pak Kris.',
        featured: false,
        datePosted: new Date('2024-01-14'),
        company: 'Nasi Cumi Hitam Pak Kris'
    },
    {
        id: 3,
        title: 'Bakso Tetelan Pak Djoe since 1890',
        position: 'Waiters',
        location: 'Yogyakarta',
        type: 'Part Time',
        education: 'SMA/Sederajat',
        salary: 'Rp400.000 - Rp1.000.000',
        salaryMin: 400000,
        salaryMax: 1000000,
        description: 'Kami mencari seorang waiters yang handal untuk dapat bergabung dalam Bakso Tetelan Pak Djoe since 1890.',
        featured: false,
        datePosted: new Date('2024-01-13'),
        company: 'Bakso Tetelan Pak Djoe since 1890'
    }
];

let currentJobs = [...allJobs];
let displayedJobs = 3;
let savedJobs = new Set();

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeUser();
    setupEventListeners();
    setupBookmarkButtons();
    setupApplyButtons();
    addAnimations();
    loadRecommendations();
});

// Initialize user data
function initializeUser() {
    const userName = document.querySelector('.user-name');
    if (userName) {
        userName.textContent = userData.name;
    }
    
    userAvatar.src = userData.avatar;
    userAvatar.alt = userData.name;
}

// Setup event listeners
function setupEventListeners() {
    // Search form
    searchForm.addEventListener('submit', handleSearch);
    
    // Advanced filters toggle
    toggleFilters.addEventListener('click', toggleAdvancedFilters);
    
    // Sort functionality
    sortBy.addEventListener('change', handleSort);
    
    // Load more button
    loadMoreBtn.addEventListener('click', loadMoreJobs);
    
    // Filter checkboxes
    const filterCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Recommendation clicks
    const recommendationItems = document.querySelectorAll('.recommendation-item');
    recommendationItems.forEach(item => {
        item.addEventListener('click', function() {
            const position = this.querySelector('.recommendation-title').textContent;
            searchForPosition(position);
        });
    });
}

// Handle search
function handleSearch(e) {
    e.preventDefault();
    
    const formData = new FormData(searchForm);
    const searchParams = {
        position: formData.get('position') || '',
        location: formData.get('location') || '',
        salary: formData.get('salary') || ''
    };
    
    showNotification('Mencari lowongan...', 'info');
    
    // Simulate search delay
    setTimeout(() => {
        performSearch(searchParams);
    }, 1000);
}

// Perform search
function performSearch(params) {
    let filteredJobs = [...allJobs];
    
    // Filter by position/keywords
    if (params.position) {
        filteredJobs = filteredJobs.filter(job => 
            job.position.toLowerCase().includes(params.position.toLowerCase()) ||
            job.title.toLowerCase().includes(params.position.toLowerCase())
        );
    }
    
    // Filter by location
    if (params.location) {
        filteredJobs = filteredJobs.filter(job => 
            job.location.toLowerCase().includes(params.location.toLowerCase())
        );
    }
    
    // Filter by salary
    if (params.salary) {
        const [minSalary, maxSalary] = params.salary.split('-').map(s => parseInt(s));
        filteredJobs = filteredJobs.filter(job => {
            if (maxSalary) {
                return job.salaryMin >= minSalary && job.salaryMax <= maxSalary;
            } else {
                return job.salaryMin >= minSalary;
            }
        });
    }
    
    currentJobs = filteredJobs;
    displayedJobs = Math.min(3, currentJobs.length);
    
    renderJobs();
    
    if (filteredJobs.length === 0) {
        showNoResults();
    } else {
        showNotification(`Ditemukan ${filteredJobs.length} lowongan`, 'success');
    }
}

// Toggle advanced filters
function toggleAdvancedFilters() {
    filtersContent.classList.toggle('active');
    
    const isActive = filtersContent.classList.contains('active');
    toggleFilters.textContent = isActive ? 'Sembunyikan Filter' : 'Filter Lanjutan';
}

// Apply filters
function applyFilters() {
    const jobTypeFilters = Array.from(document.querySelectorAll('input[name="jobType"]:checked'))
        .map(cb => cb.value);
    const educationFilters = Array.from(document.querySelectorAll('input[name="education"]:checked'))
        .map(cb => cb.value);
    
    let filteredJobs = [...allJobs];
    
    // Apply job type filters
    if (jobTypeFilters.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
            jobTypeFilters.some(filter => 
                job.type.toLowerCase().includes(filter.replace('-', ' '))
            )
        );
    }
    
    // Apply education filters
    if (educationFilters.length > 0) {
        filteredJobs = filteredJobs.filter(job => 
            educationFilters.some(filter => 
                job.education.toLowerCase().includes(filter)
            )
        );
    }
    
    currentJobs = filteredJobs;
    displayedJobs = Math.min(3, currentJobs.length);
    renderJobs();
    
    showNotification(`Filter diterapkan: ${filteredJobs.length} lowongan ditemukan`, 'info');
}

// Handle sorting
function handleSort() {
    const sortValue = sortBy.value;
    
    switch(sortValue) {
        case 'newest':
            currentJobs.sort((a, b) => b.datePosted - a.datePosted);
            break;
        case 'salary-high':
            currentJobs.sort((a, b) => b.salaryMax - a.salaryMax);
            break;
        case 'salary-low':
            currentJobs.sort((a, b) => a.salaryMin - b.salaryMin);
            break;
        case 'relevance':
            // Keep original order for relevance
            currentJobs = [...allJobs];
            break;
    }
    
    renderJobs();
    showNotification('Hasil pencarian diurutkan', 'info');
}

// Render jobs
function renderJobs() {
    const jobsToShow = currentJobs.slice(0, displayedJobs);
    
    jobsList.innerHTML = '';
    
    jobsToShow.forEach(job => {
        const jobCard = createJobCard(job);
        jobsList.appendChild(jobCard);
    });
    
    // Update load more button
    if (displayedJobs >= currentJobs.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
        loadMoreBtn.textContent = `Muat ${Math.min(3, currentJobs.length - displayedJobs)} Lowongan Lagi`;
    }
    
    // Re-setup event listeners for new cards
    setupBookmarkButtons();
    setupApplyButtons();
}

// Create job card element
function createJobCard(job) {
    const jobCard = document.createElement('div');
    jobCard.className = `job-card ${job.featured ? 'featured' : ''}`;
    jobCard.dataset.jobId = job.id;
    
    const isSaved = savedJobs.has(job.id);
    
    jobCard.innerHTML = `
        <div class="job-header">
            <div class="job-badge">${job.position}</div>
            <button class="bookmark-btn" data-saved="${isSaved}" title="Simpan lowongan">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
        <h3 class="job-title">${job.title}</h3>
        <div class="job-details">
            <div class="job-detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${job.location}</span>
            </div>
            <div class="job-detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${job.type}</span>
            </div>
            <div class="job-detail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 10V6C22 5.46957 21.7893 4.96086 21.4142 4.58579C21.0391 4.21071 20.5304 4 20 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V10M22 10L18 14L16 12L12 16L8 12L6 14L2 10M22 10V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H4C3.46957 20 2.96086 19.7893 2.58579 19.4142C2.21071 19.0391 2 18.5304 2 18V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>${job.education}</span>
            </div>
        </div>
        <div class="job-salary">${job.salary}</div>
        <p class="job-description">${job.description}</p>
        <button class="apply-btn" data-job-id="${job.id}">Lamar</button>
    `;
    
    // Add animation
    jobCard.classList.add('fade-in');
    
    return jobCard;
}

// Load more jobs
function loadMoreJobs() {
    const remainingJobs = currentJobs.length - displayedJobs;
    const jobsToLoad = Math.min(3, remainingJobs);
    
    displayedJobs += jobsToLoad;
    
    // Show loading state
    loadMoreBtn.textContent = 'Memuat...';
    loadMoreBtn.disabled = true;
    
    setTimeout(() => {
        renderJobs();
        loadMoreBtn.disabled = false;
        showNotification(`${jobsToLoad} lowongan baru dimuat`, 'success');
    }, 1000);
}

// Setup bookmark buttons
function setupBookmarkButtons() {
    const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
    bookmarkBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBookmark(this);
        });
    });
}

// Toggle bookmark
function toggleBookmark(btn) {
    const jobCard = btn.closest('.job-card');
    const jobId = parseInt(jobCard.dataset.jobId);
    const isSaved = btn.dataset.saved === 'true';
    
    if (isSaved) {
        savedJobs.delete(jobId);
        btn.dataset.saved = 'false';
        showNotification('Lowongan dihapus dari tersimpan', 'info');
    } else {
        savedJobs.add(jobId);
        btn.dataset.saved = 'true';
        showNotification('Lowongan disimpan', 'success');
    }
    
    // Add animation
    btn.style.transform = 'scale(0.8)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 150);
}

// Setup apply buttons
function setupApplyButtons() {
    const applyBtns = document.querySelectorAll('.apply-btn');
    applyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            applyToJob(this);
        });
    });
}

// Apply to job
function applyToJob(btn) {
    const jobCard = btn.closest('.job-card');
    const jobTitle = jobCard.querySelector('.job-title').textContent;
    const jobId = btn.dataset.jobId;
    
    // Disable button temporarily
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Melamar...';
    
    // Simulate API call
    setTimeout(() => {
        btn.textContent = 'Lamaran Terkirim';
        btn.style.background = '#2ECC71';
        btn.style.borderColor = '#2ECC71';
        
        showNotification(`Lamaran untuk ${jobTitle} berhasil dikirim!`, 'success');
        
        // Add to applied jobs (in real app, this would be stored)
        console.log(`Applied to job ${jobId}: ${jobTitle}`);
        
    }, 1500);
}

// Search for specific position
function searchForPosition(position) {
    const positionInput = document.getElementById('position');
    positionInput.value = position;
    
    // Trigger search
    const searchEvent = new Event('submit');
    searchForm.dispatchEvent(searchEvent);
    
    // Scroll to results
    document.querySelector('.jobs-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Show no results
function showNoResults() {
    jobsList.innerHTML = `
        <div class="no-results">
            <h3>Tidak ada lowongan ditemukan</h3>
            <p>Coba ubah kata kunci pencarian atau filter Anda</p>
            <div class="search-suggestions">
                <h4>Saran pencarian:</h4>
                <ul>
                    <li onclick="searchForPosition('kasir')">Kasir</li>
                    <li onclick="searchForPosition('waiters')">Waiters</li>
                    <li onclick="searchForPosition('admin')">Admin</li>
                    <li onclick="searchForPosition('koki')">Koki</li>
                    <li onclick="searchForPosition('sales')">Sales</li>
                </ul>
            </div>
        </div>
    `;
    
    loadMoreBtn.style.display = 'none';
}

// Load recommendations
function loadRecommendations() {
    // In real app, this would be based on user profile and preferences
    const recommendations = [
        { position: 'Kasir', company: 'Nasi Cumi Hitam Pak Kris', avatar: 'K' },
        { position: 'Waiters', company: 'Bakso Tetelan Pak Djoe since 1890', avatar: 'W' },
        { position: 'Waiters', company: 'Warteg Buhari', avatar: 'W' }
    ];
    
    // Recommendations are already in HTML, but we could dynamically load them here
    console.log('Recommendations loaded:', recommendations);
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
    const searchSection = document.querySelector('.search-section');
    const jobCards = document.querySelectorAll('.job-card');
    const sidebarSections = document.querySelectorAll('.sidebar > *');
    
    // Animate search section
    searchSection.classList.add('fade-in');
    
    // Animate job cards
    jobCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('slide-in-left');
        }, index * 150);
    });
    
    // Animate sidebar sections
    sidebarSections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('slide-in-right');
        }, 300 + index * 200);
    });
}


// Show saved jobs
function showSavedJobs() {
    if (savedJobs.size === 0) {
        showNotification('Belum ada lowongan yang disimpan', 'info');
        return;
    }
    
    const savedJobsList = Array.from(savedJobs).map(id => 
        allJobs.find(job => job.id === id)
    ).filter(Boolean);
    
    currentJobs = savedJobsList;
    displayedJobs = savedJobsList.length;
    renderJobs();
    
    showNotification(`Menampilkan ${savedJobsList.length} lowongan tersimpan`, 'success');
    
    // Update section title
    document.querySelector('.section-title').textContent = 'Lowongan Tersimpan';
    
    // Add back button
    const sectionHeader = document.querySelector('.section-header');
    if (!sectionHeader.querySelector('.back-btn')) {
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.innerHTML = '← Kembali ke Semua Lowongan';
        backBtn.style.cssText = `
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            color: #666;
            transition: all 0.3s ease;
        `;
        
        backBtn.addEventListener('click', function() {
            currentJobs = [...allJobs];
            displayedJobs = 3;
            renderJobs();
            document.querySelector('.section-title').textContent = 'Lowongan Aktif';
            this.remove();
        });
        
        backBtn.addEventListener('mouseenter', function() {
            this.style.background = '#4ECDC4';
            this.style.color = 'white';
            this.style.borderColor = '#4ECDC4';
        });
        
        backBtn.addEventListener('mouseleave', function() {
            this.style.background = '#f8f9fa';
            this.style.color = '#666';
            this.style.borderColor = '#e9ecef';
        });
        
        sectionHeader.appendChild(backBtn);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'f':
                e.preventDefault();
                document.getElementById('position').focus();
                break;
            case 's':
                e.preventDefault();
                showSavedJobs();
                break;
        }
    }
    
    // ESC to close filters
    if (e.key === 'Escape' && filtersContent.classList.contains('active')) {
        toggleAdvancedFilters();
    }
});

// Auto-complete for search
const positionInput = document.getElementById('position');
const locationInput = document.getElementById('location');

const jobPositions = ['Kasir', 'Waiters', 'Admin', 'Koki', 'Sales', 'Customer Service', 'Barista', 'Security'];
const locations = ['Jakarta', 'Yogyakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang', 'Malang'];

function setupAutoComplete(input, suggestions) {
    input.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        if (value.length < 2) return;
        
        const matches = suggestions.filter(item => 
            item.toLowerCase().includes(value)
        );
        
        // In a real app, you would show these as dropdown suggestions
        console.log('Suggestions:', matches);
    });
}

setupAutoComplete(positionInput, jobPositions);
setupAutoComplete(locationInput, locations);

// Initialize with default view
renderJobs();