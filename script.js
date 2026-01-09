// ============================================
// PREMIUM REFINEMENTS (2025 UI POLISH)
// - Enhanced glass navbar + active link glow
// - Hero text staggered entrance + softer parallax
// - Calibrated scroll / card animations for smoother rhythm
// ============================================
// SCROLL TO TOP ON PAGE LOAD/REFRESH
// ============================================

// Scroll to top immediately on page load/refresh
window.scrollTo(0, 0);

// Also ensure scroll position is reset after page fully loads
window.addEventListener('load', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
});

// Additional check on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
});

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect - dark until past hero, then light
window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    const heroHeight = hero ? hero.offsetHeight : 0;
    const scrollY = window.scrollY;
    
    navbar.classList.toggle('scrolled', scrollY > 50);
    
    // Transition to light theme only after scrolling past hero
    if (scrollY > heroHeight - 100) {
        navbar.classList.add('light-theme');
    } else {
        navbar.classList.remove('light-theme');
    }
});

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scroll
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;

        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// ============================================
// INTERSECTION OBSERVER – FADE IN
// ============================================

const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.addEventListener('DOMContentLoaded', () => {
    const fadeEls = Array.from(document.querySelectorAll('.fade-in-up'));

    fadeEls.forEach((el, index) => {
        const delay = (index % 6) * 60; // small, repeating stagger
        el.style.transitionDelay = `${delay}ms`;
        fadeObserver.observe(el);
    });

    // Ensure key cards participate in fade rhythm, even if not pre-marked
    document
        .querySelectorAll('.service-card, .feature-card, .process-step, .stat-item')
        .forEach((el, index) => {
            if (!el.classList.contains('fade-in-up')) {
                el.classList.add('fade-in-up');
            }
            const delay = (index % 4) * 80;
            el.style.transitionDelay = `${delay}ms`;
        });

    // Animate feature icons on card reveal
    const iconObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                iconObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.feature-icon').forEach((icon, index) => {
        icon.style.transitionDelay = `${index * 80 + 100}ms`;
        iconObserver.observe(icon);
    });
});

// ============================================
// SECTION REVEAL & ACTIVE FOCUS
// ============================================

let lastActiveSection = null;
let orderedSections = [];

const sectionObserver = new IntersectionObserver(
    entries => {
        if (!orderedSections.length) return;

        // Ensure any intersecting sections reveal in place
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });

        // Find the section with the strongest presence in the viewport
        let bestSection = null;
        let bestRatio = 0;

        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const index = orderedSections.indexOf(entry.target);
            if (index === -1) return;
            if (entry.intersectionRatio > bestRatio) {
                bestRatio = entry.intersectionRatio;
                bestSection = entry.target;
            }
        });

        if (!bestSection || bestSection === lastActiveSection) return;

        lastActiveSection = bestSection;

        orderedSections.forEach((section, index) => {
            section.classList.add('section-reveal');
            section.classList.remove('section-active', 'section-muted', 'section-adjacent');

            const isActive = section === bestSection;
            const prev = orderedSections[index - 1];
            const next = orderedSections[index + 1];
            const isAdjacent = prev === bestSection || next === bestSection;

            if (isActive) {
                section.classList.add('section-active');
            } else if (isAdjacent) {
                section.classList.add('section-adjacent');
            } else {
                section.classList.add('section-muted');
            }
        });
    },
    {
        threshold: [0.25, 0.5, 0.75],
        rootMargin: '-12% 0px -12% 0px'
    }
);

document.addEventListener('DOMContentLoaded', () => {
    // Focus rhythm only for the main narrative sections
    orderedSections = Array.from(
        document.querySelectorAll('#about, #services, #why-us, #process, #contact')
    );

    orderedSections.forEach(section => {
        section.classList.add('section-reveal');
        sectionObserver.observe(section);
    });
});

// ============================================
// PROCESS TIMELINE – ACTIVE STEP PROGRESSION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const processSection = document.getElementById('process');
    if (!processSection) return;

    const timeline = processSection.querySelector('.process-timeline');
    if (!timeline) return;

    const steps = Array.from(processSection.querySelectorAll('.process-step'));
    if (!steps.length) return;

    let activeIndex = -1;
    let highestPassedIndex = -1;

    const updateTimelineProgress = () => {
        const progress = highestPassedIndex >= 0 
            ? Math.min((highestPassedIndex + 1) / steps.length, 1)
            : 0;
        timeline.style.setProperty('--timeline-progress', String(progress));
    };

    const applyActiveState = index => {
        if (index === activeIndex || index < 0 || index >= steps.length) return;
        
        if (index > highestPassedIndex) {
            highestPassedIndex = index;
            updateTimelineProgress();
        }

        activeIndex = index;

        steps.forEach((step, i) => {
            if (i === activeIndex) {
                step.classList.add('is-active');
                step.classList.remove('is-inactive');
            } else if (i < activeIndex) {
                step.classList.remove('is-active', 'is-inactive');
            } else {
                step.classList.add('is-inactive');
                step.classList.remove('is-active');
            }
        });
    };

    const stepObserver = new IntersectionObserver(
        entries => {
            let bestEntry = null;
            let bestRatio = 0;

            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const index = steps.indexOf(entry.target);
                if (index === -1) return;
                
                if (entry.intersectionRatio > bestRatio) {
                    bestRatio = entry.intersectionRatio;
                    bestEntry = entry;
                }
            });

            if (!bestEntry) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) return;
                    const index = steps.indexOf(entry.target);
                    if (index === -1 || index < 0) return;
                    
                    if (index > highestPassedIndex) {
                        highestPassedIndex = index;
                        updateTimelineProgress();
                    }
                });
                return;
            }

            const index = steps.indexOf(bestEntry.target);
            if (index === -1) return;

            applyActiveState(index);
        },
        {
            threshold: [0.1, 0.25, 0.5, 0.75],
            rootMargin: '-15% 0px -15% 0px'
        }
    );

    steps.forEach(step => stepObserver.observe(step));
    
    updateTimelineProgress();
});

