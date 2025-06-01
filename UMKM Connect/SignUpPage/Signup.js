document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const signupBtn = document.querySelector('.signup-btn');
    
    // Form inputs
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const cityInput = document.getElementById('city');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    let selectedUserType = 'job-seeker';

    // User type toggle functionality
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedUserType = this.dataset.type;
            
            // Update form placeholders based on user type
            updateFormPlaceholders();
        });
    });

    function updateFormPlaceholders() {
        if (selectedUserType === 'company') {
            firstNameInput.placeholder = 'Nama perusahaan';
            lastNameInput.placeholder = 'Nama perwakilan';
            cityInput.placeholder = 'Lokasi perusahaan';
        } else {
            firstNameInput.placeholder = 'Masukkan nama depan anda';
            lastNameInput.placeholder = 'Masukkan nama belakang anda';
            cityInput.placeholder = 'Pilih kota';
        }
    }

    // Form validation functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^(\+62|62|0)[0-9]{9,13}$/;
        return re.test(phone.replace(/\s/g, ''));
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function validateForm() {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const city = cityInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        
        let isValid = true;

        // Clear previous errors
        clearErrors();

        // Validate first name
        if (!firstName || firstName.length < 2) {
            showFieldError(firstNameInput, 'Nama minimal 2 karakter');
            isValid = false;
        }

        // Validate last name
        if (!lastName || lastName.length < 2) {
            showFieldError(lastNameInput, 'Nama minimal 2 karakter');
            isValid = false;
        }

        // Validate email
        if (!email) {
            showFieldError(emailInput, 'Email harus diisi');
            isValid = false;
        } else if (!validateEmail(email)) {
            showFieldError(emailInput, 'Format email tidak valid');
            isValid = false;
        }

        // Validate phone
        if (!phone) {
            showFieldError(phoneInput, 'Nomor telepon harus diisi');
            isValid = false;
        } else if (!validatePhone(phone)) {
            showFieldError(phoneInput, 'Format nomor telepon tidak valid');
            isValid = false;
        }

        // Validate city
        if (!city || city.length < 2) {
            showFieldError(cityInput, 'Kota harus diisi');
            isValid = false;
        }

        // Validate password
        if (!password) {
            showFieldError(passwordInput, 'Kata sandi harus diisi');
            isValid = false;
        } else if (!validatePassword(password)) {
            showFieldError(passwordInput, 'Kata sandi minimal 6 karakter');
            isValid = false;
        }

        // Validate confirm password
        if (!confirmPassword) {
            showFieldError(confirmPasswordInput, 'Konfirmasi kata sandi harus diisi');
            isValid = false;
        } else if (password !== confirmPassword) {
            showFieldError(confirmPasswordInput, 'Kata sandi tidak cocok');
            isValid = false;
        }

        return isValid;
    }

    // Real-time validation
    function setupRealTimeValidation() {
        const inputs = [firstNameInput, lastNameInput, emailInput, phoneInput, cityInput, passwordInput, confirmPasswordInput];
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                clearFieldError(this);
                validateField(this);
                updateButtonState();
            });

            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        
        switch(field.id) {
            case 'firstName':
            case 'lastName':
                if (value && value.length >= 2) {
                    field.classList.add('success');
                    field.classList.remove('error');
                }
                break;
            case 'email':
                if (value && validateEmail(value)) {
                    field.classList.add('success');
                    field.classList.remove('error');
                }
                break;
            case 'phone':
                if (value && validatePhone(value)) {
                    field.classList.add('success');
                    field.classList.remove('error');
                }
                break;
            case 'city':
                if (value && value.length >= 2) {
                    field.classList.add('success');
                    field.classList.remove('error');
                }
                break;
            case 'password':
                if (value && validatePassword(value)) {
                    field.classList.add('success');
                    field.classList.remove('error');
                }
                break;
            case 'confirmPassword':
                if (value && value === passwordInput.value) {
                    field.classList.add('success');
                    field.classList.remove('error');
                }
                break;
        }
    }

    function updateButtonState() {
        const allInputs = [firstNameInput, lastNameInput, emailInput, phoneInput, cityInput, passwordInput, confirmPasswordInput];
        const allFilled = allInputs.every(input => input.value.trim() !== '');
        
        if (allFilled) {
            signupBtn.style.opacity = '1';
            signupBtn.style.cursor = 'pointer';
        } else {
            signupBtn.style.opacity = '0.7';
            signupBtn.style.cursor = 'not-allowed';
        }
    }

    // Error handling functions
    function showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    function clearErrors() {
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            clearFieldError(input);
        });
    }

    // Form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showMessage('Mohon perbaiki kesalahan pada form', 'error');
            return;
        }

        // Show loading state
        signupBtn.textContent = 'Mendaftar...';
        signupBtn.classList.add('loading');
        
        // Simulate signup process
        setTimeout(() => {
            const userData = {
                userType: selectedUserType,
                firstName: firstNameInput.value.trim(),
                lastName: lastNameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                city: cityInput.value.trim(),
                registeredAt: new Date().toISOString()
            };

            // Store user data
            localStorage.setItem('umkm_user', JSON.stringify(userData));
            
            // Success
            signupBtn.textContent = 'Berhasil!';
            signupBtn.classList.remove('loading');
            signupBtn.classList.add('success');
            
            const userTypeText = selectedUserType === 'job-seeker' ? 'pencari kerja' : 'perusahaan';
            showMessage(`Selamat datang! Akun ${userTypeText} berhasil dibuat.`, 'success');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = '/LoginPage/Login.html'; 
            }, 2000);
            
        }, 1500);
    });

    // Show message function
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // Insert message after form
        signupForm.parentNode.insertBefore(messageDiv, signupForm.nextSibling);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    // Add message styles
    const messageStyles = document.createElement('style');
    messageStyles.textContent = `
        .message {
            padding: 0.75rem 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            font-size: 0.9rem;
            text-align: center;
            animation: slideIn 0.3s ease;
        }
        
        .message-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .message-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .field-error {
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(messageStyles);

    // Phone number formatting
    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        
        if (value.startsWith('0')) {
            value = '62' + value.substring(1);
        }
        
        if (!value.startsWith('62')) {
            value = '62' + value;
        }
        
        // Format with +
        this.value = '+' + value;
    });

    // Initialize
    setupRealTimeValidation();
    updateButtonState();

    console.log('Signup page loaded successfully');
});