/* ==========================================================================
   AbudiAuto - Premium Website JavaScript
   ========================================================================== */

(function() {
    'use strict';

    // --------------------------------------------------------------------------
    // DOM Elements
    // --------------------------------------------------------------------------
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const faqItems = document.querySelectorAll('.faq-item');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const statNumbers = document.querySelectorAll('[data-target]');

    // --------------------------------------------------------------------------
    // Navigation - Scroll Effect
    // --------------------------------------------------------------------------
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNav() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    });

    // --------------------------------------------------------------------------
    // Mobile Navigation Toggle
    // --------------------------------------------------------------------------
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // --------------------------------------------------------------------------
    // Smooth Scroll for Anchor Links
    // --------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

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
    });

    // --------------------------------------------------------------------------
    // Intersection Observer - Scroll Animations
    // --------------------------------------------------------------------------
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Stagger animation for grid items
                const parent = entry.target.parentElement;
                if (parent && (parent.classList.contains('automation-grid') ||
                              parent.classList.contains('transform-cards') ||
                              parent.classList.contains('proof-grid'))) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    animatedElements.forEach(function(el) {
        scrollObserver.observe(el);
    });

    // --------------------------------------------------------------------------
    // Counter Animation
    // --------------------------------------------------------------------------
    const counterObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, counterObserverOptions);

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        const easeOutQuad = function(t) { return t * (2 - t); };

        let frame = 0;

        function updateCounter() {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            const currentValue = Math.round(target * progress);

            element.textContent = currentValue;

            if (frame < totalFrames) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        updateCounter();
    }

    statNumbers.forEach(function(el) {
        counterObserver.observe(el);
    });

    // --------------------------------------------------------------------------
    // FAQ Accordion
    // --------------------------------------------------------------------------
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(function(otherItem) {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            this.setAttribute('aria-expanded', !isActive);
        });

        // Keyboard accessibility
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // --------------------------------------------------------------------------
    // Parallax Effect for Hero (subtle)
    // --------------------------------------------------------------------------
    const heroGlow = document.querySelector('.hero-glow');

    if (heroGlow) {
        let rafId = null;

        window.addEventListener('scroll', function() {
            if (rafId) return;

            rafId = requestAnimationFrame(function() {
                const scrollY = window.scrollY;
                const heroHeight = document.querySelector('.hero').offsetHeight;

                if (scrollY < heroHeight) {
                    const opacity = 1 - (scrollY / heroHeight);
                    const translateY = scrollY * 0.3;
                    heroGlow.style.opacity = Math.max(0, opacity);
                    heroGlow.style.transform = `translateX(-50%) translateY(${translateY}px)`;
                }

                rafId = null;
            });
        });
    }

    // --------------------------------------------------------------------------
    // Button Ripple Effect
    // --------------------------------------------------------------------------
    document.querySelectorAll('.btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                pointer-events: none;
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(function() {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation to document
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // --------------------------------------------------------------------------
    // Active Navigation Highlight
    // --------------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
        const scrollY = window.scrollY + 200;

        sections.forEach(function(section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);

    // Add active state styling
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .nav-link.active {
            color: var(--color-primary-light) !important;
        }
    `;
    document.head.appendChild(navStyle);

    // --------------------------------------------------------------------------
    // Keyboard Navigation Improvements
    // --------------------------------------------------------------------------
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            navToggle.focus();
        }
    });

    // --------------------------------------------------------------------------
    // Performance: Debounce Resize Handler
    // --------------------------------------------------------------------------
    let resizeTimeout;

    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(function() {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }, 250);
    });

    // --------------------------------------------------------------------------
    // Preload Critical Animations
    // --------------------------------------------------------------------------
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');

        // Trigger hero animations
        document.querySelectorAll('.hero .animate-fade-in').forEach(function(el, index) {
            setTimeout(function() {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 150);
        });
    });

    // --------------------------------------------------------------------------
    // Console Welcome Message
    // --------------------------------------------------------------------------
    console.log(
        '%c🚀 AbudiAuto',
        'font-size: 24px; font-weight: bold; color: #6B8CA8;'
    );
    console.log(
        '%cAI Automation Agency - Building Intelligent Systems',
        'font-size: 14px; color: #888;'
    );
    console.log(
        '%cInterested in how this was built? Let\'s talk: abudiworkflow@gmail.com',
        'font-size: 12px; color: #555;'
    );

})();
