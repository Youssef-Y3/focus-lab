/**
 * FOCUS LAB × TAFRA OS — Floating Radial Navigation Engine
 * Transforms the platform navigation into a fluid, glass-morphic circular HUD.
 * Uses trigonometric fan-out distribution, spring physics, and audio feedback.
 */

(function () {
    'use strict';

    class RadialNavigation {
        constructor() {
            this.nav = document.getElementById('sidebar');
            this.trigger = null;
            this.menuItemsContainer = null;
            this.buttons = [];
            this.isOpen = false;
            this.radius = 135; // Default radius in px

            this.init();
        }

        init() {
            if (!this.nav) return;

            this.trigger = document.getElementById('radialToggleBtn') || this.createTrigger();
            this.menuItemsContainer = document.getElementById('radialMenuItems') || this.nav.querySelector('.radial-menu-items');
            this.buttons = Array.from(this.nav.querySelectorAll('.radial-btn, .primary-nav .nav-item'));

            this.setupPositions();
            this.bindEvents();
            this.syncActiveState();
        }

        createTrigger() {
            let btn = document.getElementById('radialToggleBtn');
            if (!btn) {
                btn = document.createElement('button');
                btn.id = 'radialToggleBtn';
                btn.className = 'radial-center-trigger';
                btn.setAttribute('aria-label', 'فتح / إغلاق القائمة الدائرية');
                btn.setAttribute('title', 'ملاحة سريعة (Radial HUD)');
                btn.innerHTML = `
                    <div class="radial-pulse-ring"></div>
                    <div class="radial-core-glow"></div>
                    <span class="radial-trigger-icon">
                        <svg class="feather-icon trigger-open"><use xlink:href="#icon-compass"/></svg>
                        <svg class="feather-icon trigger-close"><use xlink:href="#icon-x"/></svg>
                    </span>
                `;
                this.nav.insertBefore(btn, this.nav.firstChild);
            }
            return btn;
        }

        setupPositions() {
            if (!this.buttons || this.buttons.length === 0) return;

            const count = this.buttons.length;
            // Determine radius based on viewport
            const isMobile = window.innerWidth <= 768;
            const r = isMobile ? 105 : 135;
            this.radius = r;

            // Distribute angles in a full circle starting from top (-90 deg / -pi/2)
            const angleStep = (2 * Math.PI) / count;
            const startAngle = -Math.PI / 2;

            this.buttons.forEach((btn, idx) => {
                const angle = startAngle + idx * angleStep;
                const x = Math.round(r * Math.cos(angle));
                const y = Math.round(r * Math.sin(angle));

                btn.style.setProperty('--tx', `${x}px`);
                btn.style.setProperty('--ty', `${y}px`);
                btn.style.setProperty('--delay', `${idx * 28}ms`);
            });
        }

        bindEvents() {
            if (this.trigger) {
                this.trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggle();
                });
            }

            // Click outside to close
            document.addEventListener('click', (e) => {
                if (this.isOpen && !this.nav.contains(e.target)) {
                    this.close();
                }
            });

            // Escape key closes
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            // Handle button clicks
            this.buttons.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    const page = btn.getAttribute('data-page');
                    if (window.FocusAudio && typeof window.FocusAudio.playClick === 'function') {
                        window.FocusAudio.playClick();
                    }

                    if (page && window.APP && typeof window.APP.openPage === 'function') {
                        window.APP.openPage(page);
                    }

                    // Smooth scroll to target section if applicable
                    const targetSection = document.getElementById(page) || document.querySelector(`[data-page-id="${page}"]`);
                    const scrollContainer = document.getElementById('mainScroll') || window;
                    if (targetSection && scrollContainer) {
                        if (scrollContainer.scrollTo) {
                            scrollContainer.scrollTo({
                                top: targetSection.offsetTop - 70,
                                behavior: 'smooth'
                            });
                        }
                    }

                    // Update active class on radial buttons
                    this.buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Auto-close after short delay
                    setTimeout(() => {
                        this.close();
                    }, 240);
                });
            });

            // Window resize updates positions
            window.addEventListener('resize', () => {
                this.setupPositions();
            }, { passive: true });

            // Listen for external page changes (e.g. topbar or dock clicks)
            document.addEventListener('pageChanged', (e) => {
                if (e.detail && e.detail.page) {
                    this.setActivePage(e.detail.page);
                }
            });
        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            this.isOpen = true;
            this.nav.classList.add('open');
            this.nav.classList.add('radial-active');
            if (this.trigger) {
                this.trigger.classList.add('active');
            }

            if (window.FocusAudio && typeof window.FocusAudio.playWhoosh === 'function') {
                window.FocusAudio.playWhoosh();
            }
        }

        close() {
            this.isOpen = false;
            this.nav.classList.remove('open');
            this.nav.classList.remove('radial-active');
            if (this.trigger) {
                this.trigger.classList.remove('active');
            }
        }

        setActivePage(pageName) {
            this.buttons.forEach((btn) => {
                if (btn.getAttribute('data-page') === pageName) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }

        syncActiveState() {
            const activeNav = document.querySelector('.nav-item.active');
            if (activeNav) {
                const page = activeNav.getAttribute('data-page');
                if (page) this.setActivePage(page);
            }
        }
    }

    // Expose instance on window
    window.RadialNavigation = RadialNavigation;

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.radialNav = new RadialNavigation();
        });
    } else {
        window.radialNav = new RadialNavigation();
    }
})();
