document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    const htmlTag = document.documentElement;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlTag.setAttribute('data-theme', savedTheme);
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlTag.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlTag.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update Chart colors dynamically if needed
        updateChartColors(newTheme);
    });

    // 1. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Only run custom cursor on non-touch devices
    if(window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
        });

        document.querySelectorAll('a, button, input, textarea, select').forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
        });
    } else {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
        document.body.style.cursor = 'auto';
    }


    // 2. Scroll Fade-in 
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('glass-card')) {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // 3. 3D Tilt Effect on Cards (Only non-touch)
    if(window.matchMedia("(pointer: fine)").matches) {
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; 
                const y = e.clientY - rect.top;  
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = 'transform 0.5s ease, box-shadow 0.4s ease';
            });
            card.addEventListener('mouseenter', () => card.style.transition = 'none');
        });
    }

    // 4. Modal & EmailJS Logic
    const modal = document.getElementById('contact-modal');
    const openBtn = document.getElementById('open-modal-btn');
    const closeBtn = document.getElementById('close-modal-btn');
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    openBtn.addEventListener('click', () => modal.classList.add('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        // EmailJS Implementation
        // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
        // Mocking success for demo purposes:
        setTimeout(() => {
            btn.textContent = 'Send Inquiry';
            btn.disabled = false;
            formStatus.style.display = 'block';
            formStatus.style.color = '#10b981'; // Success green
            formStatus.textContent = 'Message sent successfully! I will reply shortly.';
            form.reset();
        }, 1500);
    });

    // 5. Service Category Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterValue = btn.getAttribute('data-filter');
            serviceCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.remove('hidden'), 50);
                } else {
                    card.classList.add('hidden');
                    setTimeout(() => card.style.display = 'none', 400);
                }
            });
        });
    });

    // 6. Chart.js Radar Chart
    const ctx = document.getElementById('skillsChart');
    if (ctx) {
        // Function to get computed CSS variables
        const getCSSVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        
        let textColor = getCSSVar('--text-primary');
        let gridColor = getCSSVar('--card-border');

        window.skillsRadar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Machine Learning', 'Deep Learning', 'SQL / ETL', 'Power BI', 'Python', 'NLP', 'Computer Vision'],
                datasets: [{
                    label: 'Proficiency',
                    data: [95, 85, 90, 95, 98, 80, 75],
                    fill: true,
                    backgroundColor: 'rgba(0, 240, 255, 0.2)', // Neon Blue Transparent
                    borderColor: '#00f0ff',
                    pointBackgroundColor: '#8a2be2',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#ff0055'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        angleLines: { color: gridColor },
                        grid: { color: gridColor },
                        pointLabels: {
                            color: textColor,
                            font: { family: 'Inter', size: 12, weight: '600' }
                        },
                        ticks: { display: false, min: 0, max: 100 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // Helper to update chart colors when theme switches
    function updateChartColors(theme) {
        if (!window.skillsRadar) return;
        
        const isDark = theme === 'dark';
        const newTextColor = isDark ? '#ffffff' : '#0f172a';
        const newGridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)';

        window.skillsRadar.options.scales.r.pointLabels.color = newTextColor;
        window.skillsRadar.options.scales.r.angleLines.color = newGridColor;
        window.skillsRadar.options.scales.r.grid.color = newGridColor;
        window.skillsRadar.update();
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });
});
