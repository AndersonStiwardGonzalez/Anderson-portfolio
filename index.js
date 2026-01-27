document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Language Toggle
    const langBtn = document.getElementById('lang-toggle');
    const langText = langBtn.querySelector('.lang-text');
    let currentLang = 'EN';

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

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'EN' ? 'ES' : 'EN';
        updateLanguage(currentLang);
    });

    // Custom Cursor
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;

        outline.animate({
            left: `${e.clientX}px`,
            top: `${e.clientY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section, .exp-card, .course-item, .award-card').forEach(el => observer.observe(el));
});
