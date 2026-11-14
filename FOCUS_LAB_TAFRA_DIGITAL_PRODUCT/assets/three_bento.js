/**
 * FOCUS LAB × TAFRA OS — Three.js Spatial 3D Bento Showcase
 * Transforms the platform's Bento grid into interactive 3D cubes.
 * Features dynamic canvas textures, mouse raycasting, spring rotation,
 * and modal expansion for deep interaction.
 */

(function () {
    'use strict';

    const BENTO_CARDS_DATA = [
        {
            id: 'audio',
            tag: '[ 40Hz ACOUSTIC LAB ]',
            title: 'موجات جاما وعزل المشتتات',
            desc: 'توليد ترددات بيولوجية 40Hz ومؤثرات صوتية مطرية لتهدئة القشرة الدماغية وزيادة استيعاب المعلومات.',
            badge: '100% WebAudio توليد لحظي',
            color: '#00ffcc',
            secondaryColor: '#0a2a22',
            icon: '🎧',
            actionText: '🎧 تشغيل الصوت الحي',
            actionType: 'audio'
        },
        {
            id: 'sos',
            tag: '[ 120s SOS RESCUE ]',
            title: 'طوارئ كسر التسويف',
            desc: 'بروتوكول الطوارئ السريع لفك الشلل الذهني والبدء في المذاكرة أو العمل خلال دقيقتين فقط.',
            badge: 'معدل استعادة التركيز: 85%',
            color: '#ff0077',
            secondaryColor: '#2b0a1a',
            icon: '🚨',
            actionText: '⚡ تفعيل بروتوكول الإنقاذ',
            actionType: 'sos'
        },
        {
            id: 'recall',
            tag: '[ ACTIVE RECALL 3D ]',
            title: 'بطاقات الاسترجاع الذكي 3D',
            desc: 'تثبيت المفاهيم بالقوة العصبية عبر تقنية الاسترجاع الذاتي بدلاً من وهم القراءة السلبية.',
            badge: '+50 XP لكل جولة استرجاع',
            color: '#9d4edd',
            secondaryColor: '#1e0c33',
            icon: '🧠',
            actionText: 'تدريب البطاقات الكامل ↗',
            actionType: 'student'
        },
        {
            id: 'journey',
            tag: '[ 28-DAY ARCHITECTURE ]',
            title: 'بناء نظام التركيز المستمر',
            desc: 'خارطة يومية تدرجية تنقلك من التشتت إلى الانضباط الصارم خطوة بخطوة على مدار 4 أسابيع.',
            badge: 'اليوم النشط: 03 / 28',
            color: '#ffaa00',
            secondaryColor: '#33200a',
            icon: '🔥',
            actionText: 'متابعة الرحلة اليومية ↗',
            actionType: 'journey'
        }
    ];

    class ThreeBentoScene {
        constructor() {
            this.container = document.getElementById('threeBentoContainer');
            this.canvas = document.getElementById('threeBentoCanvas');
            this.scene = null;
            this.camera = null;
            this.renderer = null;
            this.cubes = [];
            this.raycaster = null;
            this.mouse = { x: 0, y: 0, normalizedX: 0, normalizedY: 0 };
            this.hoveredCube = null;
            this.animId = null;
            this.startTime = Date.now();
            this.activeView = '3d'; // '3d' or 'grid'

            this.init();
        }

        init() {
            if (!this.container || !this.canvas) {
                // If container not present in DOM yet, try to inject before bento grid
                const bentoGrid = document.querySelector('.bento-showcase-grid');
                if (!bentoGrid) return;

                const wrapper = document.createElement('div');
                wrapper.className = 'three-bento-container';
                wrapper.id = 'threeBentoContainer';

                this.canvas = document.createElement('canvas');
                this.canvas.id = 'threeBentoCanvas';
                this.canvas.className = 'three-bento-canvas';
                wrapper.appendChild(this.canvas);

                bentoGrid.parentNode.insertBefore(wrapper, bentoGrid);
                this.container = wrapper;
            }

            if (typeof THREE === 'undefined') {
                console.warn('Three.js library not loaded yet for ThreeBentoScene.');
                return;
            }

            this.setupScene();
            this.createCubes();
            this.setupModal();
            this.bindEvents();
            this.onResize();
            this.startLoop();
        }

        setupScene() {
            this.scene = new THREE.Scene();
            
            const w = this.container.clientWidth || 800;
            const h = this.container.clientHeight || 420;

            this.camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 1000);
            this.camera.position.set(0, 0, 7.2);

            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                alpha: true,
                antialias: true
            });
            this.renderer.setSize(w, h);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

            this.raycaster = new THREE.Raycaster();
        }

        createTexture(card) {
            const size = 512;
            const cvs = document.createElement('canvas');
            cvs.width = size;
            cvs.height = size;
            const ctx = cvs.getContext('2d');

            // Dark glass background
            const bgGrad = ctx.createLinearGradient(0, 0, size, size);
            bgGrad.addColorStop(0, '#0c1020');
            bgGrad.addColorStop(1, card.secondaryColor);
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, size, size);

            // Glowing border
            ctx.strokeStyle = card.color;
            ctx.lineWidth = 14;
            ctx.strokeRect(10, 10, size - 20, size - 20);

            // Inner subtle grid lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
            ctx.lineWidth = 1;
            for (let i = 40; i < size; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0); ctx.lineTo(i, size);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i); ctx.lineTo(size, i);
                ctx.stroke();
            }

            // Top tag pill
            ctx.fillStyle = card.color;
            ctx.font = 'bold 22px monospace';
            ctx.textAlign = 'right';
            ctx.fillText(card.tag, size - 36, 60);

            // Icon
            ctx.font = '54px serif';
            ctx.textAlign = 'left';
            ctx.fillText(card.icon, 36, 75);

            // Arabic Title
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 34px "Alexandria", system-ui, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(card.title, size - 36, 170);

            // Arabic Description (2 lines)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.font = '22px system-ui, sans-serif';
            const words = card.desc.split(' ');
            let line1 = words.slice(0, 7).join(' ');
            let line2 = words.slice(7, 14).join(' ');
            let line3 = words.slice(14).join(' ');
            ctx.fillText(line1, size - 36, 230);
            ctx.fillText(line2, size - 36, 265);
            if (line3) ctx.fillText(line3 + '...', size - 36, 300);

            // Badge Pill
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(36, 350, size - 72, 48, 12) : ctx.rect(36, 350, size - 72, 48);
            ctx.fill();

            ctx.fillStyle = card.color;
            ctx.font = 'bold 20px "Alexandria", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚡ ' + card.badge, size / 2, 382);

            // Action prompt
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px "Alexandria", sans-serif';
            ctx.fillText('اضغط للتكبير والتفاعل ↗', size / 2, 465);

            return new THREE.CanvasTexture(cvs);
        }

        createCubes() {
            const isMobile = window.innerWidth <= 768;
            const geo = new THREE.BoxGeometry(2.1, 1.4, 0.55);

            const positions = isMobile
                ? [
                    { x: 0, y: 1.8, z: 0 },
                    { x: 0, y: 0.6, z: 0 },
                    { x: 0, y: -0.6, z: 0 },
                    { x: 0, y: -1.8, z: 0 }
                ]
                : [
                    { x: -1.45, y: 0.85, z: 0 },
                    { x: 1.45, y: 0.85, z: 0 },
                    { x: -1.45, y: -0.85, z: 0 },
                    { x: 1.45, y: -0.85, z: 0 }
                ];

            BENTO_CARDS_DATA.forEach((card, idx) => {
                const texture = this.createTexture(card);
                const mat = new THREE.MeshBasicMaterial({
                    color: new THREE.Color(card.color),
                    map: texture,
                    transparent: true,
                    opacity: 0.94
                });

                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(positions[idx].x, positions[idx].y, positions[idx].z);
                mesh.userData = {
                    cardData: card,
                    baseX: positions[idx].x,
                    baseY: positions[idx].y,
                    baseZ: positions[idx].z,
                    hovered: false,
                    targetScale: 1.0,
                    targetRotX: 0.12,
                    targetRotY: (idx % 2 === 0 ? -0.15 : 0.15)
                };

                mesh.rotation.x = mesh.userData.targetRotX;
                mesh.rotation.y = mesh.userData.targetRotY;

                this.cubes.push(mesh);
                this.scene.add(mesh);
            });
        }

        setupModal() {
            let modal = document.getElementById('bentoExpandedModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'bentoExpandedModal';
                modal.className = 'bento-expanded-modal';
                modal.innerHTML = `
                    <div class="bento-modal-backdrop" id="bentoModalBackdrop"></div>
                    <div class="bento-modal-panel glass-morph">
                        <button class="bento-modal-close" id="bentoModalCloseBtn" aria-label="إغلاق">✕</button>
                        <div class="bento-modal-content" id="bentoModalContent"></div>
                    </div>
                `;
                document.body.appendChild(modal);

                document.getElementById('bentoModalBackdrop').addEventListener('click', () => this.closeModal());
                document.getElementById('bentoModalCloseBtn').addEventListener('click', () => this.closeModal());
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && modal.classList.contains('active')) {
                        this.closeModal();
                    }
                });
            }
        }

        openModal(card) {
            const modal = document.getElementById('bentoExpandedModal');
            const content = document.getElementById('bentoModalContent');
            if (!modal || !content) return;

            let extraHTML = '';
            if (card.actionType === 'audio') {
                extraHTML = `
                    <div class="modal-interactive-zone">
                        <div class="modal-audio-equalizer">
                            <span></span><span></span><span></span><span></span><span></span>
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                        <button class="btn-bento-action" id="modalAudioBtn" style="font-size:16px; padding:12px 28px; margin-top:16px;">
                            ${card.actionText}
                        </button>
                    </div>
                `;
            } else if (card.actionType === 'sos') {
                extraHTML = `
                    <div class="modal-interactive-zone">
                        <div class="sos-steps-preview" style="text-align:right; font-size:14px; line-height:2; margin:14px 0;">
                            <div>1. 🫁 تنفس عميق 4-7-8 وتصفير القلق</div>
                            <div>2. ⏱️ مؤقت 120 ثانية فقط بلا أي التزام إضافي</div>
                            <div>3. ✍️ كتابة أصغر خطوة حركية ممكنة</div>
                            <div>4. 🚀 الانطلاق اللحظي دون تفاوض</div>
                        </div>
                        <button class="btn-bento-action sos-btn" id="modalSosBtn" style="font-size:16px; padding:12px 28px;">
                            ${card.actionText}
                        </button>
                    </div>
                `;
            } else if (card.actionType === 'student') {
                extraHTML = `
                    <div class="modal-interactive-zone">
                        <p style="color:var(--text-dim); margin-bottom:14px;">نظام التكرار المتباعد والبطاقات المعرفية الموجهة لامتحانات الجامعة.</p>
                        <button class="btn-bento-action" id="modalStudentBtn" data-go="student" style="font-size:16px; padding:12px 28px;">
                            ${card.actionText}
                        </button>
                    </div>
                `;
            } else if (card.actionType === 'journey') {
                extraHTML = `
                    <div class="modal-interactive-zone">
                        <div class="bento-week-pills" style="margin: 16px 0;">
                            <span class="week-pill done">الأسبوع 1: التطهير ✓</span>
                            <span class="week-pill current">الأسبوع 2: البناء ●</span>
                            <span class="week-pill">الأسبوع 3: التكثيف</span>
                            <span class="week-pill">الأسبوع 4: الماستري</span>
                        </div>
                        <button class="btn-bento-action" id="modalJourneyBtn" data-go="journey" style="font-size:16px; padding:12px 28px;">
                            ${card.actionText}
                        </button>
                    </div>
                `;
            }

            content.innerHTML = `
                <div class="modal-card-header">
                    <span class="bento-tag" style="border-color:${card.color}; color:${card.color};">${card.tag}</span>
                    <span style="font-size:28px;">${card.icon}</span>
                </div>
                <h2 style="font-family:'Alexandria', sans-serif; font-size:24px; margin: 12px 0; color:#fff;">${card.title}</h2>
                <p style="font-size:16px; line-height:1.7; color:var(--text-sub);">${card.desc}</p>
                <div class="bento-meta-txt" style="display:inline-block; margin: 12px 0; padding:6px 14px; background:rgba(255,255,255,0.06); border-radius:20px; color:${card.color}; font-weight:700;">
                    ${card.badge}
                </div>
                ${extraHTML}
            `;

            // Wire up interactive action in modal
            const audioBtn = document.getElementById('modalAudioBtn');
            if (audioBtn) {
                audioBtn.addEventListener('click', () => {
                    const originalBtn = document.getElementById('bentoAudioToggleBtn');
                    if (originalBtn) originalBtn.click();
                    this.closeModal();
                });
            }

            const sosBtn = document.getElementById('modalSosBtn');
            if (sosBtn) {
                sosBtn.addEventListener('click', () => {
                    const originalBtn = document.getElementById('bentoSosLaunchBtn');
                    if (originalBtn) originalBtn.click();
                    this.closeModal();
                });
            }

            const studentBtn = document.getElementById('modalStudentBtn');
            if (studentBtn) {
                studentBtn.addEventListener('click', () => {
                    if (window.APP && window.APP.openPage) window.APP.openPage('student');
                    this.closeModal();
                });
            }

            const journeyBtn = document.getElementById('modalJourneyBtn');
            if (journeyBtn) {
                journeyBtn.addEventListener('click', () => {
                    if (window.APP && window.APP.openPage) window.APP.openPage('journey');
                    this.closeModal();
                });
            }

            modal.classList.add('active');
            if (window.FocusAudio && window.FocusAudio.playWhoosh) {
                window.FocusAudio.playWhoosh();
            }
        }

        closeModal() {
            const modal = document.getElementById('bentoExpandedModal');
            if (modal) {
                modal.classList.remove('active');
            }
        }

        bindEvents() {
            window.addEventListener('resize', () => this.onResize(), { passive: true });

            this.canvas.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
                this.mouse.normalizedX = (this.mouse.x / rect.width) * 2 - 1;
                this.mouse.normalizedY = -(this.mouse.y / rect.height) * 2 + 1;

                this.checkRaycast();
            }, { passive: true });

            this.canvas.addEventListener('mouseleave', () => {
                this.cubes.forEach(c => {
                    c.userData.hovered = false;
                    c.userData.targetScale = 1.0;
                });
                this.hoveredCube = null;
                this.canvas.style.cursor = 'default';
            });

            this.canvas.addEventListener('click', () => {
                if (this.hoveredCube) {
                    if (window.FocusAudio && window.FocusAudio.playClick) {
                        window.FocusAudio.playClick();
                    }
                    this.openModal(this.hoveredCube.userData.cardData);
                }
            });

            // Toggle view mode buttons
            const mode3DBtn = document.getElementById('bentoMode3D');
            const modeGridBtn = document.getElementById('bentoModeGrid');
            const gridView = document.querySelector('.bento-showcase-grid');

            if (mode3DBtn && modeGridBtn && gridView) {
                mode3DBtn.addEventListener('click', () => {
                    this.activeView = '3d';
                    mode3DBtn.classList.add('active');
                    modeGridBtn.classList.remove('active');
                    this.container.style.display = 'block';
                    gridView.style.display = 'none';
                    this.onResize();
                });

                modeGridBtn.addEventListener('click', () => {
                    this.activeView = 'grid';
                    modeGridBtn.classList.add('active');
                    mode3DBtn.classList.remove('active');
                    this.container.style.display = 'none';
                    gridView.style.display = 'grid';
                });
            }
        }

        checkRaycast() {
            if (!this.camera || !this.raycaster) return;

            this.raycaster.setFromCamera(
                new THREE.Vector2(this.mouse.normalizedX, this.mouse.normalizedY),
                this.camera
            );

            const intersects = this.raycaster.intersectObjects(this.cubes);
            if (intersects.length > 0) {
                const hit = intersects[0].object;
                if (this.hoveredCube !== hit) {
                    this.hoveredCube = hit;
                    this.cubes.forEach(c => {
                        c.userData.hovered = (c === hit);
                        c.userData.targetScale = (c === hit ? 1.14 : 0.96);
                    });
                    this.canvas.style.cursor = 'pointer';
                }
            } else {
                if (this.hoveredCube) {
                    this.cubes.forEach(c => {
                        c.userData.hovered = false;
                        c.userData.targetScale = 1.0;
                    });
                    this.hoveredCube = null;
                    this.canvas.style.cursor = 'default';
                }
            }
        }

        onResize() {
            if (!this.container || !this.canvas || !this.renderer || !this.camera) return;

            const w = this.container.clientWidth || 800;
            const h = Math.max(340, Math.min(520, Math.floor(window.innerHeight * 0.45)));

            this.canvas.width = w;
            this.canvas.height = h;

            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        }

        startLoop() {
            const render = () => {
                if (this.activeView === '3d') {
                    const elapsed = (Date.now() - this.startTime) * 0.001;

                    this.cubes.forEach((cube, i) => {
                        // Gentle sinusoidal hovering
                        const hoverOffset = Math.sin(elapsed * 1.8 + i * 1.5) * 0.08;
                        cube.position.y = cube.userData.baseY + hoverOffset;

                        // Smooth spring scale
                        const s = cube.scale.x;
                        const targetS = cube.userData.targetScale;
                        const newS = s + (targetS - s) * 0.12;
                        cube.scale.set(newS, newS, newS);

                        // Tilting towards mouse
                        const mouseTiltX = this.mouse.normalizedY * 0.25;
                        const mouseTiltY = this.mouse.normalizedX * 0.25;

                        if (cube.userData.hovered) {
                            cube.rotation.x += (cube.userData.targetRotX + mouseTiltX - cube.rotation.x) * 0.15;
                            cube.rotation.y += (cube.userData.targetRotY + mouseTiltY - cube.rotation.y) * 0.15;
                        } else {
                            cube.rotation.x += (cube.userData.targetRotX + Math.sin(elapsed + i) * 0.04 - cube.rotation.x) * 0.08;
                            cube.rotation.y += (cube.userData.targetRotY + Math.cos(elapsed + i) * 0.04 - cube.rotation.y) * 0.08;
                        }
                    });

                    this.renderer.render(this.scene, this.camera);
                }
                this.animId = requestAnimationFrame(render);
            };
            this.animId = requestAnimationFrame(render);
        }
    }

    // Expose instance on window
    window.ThreeBentoScene = ThreeBentoScene;

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.threeBento = new ThreeBentoScene();
        });
    } else {
        window.threeBento = new ThreeBentoScene();
    }
})();
