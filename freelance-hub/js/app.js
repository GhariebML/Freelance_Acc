document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Instant tracking for dot
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Smooth trailing for outline
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Cursor hover effects on interactable elements
    const hoverElements = document.querySelectorAll('a, button, input, textarea, select');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorOutline.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursorOutline.classList.remove('cursor-hover'));
    });


    // 2. Scroll Fade-in & Skills Animation
    const observerOptions = { threshold: 0.1 };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                
                // If it's a glass card, fade it in
                if (entry.target.classList.contains('glass-card')) {
                    entry.target.classList.add('visible');
                }
                
                // If it's a skill bar, animate the width
                if (entry.target.classList.contains('skill-bar-fill')) {
                    const targetWidth = entry.target.getAttribute('data-width');
                    entry.target.style.width = targetWidth;
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards and skill bars
    document.querySelectorAll('.glass-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        observer.observe(bar);
    });


    // 3. 3D Tilt Effect on Cards
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
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });


    // 4. Modal Logic
    const modal = document.getElementById('contact-modal');
    const openBtn = document.getElementById('open-modal-btn');
    const closeBtn = document.getElementById('close-modal-btn');

    openBtn.addEventListener('click', () => modal.classList.add('active'));
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    
    // Close modal when clicking outside the content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // 5. Service Category Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Filter logic
            serviceCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.remove('hidden');
                    }, 50);
                } else {
                    card.classList.add('hidden');
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400); // match css transition time
                }
            });
        });
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
