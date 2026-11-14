/**
 * FOCUS LAB × TAFRA OS — Aurora WebGL Shader Engine
 * Renders an ethereal, fluid aurora borealis background behind the Hero section.
 * Responsive, hardware-accelerated with Canvas 2D fallback.
 */

(function () {
    'use strict';

    const VERTEX_SHADER_SRC = `
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    const FRAGMENT_SHADER_SRC = `
        precision highp float;

        uniform float u_time;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;

        vec3 hash3(vec2 p) {
            vec3 q = vec3(dot(p, vec2(127.1, 311.7)), 
                          dot(p, vec2(269.5, 183.3)), 
                          dot(p, vec2(419.2, 371.9)));
            return fract(sin(q) * 43758.5453);
        }

        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(dot(hash3(i + vec2(0.0, 0.0)).xy, f - vec2(0.0, 0.0)),
                           dot(hash3(i + vec2(1.0, 0.0)).xy, f - vec2(1.0, 0.0)), u.x),
                       mix(dot(hash3(i + vec2(0.0, 1.0)).xy, f - vec2(0.0, 1.0)),
                           dot(hash3(i + vec2(1.0, 1.0)).xy, f - vec2(1.0, 1.0)), u.x), u.y);
        }

        float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.55;
            mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
            for (int i = 0; i < 4; i++) {
                v += a * noise(p);
                p = rot * p * 2.1 + vec2(u_time * 0.04, -u_time * 0.03);
                a *= 0.48;
            }
            return v;
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

            vec2 mouseOffset = (u_mouse - 0.5) * 0.25;
            p += mouseOffset;

            float t = u_time * 0.35;

            // Aurora Ribbon 1 (Emerald / Mint)
            float wave1 = sin(p.x * 2.8 + t * 0.8) * 0.25 + cos(p.x * 5.2 - t * 0.5) * 0.12;
            float dist1 = abs(p.y - wave1 + 0.1);
            float glow1 = 0.045 / (dist1 + 0.035);
            glow1 *= smoothstep(1.5, 0.1, abs(p.x));
            vec3 col1 = vec3(0.0, 0.95, 0.65) * glow1 * 0.85;

            // Aurora Ribbon 2 (Cyan / Azure)
            float wave2 = cos(p.x * 2.1 - t * 0.6) * 0.32 + sin(p.x * 4.3 + t * 0.7) * 0.14;
            float dist2 = abs(p.y - wave2 - 0.08);
            float glow2 = 0.04 / (dist2 + 0.04);
            glow2 *= smoothstep(1.4, 0.15, abs(p.x));
            vec3 col2 = vec3(0.0, 0.65, 1.0) * glow2 * 0.75;

            // Aurora Ribbon 3 (Violet / Neon Purple)
            float wave3 = sin(p.x * 1.9 + t * 0.4) * 0.28 + cos(p.x * 3.7 - t * 0.45) * 0.18;
            float dist3 = abs(p.y - wave3 + 0.22);
            float glow3 = 0.05 / (dist3 + 0.05);
            glow3 *= smoothstep(1.3, 0.2, abs(p.x));
            vec3 col3 = vec3(0.65, 0.15, 0.95) * glow3 * 0.65;

            // Aurora Ribbon 4 (Gold / Solar Amber)
            float wave4 = cos(p.x * 3.4 + t * 0.9) * 0.15;
            float dist4 = abs(p.y - wave4 - 0.2);
            float glow4 = 0.03 / (dist4 + 0.06);
            vec3 col4 = vec3(1.0, 0.75, 0.2) * glow4 * 0.45;

            // Volumetric FBM clouds
            float clouds = fbm(p * 2.2 + vec2(t * 0.1, -t * 0.15));
            vec3 cloudCol = vec3(0.02, 0.08, 0.15) * clouds;

            // Cosmic Star Dust
            vec2 starGrid = fract(p * 18.0) - 0.5;
            float starHash = hash3(floor(p * 18.0)).x;
            float star = step(0.975, starHash) * (1.0 - length(starGrid) * 2.5);
            star = max(0.0, star) * (0.4 + 0.6 * sin(u_time * 2.5 + starHash * 6.28));

            vec3 baseColor = vec3(0.02, 0.03, 0.07);
            vec3 finalColor = baseColor + cloudCol + col1 + col2 + col3 + col4 + vec3(star * 0.6);

            // Vignette edge falloff
            float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
            finalColor *= clamp(14.0 * vignette, 0.2, 1.0);

            gl_FragColor = vec4(finalColor, 0.88);
        }
    `;

    class HeroShaderEngine {
        constructor() {
            this.canvas = null;
            this.gl = null;
            this.program = null;
            this.startTime = Date.now();
            this.mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
            this.animId = null;
            this.isVisible = true;

            this.init();
        }

        init() {
            const heroSection = document.querySelector('.studio-hero-section') || document.querySelector('.hero-section') || document.querySelector('header');
            if (!heroSection) return;

            // Look for existing canvas or create one
            this.canvas = document.getElementById('heroAuroraCanvas');
            if (!this.canvas) {
                this.canvas = document.createElement('canvas');
                this.canvas.id = 'heroAuroraCanvas';
                this.canvas.className = 'hero-aurora-canvas';
                heroSection.insertBefore(this.canvas, heroSection.firstChild);
            }

            this.setupWebGL();
            this.bindEvents();
            this.onResize();
            this.startLoop();
        }

        setupWebGL() {
            try {
                this.gl = this.canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'high-performance' }) ||
                          this.canvas.getContext('experimental-webgl');
            } catch (e) {
                this.gl = null;
            }

            if (!this.gl) {
                this.setup2DFallback();
                return;
            }

            const gl = this.gl;
            const vs = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
            const fs = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);

            if (!vs || !fs) {
                this.setup2DFallback();
                return;
            }

            this.program = gl.createProgram();
            gl.attachShader(this.program, vs);
            gl.attachShader(this.program, fs);
            gl.linkProgram(this.program);

            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                console.warn('Aurora shader link failed:', gl.getProgramInfoLog(this.program));
                this.setup2DFallback();
                return;
            }

            // Quad buffer covering clipspace [-1, 1]
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array([
                    -1.0, -1.0,
                     1.0, -1.0,
                    -1.0,  1.0,
                    -1.0,  1.0,
                     1.0, -1.0,
                     1.0,  1.0
                ]),
                gl.STATIC_DRAW
            );

            this.posAttrib = gl.getAttribLocation(this.program, 'position');
            gl.enableVertexAttribArray(this.posAttrib);
            gl.vertexAttribPointer(this.posAttrib, 2, gl.FLOAT, false, 0, 0);

            this.uTimeLoc = gl.getUniformLocation(this.program, 'u_time');
            this.uResLoc = gl.getUniformLocation(this.program, 'u_resolution');
            this.uMouseLoc = gl.getUniformLocation(this.program, 'u_mouse');
        }

        compileShader(type, src) {
            const gl = this.gl;
            const shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.warn('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        setup2DFallback() {
            this.is2D = true;
            this.ctx = this.canvas.getContext('2d');
        }

        bindEvents() {
            window.addEventListener('resize', () => this.onResize(), { passive: true });

            const hero = this.canvas.parentElement;
            if (hero) {
                hero.addEventListener('mousemove', (e) => {
                    const rect = hero.getBoundingClientRect();
                    this.mouse.targetX = (e.clientX - rect.left) / rect.width;
                    this.mouse.targetY = 1.0 - (e.clientY - rect.top) / rect.height;
                }, { passive: true });
            }

            // Pause off-screen to save battery & GPU
            if ('IntersectionObserver' in window && hero) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        this.isVisible = entry.isIntersecting;
                    });
                }, { threshold: 0.05 });
                observer.observe(hero);
            }
        }

        onResize() {
            if (!this.canvas) return;
            const hero = this.canvas.parentElement;
            const width = hero ? hero.clientWidth : window.innerWidth;
            const height = hero ? hero.clientHeight : (window.innerHeight * 0.7);

            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            this.canvas.width = Math.max(320, Math.floor(width * dpr));
            this.canvas.height = Math.max(240, Math.floor(height * dpr));

            if (this.gl) {
                this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            }
        }

        startLoop() {
            const render = () => {
                if (this.isVisible) {
                    // Smooth mouse interpolation
                    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
                    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

                    const elapsed = (Date.now() - this.startTime) * 0.001;

                    if (this.gl && this.program) {
                        const gl = this.gl;
                        gl.useProgram(this.program);
                        gl.uniform1f(this.uTimeLoc, elapsed);
                        gl.uniform2f(this.uResLoc, this.canvas.width, this.canvas.height);
                        gl.uniform2f(this.uMouseLoc, this.mouse.x, this.mouse.y);
                        gl.drawArrays(gl.TRIANGLES, 0, 6);
                    } else if (this.is2D && this.ctx) {
                        this.render2DFallback(elapsed);
                    }
                }
                this.animId = requestAnimationFrame(render);
            };
            this.animId = requestAnimationFrame(render);
        }

        render2DFallback(time) {
            const ctx = this.ctx;
            const w = this.canvas.width;
            const h = this.canvas.height;

            ctx.clearRect(0, 0, w, h);
            const grad = ctx.createLinearGradient(0, 0, w, h);
            const shift1 = Math.sin(time * 0.6) * 0.15;
            const shift2 = Math.cos(time * 0.8) * 0.15;

            grad.addColorStop(0, '#040714');
            grad.addColorStop(0.35 + shift1, 'rgba(0, 255, 170, 0.18)');
            grad.addColorStop(0.65 + shift2, 'rgba(110, 50, 240, 0.22)');
            grad.addColorStop(1, '#050711');

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        }
    }

    // Expose engine instance on window
    window.HeroShaderEngine = HeroShaderEngine;

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.heroShader = new HeroShaderEngine();
        });
    } else {
        window.heroShader = new HeroShaderEngine();
    }
})();
