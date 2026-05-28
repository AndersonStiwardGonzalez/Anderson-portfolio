document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    const welcomeCover = document.getElementById('welcome-cover');
    const enterBtn = document.getElementById('enter-btn');
    
    // iOS scroll block handler
    const preventScroll = (e) => {
        if (welcomeCover && !welcomeCover.classList.contains('dismissed')) {
            e.preventDefault();
        }
    };

    if (document.body.classList.contains('cover-active')) {
        document.addEventListener('touchmove', preventScroll, { passive: false });
    }

    const dismissCover = () => {
        if (welcomeCover) {
            welcomeCover.classList.add('dismissed');
            // Completely hide from DOM layout after transition to prevent blocking touch events
            setTimeout(() => {
                welcomeCover.style.display = 'none';
            }, 1200);
        }
        document.body.classList.remove('cover-active');
        document.removeEventListener('touchmove', preventScroll);
    };

    if (welcomeCover && enterBtn) {
        enterBtn.addEventListener('click', dismissCover);

        const handleKeyPress = (e) => {
            if (welcomeCover && !welcomeCover.classList.contains('dismissed')) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dismissCover();
                    window.removeEventListener('keydown', handleKeyPress);
                }
            }
        };
        window.addEventListener('keydown', handleKeyPress);
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Language Toggle
    const langBtn = document.getElementById('lang-toggle');
    const langText = langBtn.querySelector('.lang-text');
    let currentLang = 'ES'; // Default is Spanish for Colombian context

    const updateLanguage = (lang) => {
        document.querySelectorAll('[data-en]').forEach(el => {
            const translation = el.getAttribute(`data-${lang.toLowerCase()}`);
            if (el.classList.contains('exp-list') || el.classList.contains('hobby-list')) {
                el.innerHTML = translation;
            } else {
                el.innerText = translation;
            }
        });
        langText.innerText = lang === 'EN' ? 'ES' : 'EN';
        document.documentElement.lang = lang.toLowerCase();
    };

    // Initialize default language
    updateLanguage(currentLang);

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'EN' ? 'ES' : 'EN';
        updateLanguage(currentLang);
    });

    // Custom Cursor
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        if (dot && outline) {
            dot.style.left = `${e.clientX}px`;
            dot.style.top = `${e.clientY}px`;

            outline.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 500, fill: "forwards" });
        }
    });

    const addHoverClass = () => {
        if (dot && outline) {
            dot.classList.add('cursor-hover');
            outline.classList.add('cursor-hover');
        }
    };

    const removeHoverClass = () => {
        if (dot && outline) {
            dot.classList.remove('cursor-hover');
            outline.classList.remove('cursor-hover');
        }
    };

    document.querySelectorAll('a, button, .btn, .control-btn, .ref-card, .exp-card, .course-item, .award-card, .tab-btn, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', addHoverClass);
        el.addEventListener('mouseleave', removeHoverClass);
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section, .exp-card, .course-item, .award-card, .tab-pane').forEach(el => observer.observe(el));

    // DNA Particle Canvas Animation (Hero Background)
    const canvas = document.getElementById('hero-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 120 };

        const resizeCanvas = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.baseSize = Math.random() * 2.5 + 1.2;
                this.size = this.baseSize;
                this.speedX = Math.random() * 0.3 - 0.15;
                this.speedY = Math.random() * 0.3 - 0.15;
                // Cyan accents for dark theme, Sky blue for light theme
                this.color = Math.random() > 0.4 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(99, 102, 241, 0.18)';
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = this.x - mouse.x;
                    let dy = this.y - mouse.y;
                    let distance = Math.hypot(dx, dy);
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = dx / distance;
                        let directionY = dy / distance;
                        
                        // Push away from mouse
                        this.x += directionX * force * 1.5;
                        this.y += directionY * force * 1.5;
                        this.size = this.baseSize * (1 + force * 0.4);
                    } else {
                        if (this.size > this.baseSize) this.size -= 0.05;
                    }
                } else {
                    if (this.size > this.baseSize) this.size -= 0.05;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const numberOfParticles = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle());
            }
        };

        initParticles();
        window.addEventListener('resize', initParticles);

        const animate = () => {
            // Draw gradient background that matches theme slightly
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Connect particles with lines if they are close
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const opacity = ((130 - dist) / 130) * 0.12;
                        ctx.strokeStyle = html.getAttribute('data-theme') === 'light' 
                            ? `rgba(2, 132, 199, ${opacity})`
                            : `rgba(56, 189, 248, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
                particles[i].update();
                particles[i].draw();
            }
            requestAnimationFrame(animate);
        };
        animate();
    }

    // Skills Tab Toggles
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
                
                // Add staggered animation to child tags
                const tags = targetPane.querySelectorAll('.tags span');
                tags.forEach((tag, idx) => {
                    tag.style.opacity = '0';
                    tag.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        tag.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                        tag.style.opacity = '1';
                        tag.style.transform = 'translateY(0)';
                    }, idx * 30);
                });
            }
        });
    });

    // Filtering logic for Courses and Awards
    const setupFilter = (filtersId, gridId) => {
        const filterBtns = document.querySelectorAll(`#${filtersId} .filter-btn`);
        const grid = document.getElementById(gridId);
        if (!grid) return;
        const items = grid.children;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from other buttons in this group
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                Array.from(items).forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        item.classList.remove('hidden');
                        item.style.display = '';
                        // Apply brief fade-in transition
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95) translateY(10px)';
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        item.classList.add('hidden');
                        item.style.display = 'none';
                    }
                });
            });
        });
    };

    setupFilter('courses-filters', 'courses-grid');
    setupFilter('awards-filters', 'awards-grid');
    // Mobile Hamburger Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate trigger of document click listener
            navLinks.classList.toggle('active');
            const iconSpan = menuToggle.querySelector('span');
            if (iconSpan) {
                iconSpan.innerText = navLinks.classList.contains('active') ? '✕' : '☰';
            }
        });

        // Close menu when clicking on any section link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const iconSpan = menuToggle.querySelector('span');
                if (iconSpan) {
                    iconSpan.innerText = '☰';
                }
            });
        });

        // Close menu when clicking outside of it
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                const iconSpan = menuToggle.querySelector('span');
                if (iconSpan) {
                    iconSpan.innerText = '☰';
                }
            }
        });
    }
});
