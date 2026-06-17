/**
 * Tirenify Pitch - Premium Interactive Experience
 * Features: Parallax, Particles, Scroll Animations, Video Controls
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    
    const CONFIG = {
        loaderDuration: 2000,
        intersectionThreshold: 0.12,
        scrollThreshold: 50,
        parallaxEnabled: true,
        particleCount: 30,
        videoAutoplayDelay: 500,
    };

    // ============================================
    // DOM ELEMENTS CACHE
    // ============================================
    
    const elements = {
        loader: null,
        mainContent: null,
        body: null,
        navbar: null,
        revealElements: null,
        video: null,
        playBtn: null,
        videoOverlay: null,
        particles: null,
        heroGradients: null,
    };

    // ============================================
    // STATE
    // ============================================
    
    let scrollY = 0;
    let ticking = false;

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        cacheElements();
        createParticles();
        handleLoader();
        setupEventListeners();
        setupScrollAnimations();
        setupVideoControls();
        setupSmoothScroll();
        
        // Add loaded class after everything is ready
        setTimeout(() => {
            elements.body.classList.add('loaded');
        }, 100);
    }

    function cacheElements() {
        elements.loader = document.getElementById('loader');
        elements.mainContent = document.getElementById('main-content');
        elements.body = document.body;
        elements.navbar = document.getElementById('navbar');
        elements.revealElements = document.querySelectorAll('.reveal');
        elements.video = document.getElementById('philosophy-video');
        elements.playBtn = document.getElementById('play-btn');
        elements.videoOverlay = document.getElementById('video-overlay');
        elements.particles = document.getElementById('particles');
        elements.heroGradients = document.querySelectorAll('.hero-gradient');
    }

    // ============================================
    // PARTICLE SYSTEM
    // ============================================
    
    function createParticles() {
        if (!elements.particles) return;
        
        const container = elements.particles;
        const count = CONFIG.particleCount;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const size = Math.random() * 3 + 1;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 10;
            const opacity = Math.random() * 0.5 + 0.1;
            
            particle.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                background: ${Math.random() > 0.5 ? 'var(--accent-primary)' : 'var(--accent-secondary)'};
                border-radius: 50%;
                opacity: ${opacity};
                animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
                pointer-events: none;
            `;
            
            container.appendChild(particle);
        }
        
        // Add particle animation keyframes
        if (!document.getElementById('particle-styles')) {
            const style = document.createElement('style');
            style.id = 'particle-styles';
            style.textContent = `
                @keyframes particleFloat {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: var(--particle-opacity, 0.3);
                    }
                    25% {
                        transform: translate(${Math.random() > 0.5 ? '' : '-'}20px, -30px) scale(1.2);
                    }
                    50% {
                        transform: translate(${Math.random() > 0.5 ? '' : '-'}40px, 20px) scale(0.8);
                        opacity: 0.1;
                    }
                    75% {
                        transform: translate(${Math.random() > 0.5 ? '' : '-'}10px, -10px) scale(1.1);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ============================================
    // LOADER
    // ============================================
    
    function handleLoader() {
        setTimeout(() => {
            if (elements.loader) {
                elements.loader.classList.add('hidden');
                
                // Enable body scroll
                elements.body.classList.remove('hidden');
                
                // Trigger initial animations
                setTimeout(() => {
                    triggerInitialAnimations();
                }, 400);
            }
        }, CONFIG.loaderDuration);
    }

    function triggerInitialAnimations() {
        // Hero elements already have CSS animations
        // This can trigger any additional JS animations if needed
        const heroElements = document.querySelectorAll('.hero-section .reveal');
        heroElements.forEach(el => el.classList.add('visible'));
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    
    function setupEventListeners() {
        // Scroll handling with requestAnimationFrame
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Resize handling
        window.addEventListener('resize', debounce(onResize, 250));
        
        // Navbar scroll effect
        setupNavbarScroll();
    }

    function onScroll() {
        scrollY = window.pageYOffset;
        
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                updateNavbar();
                ticking = false;
            });
            ticking = true;
        }
    }

    function onResize() {i
        // Recalculate any layout-dependent values
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    
    function setupNavbarScroll() {
        if (!elements.navbar) return;
        
        updateNavbar();
    }

    function updateNavbar() {
        if (!elements.navbar) return;
        
        if (scrollY > CONFIG.scrollThreshold) {
            elements.navbar.classList.add('scrolled');
        } else {
            elements.navbar.classList.remove('scrolled');
        }
    }

    // ============================================
    // PARALLAX EFFECTS
    // ============================================
    
    function updateParallax() {
        if (!CONFIG.parallaxEnabled) return;
        
        // Only apply on desktop
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            return;
        }
        
        // Hero gradients parallax
        if (elements.heroGradients) {
            elements.heroGradients.forEach((gradient, index) => {
                const speed = 0.1 + (index * 0.05);
                const yPos = scrollY * speed;
                gradient.style.transform = `translateY(${yPos}px)`;
            });
        }
        
        // Hero grid parallax
        const heroGrid = document.querySelector('.hero-grid');
        if (heroGrid) {
            heroGrid.style.transform = `translateY(${scrollY * 0.15}px)`;
        }
        
        // Section background parallax
        document.querySelectorAll('[data-parallax]').forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
            const rect = el.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const offset = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const translateY = (offset - 0.5) * 100 * speed;
                el.style.transform = `translateY(${translateY}px)`;
            }
        });
    }

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    
    function setupScrollAnimations() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements immediately
            elements.revealElements.forEach(el => el.classList.add('visible'));
            return;
        }
        
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            elements.revealElements.forEach(el => {
                el.classList.add('visible');
                el.style.transition = 'none';
            });
            return;
        }
        
        const revealObserver = new IntersectionObserver(
            handleRevealIntersection,
            {
                root: null,
                rootMargin: '0px 0px -50px 0px',
                threshold: CONFIG.intersectionThreshold,
            }
        );
        
        elements.revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    function handleRevealIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Optional: unobserve after reveal for one-time animation
                // observer.unobserve(entry.target);
            }
        });
    }

    // ============================================
    // VIDEO CONTROLS
    // ============================================
    
    function setupVideoControls() {
        if (!elements.video || !elements.playBtn) return;
        
        prepareVideoPlayback();
        
        // Play button click
        elements.playBtn.addEventListener('click', handleVideoPlay);
        
        // Video click to toggle play/pause
        elements.video.addEventListener('click', toggleVideoPlay);
        
        // Video ended
        elements.video.addEventListener('ended', handleVideoEnd);
        
        // Video errors
        elements.video.addEventListener('error', handleVideoError);
    }

    function prepareVideoPlayback() {
        if (!elements.video) return;
        
        // Set start time and ensure audio is on
        elements.video.currentTime = 15.7;
        elements.video.muted = false;
        elements.video.autoplay = true;
        
        elements.video.addEventListener('loadedmetadata', () => {
            if (elements.video.currentTime < 15.7) {
                elements.video.currentTime = 15.7;
            }
        });
        
        // Try autoplay
        elements.video.play().then(() => {
            hideVideoOverlay();
        }).catch(error => {
            console.warn('Video autoplay failed:', error);
            // Show overlay for manual play
            showVideoOverlay();
        });
    }

    function handleVideoPlay() {
        if (!elements.video) return;
        
        elements.video.play().then(() => {
            hideVideoOverlay();
        }).catch(error => {
            console.warn('Video play failed:', error);
        });
    }

    function toggleVideoPlay() {
        if (!elements.video) return;
        
        if (elements.video.paused) {
            elements.video.play();
            hideVideoOverlay();
        } else {
            elements.video.pause();
        }
    }

    function handleVideoEnd() {
        showVideoOverlay();
    }

    function handleVideoError(e) {
        console.warn('Video failed to load:', e);
        showVideoOverlay();
    }

    function showVideoOverlay() {
        if (elements.videoOverlay) {
            elements.videoOverlay.classList.remove('hidden');
        }
    }

    function hideVideoOverlay() {
        if (elements.videoOverlay) {
            elements.videoOverlay.classList.add('hidden');
        }
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // ============================================
    // ACCESSIBILITY
    // ============================================
    
    function setupAccessibility() {
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open overlays if needed
                if (elements.video && !elements.video.paused) {
                    elements.video.pause();
                    showVideoOverlay();
                }
            }
        });
        
        // Ensure all interactive elements are focusable
        const interactiveElements = document.querySelectorAll('a, button, [tabindex]');
        interactiveElements.forEach(el => {
            if (!el.classList.contains('focus-visible-polyfill')) {
                el.classList.add('focus-visible-polyfill');
            }
        });
    }

    // ============================================
    // ANIMATION FALLBACKS
    // ============================================
    
    function setupAnimationFallbacks() {
        if (!('IntersectionObserver' in window)) {
            elements.revealElements.forEach(el => el.classList.add('visible'));
        }
        
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            elements.revealElements.forEach(el => {
                el.style.transition = 'none';
                el.classList.add('visible');
            });
        }
    }

    // ============================================
    // INITIALIZE
    // ============================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Run fallbacks immediately
    setupAnimationFallbacks();
    setupAccessibility();

})();

// ============================================
// GLOBAL ERROR HANDLING
// ============================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// ============================================
// PUBLIC API (for debugging)
// ============================================

window.TirenifyPitch = {
    replayLoader: function() {
        const loader = document.getElementById('loader');
        const mainContent = document.getElementById('main-content');
        
        if (loader && mainContent) {
            loader.classList.remove('hidden');
            mainContent.classList.add('hidden');
            
            setTimeout(() => {
                loader.classList.add('hidden');
                mainContent.classList.remove('hidden');
            }, CONFIG.loaderDuration);
        }
    },
    
    reveal: function(selector) {
        const el = document.querySelector(selector);
        if (el) {
            el.classList.add('visible');
        }
    },
    
    getScrollProgress: function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    }
};