/**
 * Tirenify Pitch - Interactive Animations & Functionality
 * Premium scroll-triggered animations and video controls
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    
    const CONFIG = {
        loaderDuration: 3000,        // Time before loader hides (ms)
        intersectionThreshold: 0.15, // Trigger point for reveal animations
        scrollSmoothness: 0.1,       // For custom scroll effects (if needed)
        videoAutoplayDelay: 500,     // Delay before checking video autoplay
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    
    const elements = {
        loader: null,
        mainContent: null,
        body: null,
        revealElements: null,
        fadeInElements: null,
        video: null,
        playBtn: null,
        videoOverlay: null,
        roadmapItems: null,
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    
    function init() {
        cacheElements();
        handleLoader();
        setupScrollAnimations();
        setupVideoControls();
        setupSmoothScroll();
        setupRoadmapObserver();
        
        // Add loaded class to body after everything is ready
        setTimeout(() => {
            elements.body.classList.add('loaded');
        }, 100);
    }

    function cacheElements() {
        elements.loader = document.getElementById('loader');
        elements.mainContent = document.getElementById('main-content');
        elements.body = document.body;
        elements.revealElements = document.querySelectorAll('.reveal');
        elements.fadeInElements = document.querySelectorAll('.fade-in');
        elements.video = document.getElementById('philosophy-video');
        elements.playBtn = document.getElementById('play-btn');
        elements.videoOverlay = document.querySelector('.video-overlay');
        elements.roadmapItems = document.querySelectorAll('.roadmap-item');
    }

    // ============================================
    // LOADER ANIMATION
    // ============================================
    
    function handleLoader() {
        // Wait for loader animation to complete
        setTimeout(() => {
            if (elements.loader) {
                elements.loader.classList.add('hidden');
                elements.mainContent.classList.remove('hidden');
                elements.body.classList.remove('hidden');
                
                // Trigger initial animations after loader
                setTimeout(() => {
                    triggerInitialAnimations();
                }, 400);
            }
        }, CONFIG.loaderDuration);
    }

    function triggerInitialAnimations() {
        // The hero section elements have CSS animations with delays
        // This function can trigger additional JS animations if needed
        const heroElements = document.querySelectorAll('.hero-section .fade-in');
        heroElements.forEach(el => el.classList.add('visible'));
    }

    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    
    function setupScrollAnimations() {
        // Create intersection observer for reveal animations
        const revealObserver = new IntersectionObserver(
            handleRevealIntersection,
            {
                root: null,
                rootMargin: '0px 0px -50px 0px',
                threshold: CONFIG.intersectionThreshold,
            }
        );

        // Observe all reveal elements
        elements.revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    function handleRevealIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Optionally unobserve after reveal (for one-time animation)
                // observer.unobserve(entry.target);
            }
        });
    }

    // ============================================
    // ROADMAP OBSERVER
    // ============================================
    
    function setupRoadmapObserver() {
        const roadmapObserver = new IntersectionObserver(
            handleRoadmapIntersection,
            {
                root: null,
                rootMargin: '0px 0px -50% 0px',
                threshold: 0.5,
            }
        );

        elements.roadmapItems.forEach(item => {
            roadmapObserver.observe(item);
        });
    }

    function handleRoadmapIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                const marker = entry.target.querySelector('.roadmap-marker');
                if (marker) {
                    marker.classList.add('active');
                }
            } else {
                entry.target.classList.remove('active');
                const marker = entry.target.querySelector('.roadmap-marker');
                if (marker) {
                    marker.classList.remove('active');
                }
            }
        });
    }

    // ============================================
    // VIDEO CONTROLS
    // ============================================
    
    function setupVideoControls() {
        if (!elements.video || !elements.playBtn) return;

        // Play button click handler
        elements.playBtn.addEventListener('click', handleVideoPlay);
        
        // Video click to pause/play
        elements.video.addEventListener('click', toggleVideoPlay);
        
        // Handle video end
        elements.video.addEventListener('ended', handleVideoEnd);
        
        // Handle video errors gracefully
        elements.video.addEventListener('error', handleVideoError);
    }

    function handleVideoPlay() {
        if (elements.video && elements.videoOverlay) {
            elements.video.play().then(() => {
                elements.videoOverlay.classList.add('hidden');
            }).catch(error => {
                console.warn('Video autoplay failed:', error);
                // Video might not be available, hide overlay gracefully
                elements.videoOverlay.classList.add('hidden');
            });
        }
    }

    function toggleVideoPlay() {
        if (!elements.video) return;
        
        if (elements.video.paused) {
            elements.video.play();
            if (elements.videoOverlay) {
                elements.videoOverlay.classList.add('hidden');
            }
        } else {
            elements.video.pause();
        }
    }

    function handleVideoEnd() {
        // Show play button again when video ends
        if (elements.videoOverlay) {
            elements.videoOverlay.classList.remove('hidden');
        }
    }

    function handleVideoError(e) {
        console.warn('Video failed to load:', e);
        // Hide overlay so user can see video element's fallback message
        if (elements.videoOverlay) {
            elements.videoOverlay.classList.add('hidden');
        }
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    
    function setupSmoothScroll() {
        // Handle all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    /**
     * Debounce function for performance optimization
     */
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

    /**
     * Throttle function for scroll events
     */
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

    /**
     * Check if element is in viewport
     */
    function isInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Lerp (Linear Interpolation) for smooth animations
     */
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    /**
     * Clamp a value between min and max
     */
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // ============================================
    // PARALLAX EFFECTS (Optional Enhancement)
    // ============================================
    
    function setupParallax() {
        // Only enable on non-mobile devices for performance
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            return;
        }

        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0) return;

        const handleParallax = throttle(() => {
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
                const rect = el.getBoundingClientRect();
                const visible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (visible) {
                    const offset = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                    const translateY = (offset - 0.5) * 100 * speed;
                    el.style.transform = `translateY(${translateY}px)`;
                }
            });
        }, 16); // ~60fps

        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    // ============================================
    // ACCESSIBILITY ENHANCEMENTS
    // ============================================
    
    function setupAccessibility() {
        // Handle keyboard navigation for custom interactive elements
        document.addEventListener('keydown', (e) => {
            // Escape key to close any open modals/overlays
            if (e.key === 'Escape') {
                if (elements.videoOverlay && !elements.videoOverlay.classList.contains('hidden')) {
                    // Video overlay is already visible, do nothing
                }
            }
        });

        // Ensure all interactive elements are focusable
        const interactiveElements = document.querySelectorAll('a, button, [tabindex]');
        interactiveElements.forEach(el => {
            // Add focus-visible polyfill if needed
            if (!el.classList.contains('focus-visible-polyfill')) {
                el.classList.add('focus-visible-polyfill');
            }
        });
    }

    // ============================================
    // PERFORMANCE MONITORING (Development)
    // ============================================
    
    function setupPerformanceMonitoring() {
        // Only in development
        if (process && process.env && process.env.NODE_ENV !== 'development') {
            return;
        }

        // Log performance metrics
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                const timing = window.performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
            });
        }
    }

    // ============================================
    // ANIMATION FALLBACKS
    // ============================================
    
    function setupAnimationFallbacks() {
        // Check if browser supports IntersectionObserver
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements immediately
            elements.revealElements.forEach(el => el.classList.add('visible'));
            elements.fadeInElements.forEach(el => el.classList.add('visible'));
        }

        // Check for reduced motion preference
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (mediaQuery.matches) {
            // Disable all animations
            elements.revealElements.forEach(el => {
                el.style.transition = 'none';
                el.classList.add('visible');
            });
        }
    }

    // ============================================
    // INITIALIZE WHEN DOM IS READY
    // ============================================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also run fallbacks immediately
    setupAnimationFallbacks();
    setupAccessibility();

})();

// ============================================
// GLOBAL ERROR HANDLING
// ============================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Don't let errors break the user experience
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Don't let unhandled rejections break the user experience
});

// ============================================
// EXTERNAL API (for potential future use)
// ============================================

// Expose minimal API for debugging if needed
window.TirenifyPitch = {
    // Replay loader animation
    replayLoader: function() {
        const loader = document.getElementById('loader');
        const mainContent = document.getElementById('main-content');
        
        if (loader && mainContent) {
            loader.classList.remove('hidden');
            mainContent.classList.add('hidden');
            
            setTimeout(() => {
                loader.classList.add('hidden');
                mainContent.classList.remove('hidden');
            }, 3000);
        }
    },
    
    // Trigger reveal for specific element
    reveal: function(selector) {
        const el = document.querySelector(selector);
        if (el) {
            el.classList.add('visible');
        }
    },
    
    // Get current scroll position as percentage
    getScrollProgress: function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    }
};