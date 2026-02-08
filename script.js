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
    // Magnetic CTA: primary button follows cursor slightly (premium feel)
    // --------------------------------------------------------------------------
    const heroCta = document.getElementById('heroCta');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (heroCta && !prefersReducedMotion) {
        const inner = heroCta.querySelector('.btn-primary-glow');
        const strength = 12;
        const radius = 80;

        heroCta.addEventListener('mouseenter', function() {
            heroCta.classList.add('magnetic-active');
        });
        heroCta.addEventListener('mouseleave', function() {
            heroCta.classList.remove('magnetic-active');
            if (inner) {
                inner.style.transform = '';
            }
        });
        heroCta.addEventListener('mousemove', function(e) {
            if (!inner) return;
            const rect = heroCta.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const dist = Math.min(radius, Math.hypot(x, y));
            const factor = (1 - dist / radius) * strength;
            const tx = (x / radius) * factor;
            const ty = (y / radius) * factor;
            inner.style.transform = 'translate(' + tx + 'px, ' + ty + 'px)';
        });
    }

    // --------------------------------------------------------------------------
    // Intersection Observer: Technical Architecture cards fade-in on scroll
    // --------------------------------------------------------------------------
    const archCards = document.querySelectorAll('[data-arch-card]');

    if (archCards.length > 0) {
        const archObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    archObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.15
        });

        archCards.forEach(function(card) {
            archObserver.observe(card);
        });
    }

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

    // --------------------------------------------------------------------------
    // Exit Intent Popup
    // --------------------------------------------------------------------------
    const exitPopup = document.getElementById('exitPopup');
    const exitOverlay = document.getElementById('exitOverlay');
    const exitClose = document.getElementById('exitClose');
    const exitDismiss = document.getElementById('exitDismiss');

    if (exitPopup) {
        let exitShown = sessionStorage.getItem('exitPopupShown');

        function showExitPopup() {
            if (!exitShown) {
                exitPopup.classList.add('active');
                document.body.style.overflow = 'hidden';
                sessionStorage.setItem('exitPopupShown', 'true');
                exitShown = true;
            }
        }

        function hideExitPopup() {
            exitPopup.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Desktop: detect mouse leaving viewport
        document.addEventListener('mouseleave', function(e) {
            if (e.clientY < 10) {
                showExitPopup();
            }
        });

        // Close handlers
        if (exitOverlay) exitOverlay.addEventListener('click', hideExitPopup);
        if (exitClose) exitClose.addEventListener('click', hideExitPopup);
        if (exitDismiss) exitDismiss.addEventListener('click', hideExitPopup);

        // Close on escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && exitPopup.classList.contains('active')) {
                hideExitPopup();
            }
        });
    }

    // --------------------------------------------------------------------------
    // LIVE EFFECTS - Make the site feel alive!
    // --------------------------------------------------------------------------

    // Cursor trail particle effect
    if (!prefersReducedMotion && window.innerWidth > 768) {
        const particles = [];
        const maxParticles = 20;
        let mouseX = 0;
        let mouseY = 0;

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.life = 100;
                this.element = document.createElement('div');
                this.element.className = 'cursor-particle';
                this.element.style.cssText = `
                    position: fixed;
                    width: ${this.size}px;
                    height: ${this.size}px;
                    background: radial-gradient(circle, rgba(107, 140, 168, 0.8), transparent);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9999;
                    left: ${this.x}px;
                    top: ${this.y}px;
                `;
                document.body.appendChild(this.element);
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= 2;
                this.element.style.left = this.x + 'px';
                this.element.style.top = this.y + 'px';
                this.element.style.opacity = this.life / 100;
            }

            remove() {
                this.element.remove();
            }
        }

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (particles.length < maxParticles && Math.random() > 0.7) {
                particles.push(new Particle(mouseX, mouseY));
            }
        });

        function animateParticles() {
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                if (particles[i].life <= 0) {
                    particles[i].remove();
                    particles.splice(i, 1);
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // Parallax effect on hero
    const heroContent = document.querySelector('.hero-content');
    const heroBg = document.querySelector('.hero-bg');

    if (heroContent && heroBg && !prefersReducedMotion) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroContent.style.transform = 'translateY(' + scrolled * 0.4 + 'px)';
                heroBg.style.transform = 'translateY(' + scrolled * 0.2 + 'px)';
            }
        }, { passive: true });
    }

    // 3D tilt effect on cards
    const tiltCards = document.querySelectorAll('.case-card, .transform-card, .testimonial-card');

    if (tiltCards.length > 0 && !prefersReducedMotion) {
        tiltCards.forEach(function(card) {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', function() {
                card.style.transform = '';
            });
        });
    }

    // Floating animation for stats
    const statNumbers = document.querySelectorAll('.stat-number, .proof-number');

    if (statNumbers.length > 0 && !prefersReducedMotion) {
        statNumbers.forEach(function(stat, index) {
            stat.style.animation = `float ${3 + index * 0.3}s ease-in-out infinite`;
        });
    }

    // Interactive glow effect that follows mouse on sections
    const glowSections = document.querySelectorAll('.case-card, .tech-category, .transform-card');

    if (glowSections.length > 0 && !prefersReducedMotion) {
        glowSections.forEach(function(section) {
            section.addEventListener('mousemove', function(e) {
                const rect = section.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                section.style.setProperty('--mouse-x', x + 'px');
                section.style.setProperty('--mouse-y', y + 'px');
            });
        });
    }

    // Smooth reveal animation for tech items
    const techItems = document.querySelectorAll('.tech-item');

    if (techItems.length > 0) {
        const techObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 50);
                    techObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        techItems.forEach(function(item) {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.4s ease';
            techObserver.observe(item);
        });
    }

    // Animated gradient background shift
    const hero = document.querySelector('.hero');
    if (hero && !prefersReducedMotion) {
        let gradientPos = 0;
        setInterval(function() {
            gradientPos += 0.5;
            hero.style.setProperty('--gradient-angle', gradientPos + 'deg');
        }, 50);
    }

})();
