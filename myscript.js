document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. SMART MOBILE MENU
       ========================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelectorAll('.nav-links a, nav a');

    if (menuToggle) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menuToggle.checked) {
                    menuToggle.checked = false;
                }
            });
        });

        const updateActiveNavLink = () => {
            const currentPath = window.location.pathname.toLowerCase();
            const currentHash = window.location.hash;
            navLinks.forEach(link => {
                const target = new URL(link.href, window.location.href);
                const isActive = target.pathname.toLowerCase() === currentPath
                    && (!target.hash || target.hash === currentHash);
                link.classList.toggle('active', isActive);
                if (isActive) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };

        updateActiveNavLink();
        window.addEventListener('hashchange', updateActiveNavLink);
    }

    /* ==========================================
       2. SERVICE SEARCH FILTER
       ========================================== */
    const serviceSearch = document.getElementById('serviceSearch');
    const searchableItems = document.querySelectorAll('.searchable-item');

    if (serviceSearch && searchableItems.length > 0) {
        const filterServices = () => {
            const searchTerm = serviceSearch.value.trim().toLowerCase();

            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                const matches = text.includes(searchTerm);
                item.style.display = matches ? '' : 'none';
            });
        };

        serviceSearch.addEventListener('input', filterServices);
    }

    /* ==========================================
       3. IMAGE LIGHTBOX
       ========================================== */
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImg');
    const closeLightboxButton = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const galleryImages = document.querySelectorAll('.service-card img, .lightbox-trigger');

    if (lightbox && lightboxImage && galleryImages.length > 0) {
        const openLightbox = (image) => {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt || 'Expanded gallery image';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightboxImage.src = '';
            document.body.style.overflow = '';
        };

        galleryImages.forEach(image => {
            image.style.cursor = 'zoom-in';
            image.addEventListener('click', () => openLightbox(image));
        });

        if (closeLightboxButton) {
            closeLightboxButton.addEventListener('click', closeLightbox);
        }

        lightbox.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    /* ==========================================
       4. ENQUIRY FORM VALIDATION
       ========================================== */
    const enquiryForm = document.getElementById('enquiryForm');

    if (enquiryForm) {
        const fieldConfig = {
            name: {
                input: document.getElementById('name'),
                error: document.getElementById('nameError'),
                validate: value => value.trim().length > 1
            },
            email: {
                input: document.getElementById('email'),
                error: document.getElementById('emailError'),
                validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
            },
            serviceType: {
                input: document.getElementById('serviceType'),
                error: document.getElementById('serviceError'),
                validate: value => value.trim() !== ''
            },
            message: {
                input: document.getElementById('message'),
                error: document.getElementById('messageError'),
                validate: value => value.trim().length > 10
            }
        };

        const showError = (fieldName, isValid) => {
            const config = fieldConfig[fieldName];
            if (!config || !config.error) return;
            config.error.style.display = isValid ? 'none' : 'block';
        };

        const validateField = (fieldName) => {
            const config = fieldConfig[fieldName];
            if (!config || !config.input) return true;

            const value = config.input.value;
            const isValid = config.validate(value);
            showError(fieldName, isValid);
            return isValid;
        };

        Object.keys(fieldConfig).forEach(fieldName => {
            const config = fieldConfig[fieldName];
            if (!config || !config.input) return;

            config.input.addEventListener('input', () => validateField(fieldName));
            config.input.addEventListener('blur', () => validateField(fieldName));
        });

        enquiryForm.addEventListener('submit', (event) => {
            event.preventDefault();

            let allValid = true;
            Object.keys(fieldConfig).forEach(fieldName => {
                if (!validateField(fieldName)) {
                    allValid = false;
                }
            });

            if (!allValid) {
                return;
            }

            const successMessage = document.getElementById('formSuccess');
            enquiryForm.reset();
            Object.keys(fieldConfig).forEach(fieldName => showError(fieldName, true));

            if (successMessage) {
                successMessage.style.display = 'block';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 3000);
            }
        });
    }
});