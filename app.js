/* ═══════════════════════════════════════════════
   RATONKE HUB — App Logic
   Sprint 0: Navegación + scroll animations
   ═══════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── Mobile Nav Toggle ───
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
            // Animate hamburger → X
            const spans = navToggle.querySelectorAll('span');
            const isOpen = navLinks.classList.contains('open');
            spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
            spans[1].style.opacity = isOpen ? '0' : '1';
            spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
        });

        // Close nav when clicking a link
        navLinks.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '1';
                spans[2].style.transform = '';
            });
        });
    }

    // ─── Active Nav Link on Scroll ───
    const sections = document.querySelectorAll('section[id]');
    const navLinkAll = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        var scrollY = window.scrollY + 100;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinkAll.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ─── Scroll Reveal Animations ───
    var animatedElements = document.querySelectorAll(
        '.about-card, .project-card, .community-link, .about-showcase, .about-intro'
    );

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    animatedElements.forEach(function (el) {
        observer.observe(el);
    });

    // ─── Header Background on Scroll ───
    var header = document.querySelector('.site-header');
    var lastScroll = 0;

    window.addEventListener('scroll', function () {
        var current = window.scrollY;
        if (current > 50) {
            header.style.borderBottomColor = 'rgba(0, 240, 255, 0.08)';
        } else {
            header.style.borderBottomColor = 'rgba(255, 255, 255, 0.06)';
        }
        lastScroll = current;
    }, { passive: true });

})();
