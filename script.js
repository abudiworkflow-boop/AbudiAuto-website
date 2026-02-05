/* ==========================================================================
   AbudiAuto - Optimized JavaScript (Performance-focused)
   ========================================================================== */

(function() {
    'use strict';

    // Cache DOM elements once
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // --------------------------------------------------------------------------
    // Debounce utility - prevents excessive function calls
    // --------------------------------------------------------------------------
    function debounce(fn, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    // --------------------------------------------------------------------------
    // Navigation scroll effect - debounced
    // --------------------------------------------------------------------------
    let lastScrollY = 0;
    let navScrolled = false;

    function updateNav() {
        const scrollY = window.scrollY;
        const shouldBeScrolled = scrollY > 50;

        if (shouldBeScrolled !== navScrolled) {
            navScrolled = shouldBeScrolled;
            nav.classList.toggle('scrolled', shouldBeScrolled);
        }
        lastScrollY = scrollY;
    }

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', debounce(updateNav, 10), { passive: true });

    // --------------------------------------------------------------------------
    // Mobile Navigation
    // --------------------------------------------------------------------------
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navMenu.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // --------------------------------------------------------------------------
    // Intersection Observer for scroll animations - single observer
    // --------------------------------------------------------------------------
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0) {
        const scrollObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    scrollObserver.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, {
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        });

        animatedElements.forEach(function(el) {
            scrollObserver.observe(el);
        });
    }

    // --------------------------------------------------------------------------
    // Counter animation - lightweight version
    // --------------------------------------------------------------------------
    const counters = document.querySelectorAll('[data-target]');

    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'), 10);

                    // Simple counter animation
                    let current = 0;
                    const increment = target / 40; // 40 steps
                    const timer = setInterval(function() {
                        current += increment;
                        if (current >= target) {
                            el.textContent = target;
                            clearInterval(timer);
                        } else {
                            el.textContent = Math.floor(current);
                        }
                    }, 30);

                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function(el) {
            counterObserver.observe(el);
        });
    }

    // --------------------------------------------------------------------------
    // FAQ Accordion - event delegation
    // --------------------------------------------------------------------------
    const faqGrid = document.querySelector('.faq-grid');

    if (faqGrid) {
        faqGrid.addEventListener('click', function(e) {
            const question = e.target.closest('.faq-question');
            if (!question) return;

            const item = question.closest('.faq-item');
            const isActive = item.classList.contains('active');

            // Close all items
            faqGrid.querySelectorAll('.faq-item.active').forEach(function(activeItem) {
                activeItem.classList.remove('active');
                activeItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    }

    // --------------------------------------------------------------------------
    // Smooth scroll for anchor links
    // --------------------------------------------------------------------------
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navHeight = nav.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });

    // --------------------------------------------------------------------------
    // Close mobile menu on escape
    // --------------------------------------------------------------------------
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // --------------------------------------------------------------------------
    // Resize handler - close mobile menu on desktop
    // --------------------------------------------------------------------------
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250), { passive: true });

})();
