document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lenis Smooth Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Ease out
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. Vanta.js WebGL "Data Nodes" Background
    if (window.VANTA) {
        VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x8a2be2, // Neon Purple
            backgroundColor: 0x050505, // Dark Bg
            points: 12.00,
            maxDistance: 22.00,
            spacing: 16.00
        });
    }

    // 3. GSAP ScrollTrigger Animations
    gsap.registerPlugin(ScrollTrigger);
    
    const fadeElements = document.querySelectorAll('.gsap-fade-up');
    fadeElements.forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%", // Trigger when top of element hits 85% of viewport
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1
        });
    });

    // 4. Magnetic Buttons (GSAP)
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const h = rect.width / 2;
            const w = rect.height / 2;
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - w;
            
            gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: "power3.out" });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
        });
    });

    // 5. Live GitHub Data Fetching
    const githubStatsDiv = document.getElementById('github-stats');
    if (githubStatsDiv) {
        const username = 'GhariebML';
        fetch(`https://api.github.com/users/${username}`)
            .then(res => res.json())
            .then(data => {
                if (data.public_repos !== undefined) {
                    githubStatsDiv.innerHTML = `<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" width="20" style="filter: invert(1);"><span>${data.public_repos}</span> Open Source Repositories | Active Contributor`;
                }
            })
            .catch(err => {
                console.error("GitHub API Error", err);
                githubStatsDiv.style.display = 'none';
            });
    }

    // 6. Chart.js Radar
    const ctx = document.getElementById('skillsChart');
    if (ctx) {
        window.skillsRadar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Machine Learning', 'Deep Learning', 'SQL / ETL', 'Power BI', 'Python', 'NLP', 'Computer Vision'],
                datasets: [{
                    label: 'Proficiency',
                    data: [95, 85, 90, 95, 98, 80, 75],
                    fill: true,
                    backgroundColor: 'rgba(0, 240, 255, 0.2)',
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
                        angleLines: { color: 'rgba(255,255,255,0.1)' },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        pointLabels: { color: '#ffffff', font: { family: 'Inter', size: 12, weight: '600' } },
                        ticks: { display: false, min: 0, max: 100 }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    // 7. Custom Cursor Tracking
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    if(window.matchMedia("(pointer: fine)").matches && cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            cursorOutline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
        });
    }

    // 8. Contact Modal
    const modal = document.getElementById('contact-modal');
    document.getElementById('open-modal-btn')?.addEventListener('click', () => modal.classList.add('active'));
    document.getElementById('close-modal-btn')?.addEventListener('click', () => modal.classList.remove('active'));
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    // 9. Smooth scrolling anchor links via Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) lenis.scrollTo(target);
        });
    });
});
