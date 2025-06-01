// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('UMKMConnect Dashboard loaded successfully!');
    
    // Handle service tag removal
    const removeTags = document.querySelectorAll('.remove-tag');
    removeTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const serviceTag = this.parentElement;
            serviceTag.style.opacity = '0.5';
            serviceTag.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                serviceTag.remove();
                showNotification('Layanan berhasil dihapus');
            }, 200);
        });
    });

    // Handle form submission
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = getFormData();
            
            // Validate form
            if (validateForm(formData)) {
                // Simulate saving
                this.innerHTML = '<span>⏳</span> Menyimpan...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = '<span>💾</span> Simpan Perubahan';
                    this.disabled = false;
                    showNotification('Perubahan berhasil disimpan!', 'success');
                }, 1500);
            } else {
                showNotification('Mohon lengkapi semua field yang wajib diisi', 'error');
            }
        });
    }

    // Handle manage jobs button
    const manageBtn = document.querySelector('.manage-btn');
    if (manageBtn) {
        manageBtn.addEventListener('click', function() {
            showNotification('Mengarahkan ke halaman kelola lowongan...');
            // Simulate navigation
            setTimeout(() => {
                console.log('Navigating to job management page...');
            }, 1000);
        });
    }

    // Handle edit buttons
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.content-card, .services-card');
            toggleEditMode(section);
        });
    });

    // Add form validation
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        // Real-time validation on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });

        // Clear validation on focus
        input.addEventListener('focus', function() {
            this.style.borderColor = '#5a9b8e';
            clearFieldError(this);
        });

        // Auto-save on input (debounced)
        input.addEventListener('input', debounce(function() {
            autoSave();
        }, 2000));
    });
   
    // Initialize tooltips
    initializeTooltips();
    
    // Load saved data
    loadSavedData();
});

// Utility Functions
function getFormData() {
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    const data = {};
    
    inputs.forEach(input => {
        const label = input.previousElementSibling ? input.previousElementSibling.textContent : 'unknown';
        data[label] = input.value.trim();
    });
    
    return data;
}

function validateForm(data) {
    const requiredFields = ['Nama Perusahaan', 'Email Perusahaan', 'Nomor Telepon'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field] === '') {
            return false;
        }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data['Email Perusahaan'] && !emailRegex.test(data['Email Perusahaan'])) {
        return false;
    }
    
    return true;
}

function validateField(field) {
    const value = field.value.trim();
    const label = field.previousElementSibling ? field.previousElementSibling.textContent : '';
    
    // Required field validation
    const requiredFields = ['Nama Perusahaan', 'Email Perusahaan', 'Nomor Telepon'];
    
    if (requiredFields.includes(label) && value === '') {
        showFieldError(field, 'Field ini wajib diisi');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Format email tidak valid');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value !== '') {
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Format nomor telepon tidak valid');
            return false;
        }
    }
    
    // Success state
    field.style.borderColor = '#5a9b8e';
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    field.style.borderColor = '#ff6b35';
    
    // Remove existing error message
    clearFieldError(field);
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ff6b35';
    errorDiv.style.fontSize = '0.75rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#5a9b8e';
            break;
        case 'error':
            notification.style.background = '#ff6b35';
            break;
        default:
            notification.style.background = '#333';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function toggleEditMode(section) {
    if (!section) return;
    
    const isEditing = section.classList.contains('editing');
    
    if (isEditing) {
        section.classList.remove('editing');
        showNotification('Mode edit dinonaktifkan');
    } else {
        section.classList.add('editing');
        showNotification('Mode edit diaktifkan');
    }
}

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

function autoSave() {
    const formData = getFormData();
    
    // Save to localStorage
    try {
        localStorage.setItem('umkmconnect_form_data', JSON.stringify(formData));
        
        // Show subtle indication
        const saveBtn = document.querySelector('.save-btn');
        if (saveBtn) {
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<span>💾</span> Tersimpan otomatis';
            saveBtn.style.opacity = '0.7';
            
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.style.opacity = '1';
            }, 1500);
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
}



function initializeTooltips() {
    // Add tooltips to buttons and interactive elements
    const elementsWithTooltips = [
        { selector: '.manage-btn', text: 'Kelola semua lowongan kerja Anda' },
        { selector: '.save-btn', text: 'Simpan perubahan informasi perusahaan' },
        { selector: '.user-avatar', text: 'Profil pengguna' }
    ];
    
    elementsWithTooltips.forEach(({ selector, text }) => {
        const element = document.querySelector(selector);
        if (element) {
            element.title = text;
        }
    });
}

// Add CSS for editing mode dynamically
const editingStyles = `
    .editing {
        border: 2px dashed #5a9b8e !important;
        background: #f8fffe !important;
    }
    
    .editing .form-input,
    .editing .form-textarea {
        background: #fff !important;
        border-color: #5a9b8e !important;
    }
`;

// Inject editing styles
const styleSheet = document.createElement('style');
styleSheet.textContent = editingStyles;
document.head.appendChild(styleSheet);