// ============================================
// FINAL COUNT-UP ANIMATION (ABOUT STATS ONLY)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const aboutSection = document.getElementById('about');
    const counters = document.querySelectorAll('.stat-number');

    if (!counters.length || !aboutSection) return;

    // Hide all counters initially - they will appear when section is reached
    counters.forEach(counter => {
        counter.style.opacity = '0';
        counter.style.visibility = 'hidden';
        counter.textContent = '0+';
    });

    let hasAnimated = false;

    const animateCounters = () => {
        if (hasAnimated) return;
        hasAnimated = true;

        counters.forEach(counter => {
            // Show the counter
            counter.style.opacity = '1';
            counter.style.visibility = 'visible';
            counter.style.transition = 'opacity 0.3s ease-in';
            
            const target = parseInt(counter.dataset.target, 10);
            const duration = 1500;
            let start = null;

            const update = time => {
                if (!start) start = time;
                const progress = Math.min((time - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);

                const currentValue = Math.floor(eased * target);
                counter.textContent = currentValue + '+';

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target + '+';
                }
            };

            requestAnimationFrame(update);
        });
    };

    // Observe the about section, not individual counters
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                // Small delay to ensure section is fully visible
                setTimeout(() => {
                    animateCounters();
                }, 100);
                counterObserver.disconnect();
            }
        });
    }, { 
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    // Check if section is already visible on load
    const checkInitialVisibility = () => {
        const rect = aboutSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        if (isVisible && !hasAnimated) {
            setTimeout(() => {
                animateCounters();
            }, 100);
        } else {
            counterObserver.observe(aboutSection);
        }
    };
    
    checkInitialVisibility();
});

// ============================================
// PARALLAX (HERO BACKGROUND)
// ============================================

let ticking = false;

function updateParallax() {
    const heroBg = document.querySelector('.hero-background');
    if (heroBg) {
        // Softer hero drift to keep motion nearly imperceptible
        heroBg.style.transform = `translateY(${window.pageYOffset * 0.12}px)`;
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ============================================
// SERVICE CARD INTERACTIONS
// ============================================

document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// ============================================
// BUTTON MICRO-INTERACTIONS
// ============================================

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.97)');
    btn.addEventListener('mouseup', () => btn.style.transform = '');
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================

function updateActiveNav() {
    const scrollPos = window.pageYOffset + 120;
    document.querySelectorAll('section[id]').forEach(section => {
        const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (!link) return;

        if (
            scrollPos >= section.offsetTop &&
            scrollPos < section.offsetTop + section.offsetHeight
        ) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ============================================
// WHATSAPP FLOAT INTERACTION
// ============================================

const whatsappFloat = document.getElementById('whatsappFloat');

if (whatsappFloat) {
    whatsappFloat.addEventListener('click', () => {
        const ripple = document.createElement('span');
        ripple.className = 'whatsapp-ripple';
        whatsappFloat.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
}

// ============================================
// SCROLL PROGRESS BAR
// ============================================

(function () {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = `${(window.scrollY / h) * 100}%`;
    });
})();

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');

    // Hero staged text entrance (page load only)
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const firstLine = heroContent.querySelector('.hero-title .title-line:nth-child(1)');
        const secondLine = heroContent.querySelector('.hero-title .title-line:nth-child(2)');
        const subtitle = heroContent.querySelector('.hero-subtitle');
        const description = heroContent.querySelector('.hero-description');
        const cta = heroContent.querySelector('.hero-cta');

        const sequence = [
            { el: firstLine, delay: 120 },
            { el: secondLine, delay: 240 },
            { el: subtitle, delay: 360 },
            { el: description, delay: 480 },
            { el: cta, delay: 600 }
        ];

        sequence.forEach(step => {
            if (!step.el) return;
            step.el.classList.add('hero-animate');
            setTimeout(() => {
                step.el.classList.add('hero-visible');
                if (step.el.classList.contains('title-line')) {
                    step.el.style.animation = 'heroLetterSpacing 0.42s ease-out forwards';
                }
            }, step.delay);
        });
    }
});


// ============================================
// CONSOLE BRANDING
// ============================================

console.log('%cTrueLine Technologies', 'font-size:18px;color:#00d4ff;font-weight:bold');
console.log('%cProfessional IT Solutions & Services', 'color:#00ffcc');

// ============================================
// BACK TO TOP BUTTON
// ============================================

const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});