const userAvatar = document.getElementById('userAvatar');
const dropdownMenu = document.getElementById('dropdownMenu');
const statNumbers = document.querySelectorAll('.stat-number');
const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
const applyBtns = document.querySelectorAll('.apply-btn');

const userData = {
    name: 'Chilly Willy',
    role: 'Pencari Kerja',
    avatar: '/placeholder.svg?height=40&width=40'
};

document.addEventListener('DOMContentLoaded', function() {
    initializeUser();
    animateStatNumbers();
    setupBookmarkButtons();
    setupApplyButtons();
    addAnimations();
});

function initializeUser() {
    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = userData.name;
    }
    
    userAvatar.src = userData.avatar;
    userAvatar.alt = userData.name;
}

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

function setupBookmarkButtons() {
    bookmarkBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBookmark(this);
        });
    });
}

function toggleBookmark(btn) {
    const isSaved = btn.dataset.saved === 'true';
    btn.dataset.saved = !isSaved;
    
    btn.style.transform = 'scale(0.8)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 150);
    
    showNotification(
        isSaved ? 'Lowongan dihapus dari tersimpan' : 'Lowongan disimpan',
        isSaved ? 'info' : 'success'
    );
    
    updateSavedJobsCount(!isSaved);
}

function setupApplyButtons() {
    applyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            applyToJob(this);
        });
    });
}

function applyToJob(btn) {
    const jobCard = btn.closest('.job-card');
    const jobTitle = jobCard.querySelector('.job-title').textContent;
    
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Melamar...';
    
    setTimeout(() => {
        btn.textContent = 'Lamaran Terkirim';
        btn.style.background = '#2ECC71';
        btn.style.borderColor = '#2ECC71';
        
        showNotification(`Lamaran untuk ${jobTitle} berhasil dikirim!`, 'success');
        
        updateApplicationsCount();
        
        addRecentActivity('send', 'Lamaran terkirim', `Kasir di ${jobTitle}`);
        
    }, 1500);
}

function updateSavedJobsCount(increment) {
    const savedJobsElement = document.querySelector('.stat-card:last-child .stat-number');
    const currentCount = parseInt(savedJobsElement.textContent);
    const newCount = increment ? currentCount + 1 : currentCount - 1;
    savedJobsElement.textContent = Math.max(0, newCount);
}

function updateApplicationsCount() {
    const applicationsElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
    const currentCount = parseInt(applicationsElement.textContent);
    applicationsElement.textContent = currentCount + 1;
}

function addRecentActivity(iconType, title, description) {
    const activitiesList = document.querySelector('.activities-list');
    const newActivity = createActivityElement(iconType, title, description);
    
    activitiesList.insertBefore(newActivity, activitiesList.firstChild);

    if (activitiesList.children.length > 4) {
        activitiesList.removeChild(activitiesList.lastChild);
    }
    
    newActivity.style.opacity = '0';
    newActivity.style.transform = 'translateX(-20px)';
    setTimeout(() => {
        newActivity.style.transition = 'all 0.3s ease';
        newActivity.style.opacity = '1';
        newActivity.style.transform = 'translateX(0)';
    }, 100);
}

function createActivityElement(iconType, title, description) {
    const activity = document.createElement('div');
    activity.className = 'activity-item';
    
    const iconMap = {
        send: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>`,
        bookmark: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                   </svg>`
    };
    
    activity.innerHTML = `
        <div class="activity-icon ${iconType}">
            ${iconMap[iconType]}
        </div>
        <div class="activity-content">
            <div class="activity-title">${title}</div>
            <div class="activity-desc">${description}</div>
        </div>
    `;
    
    return activity;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
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
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function addAnimations() {
    const welcomeBanner = document.querySelector('.welcome-banner');
    const statCards = document.querySelectorAll('.stat-card');
    const jobCards = document.querySelectorAll('.job-card');
    const activityItems = document.querySelectorAll('.activity-item');
    
    welcomeBanner.classList.add('fade-in');
    
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('slide-in-left');
        }, index * 100);
    });
    
    jobCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, 300 + index * 150);
    });
    
    activityItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('slide-in-right');
        }, 500 + index * 100);
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            filterJobs(query);
        });
    }
}

function filterJobs(query) {
    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach(card => {
        const title = card.querySelector('.job-title').textContent.toLowerCase();
        const badge = card.querySelector('.job-badge').textContent.toLowerCase();
        
        if (title.includes(query) || badge.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.user-profile')) {
        dropdownMenu.style.opacity = '0';
        dropdownMenu.style.visibility = 'hidden';
        dropdownMenu.style.transform = 'translateY(-10px)';
    }
});

document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const action = this.textContent.trim();
        
        switch(action) {
            case 'Profile Saya':
                showNotification('Mengarahkan ke halaman profile...', 'info');
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

function refreshDashboard() {
    showNotification('Memperbarui data dashboard...', 'info');
    setTimeout(() => {
        showNotification('Dashboard berhasil diperbarui!', 'success');
    }, 1500);
}

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'r':
                e.preventDefault();
                refreshDashboard();
                break;
            case 'f':
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
                break;
        }
    }
});

setInterval(() => {
    console.log('Auto-refreshing dashboard data...');
}, 5 * 60 * 1000);