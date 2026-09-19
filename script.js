(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ========================================================
       1. PAPER-SCRAP CONFETTI & BALLOONS
       ======================================================== */
    const canvas = document.getElementById('scrap-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    // Palette-recoloured so the confetti looks like torn paper bits
    const SCRAP_COLORS = ['#E79E73', '#BC5636', '#ADBB92', '#E7CFAC', '#F5C6A3', '#74875B', '#97432A'];
    const BALLOON_COLORS = ['#E79E73', '#BC5636', '#ADBB92', '#F5C6A3', '#E7CFAC'];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    class PaperScrap {
        constructor() {
            this.reset(true);
        }

        reset(initial) {
            this.x = Math.random() * viewW;
            this.y = initial ? Math.random() * viewH : -20;
            this.width = Math.random() * 9 + 5;
            this.height = this.width * (Math.random() * 0.5 + 0.5);
            this.speedY = Math.random() * 0.8 + 0.35;
            this.sway = Math.random() * 0.9 + 0.3;
            this.swaySpeed = Math.random() * 0.02 + 0.008;
            this.phase = Math.random() * Math.PI * 2;
            this.angle = Math.random() * Math.PI * 2;
            this.spin = (Math.random() - 0.5) * 0.035;
            this.alpha = Math.random() * 0.35 + 0.4;
            this.color = pick(SCRAP_COLORS);
        }

        update() {
            this.phase += this.swaySpeed;
            this.y += this.speedY;
            this.x += Math.sin(this.phase) * this.sway;
            this.angle += this.spin;

            // Fade out as it drifts off the bottom
            if (this.y > viewH - 80) {
                this.alpha -= 0.012;
            }
            if (this.y > viewH + 30 || this.alpha <= 0) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(this.alpha, 0);
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

            // Fold highlight so the scrap reads as paper
            ctx.globalAlpha = Math.max(this.alpha, 0) * 0.35;
            ctx.fillStyle = '#FFF8EC';
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height * 0.4);
            ctx.restore();
        }
    }

    class PaperBalloon {
        constructor() {
            this.reset(true);
        }

        reset(initial) {
            this.size = Math.random() * 16 + 20;
            this.x = Math.random() * viewW;
            this.y = initial ? Math.random() * viewH : viewH + this.size * 2;
            this.speedY = -(Math.random() * 1.1 + 0.4);
            this.phase = Math.random() * Math.PI * 2;
            this.phaseSpeed = Math.random() * 0.015 + 0.006;
            this.alpha = Math.random() * 0.3 + 0.45;
            this.color = pick(BALLOON_COLORS);
        }

        update() {
            this.phase += this.phaseSpeed;
            this.y += this.speedY;
            this.x += Math.sin(this.phase) * 0.6;
            if (this.y < -this.size * 3) this.reset(false);
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.translate(this.x, this.y);

            // Body
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 0.72, this.size, 0, 0, Math.PI * 2);
            ctx.fill();

            // Paper sheen
            ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
            ctx.beginPath();
            ctx.ellipse(-this.size * 0.22, -this.size * 0.3,
                this.size * 0.18, this.size * 0.3, -0.35, 0, Math.PI * 2);
            ctx.fill();

            // Knot + string
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(-4, this.size);
            ctx.lineTo(4, this.size);
            ctx.lineTo(0, this.size + 7);
            ctx.closePath();
            ctx.fill();

            ctx.globalAlpha = this.alpha * 0.45;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, this.size + 7);
            for (let i = 6; i <= 42; i += 6) {
                ctx.lineTo(Math.sin(this.phase * 2 + i * 0.12) * 3, this.size + 7 + i);
            }
            ctx.stroke();
            ctx.restore();
        }
    }

    let scraps = [];
    let balloons = [];

    // Logical (CSS pixel) viewport size — the bitmap itself is DPR-scaled,
    // so particles must position against these instead of canvas.width/height.
    let viewW = window.innerWidth;
    let viewH = window.innerHeight;

    function sizeCanvas() {
        if (!canvas) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        viewW = window.innerWidth;
        viewH = window.innerHeight;
        canvas.width = viewW * dpr;
        canvas.height = viewH * dpr;
        canvas.style.width = viewW + 'px';
        canvas.style.height = viewH + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function animate() {
        ctx.clearRect(0, 0, viewW, viewH);
        scraps.forEach(s => { s.update(); s.draw(); });
        balloons.forEach(b => { b.update(); b.draw(); });
        requestAnimationFrame(animate);
    }

    if (canvas && ctx && !prefersReducedMotion) {
        sizeCanvas();

        const scrapCount = window.innerWidth < 700 ? 14 : 26;
        scraps = Array.from({ length: scrapCount }, () => new PaperScrap());
        balloons = Array.from({ length: window.innerWidth < 700 ? 3 : 6 }, () => new PaperBalloon());

        // Rebuild on resize so particles spread across the new width
        let resizeTimer;
        window.addEventListener('resize', () => {
            sizeCanvas();
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                scraps.forEach(s => { s.x = Math.random() * viewW; });
                balloons.forEach(b => { b.x = Math.random() * viewW; });
            }, 250);
        });

        animate();
    }

    /* ========================================================
       2. BIRTHDAY MELODY — Web Audio API
       ======================================================== */
    const musicBtn = document.getElementById('music-toggle');
    const musicLabel = musicBtn ? musicBtn.querySelector('.music-label') : null;

    const NOTE_FREQS = {
        C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
        G4: 392.00, A4: 440.00, Bb4: 466.16, B4: 493.88,
        C5: 523.25
    };

    // "Happy Birthday to You" — note + duration in seconds
    const MELODY = [
        { note: 'C4', dur: 0.4 }, { note: 'C4', dur: 0.2 },
        { note: 'D4', dur: 0.6 }, { note: 'C4', dur: 0.6 },
        { note: 'F4', dur: 0.6 }, { note: 'E4', dur: 1.0 },
        { note: null, dur: 0.3 },

        { note: 'C4', dur: 0.4 }, { note: 'C4', dur: 0.2 },
        { note: 'D4', dur: 0.6 }, { note: 'C4', dur: 0.6 },
        { note: 'G4', dur: 0.6 }, { note: 'F4', dur: 1.0 },
        { note: null, dur: 0.3 },

        { note: 'C4', dur: 0.4 }, { note: 'C4', dur: 0.2 },
        { note: 'C5', dur: 0.6 }, { note: 'A4', dur: 0.6 },
        { note: 'F4', dur: 0.6 }, { note: 'E4', dur: 0.6 },
        { note: 'D4', dur: 0.8 },
        { note: null, dur: 0.3 },

        { note: 'Bb4', dur: 0.4 }, { note: 'Bb4', dur: 0.2 },
        { note: 'A4', dur: 0.6 }, { note: 'F4', dur: 0.6 },
        { note: 'G4', dur: 0.6 }, { note: 'F4', dur: 1.2 }
    ];

    const MELODY_LENGTH = MELODY.reduce((sum, item) => sum + item.dur, 0);

    let audioCtx = null;
    let isPlaying = false;
    let loopTimer = null;

    function playNote(freq, startTime, duration) {
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Soft music-box tone: sine wave + gentle vibrato
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        const vibrato = audioCtx.createOscillator();
        const vibratoGain = audioCtx.createGain();
        vibrato.frequency.setValueAtTime(5, startTime);
        vibratoGain.gain.setValueAtTime(2.5, startTime);
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        vibrato.start(startTime);
        vibrato.stop(startTime + duration);

        // Soft attack / release envelope
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.16, startTime + 0.05);
        gain.gain.setValueAtTime(0.16, startTime + Math.max(duration - 0.08, 0.06));
        gain.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
    }

    function playMelody() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        let t = audioCtx.currentTime + 0.1;
        MELODY.forEach(({ note, dur }) => {
            if (note && NOTE_FREQS[note]) {
                playNote(NOTE_FREQS[note], t, dur * 0.9);
            }
            t += dur;
        });

        loopTimer = setTimeout(() => {
            if (isPlaying) playMelody();
        }, MELODY_LENGTH * 1000 + 600);
    }

    function stopMelody() {
        if (loopTimer) {
            clearTimeout(loopTimer);
            loopTimer = null;
        }
        if (audioCtx) {
            audioCtx.close();
            audioCtx = null;
        }
    }

    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            musicBtn.classList.toggle('playing', isPlaying);
            musicBtn.setAttribute('aria-pressed', String(isPlaying));
            musicBtn.setAttribute('aria-label', isPlaying ? 'Pause birthday music' : 'Play birthday music');
            if (musicLabel) musicLabel.textContent = isPlaying ? 'pause' : 'play';
            isPlaying ? playMelody() : stopMelody();
        });
    }

    /* ========================================================
       3. POLAROIDS — show the photo once it exists
       Empty frames keep a dashed "drop a photo here" placeholder.
       ======================================================== */
    document.querySelectorAll('.polaroid-photo img').forEach(img => {
        const markLoaded = () => img.classList.add('is-loaded');

        if (img.complete && img.naturalWidth > 0) {
            markLoaded();
        } else {
            img.addEventListener('load', markLoaded);
            img.addEventListener('error', () => img.classList.remove('is-loaded'));
        }
    });

    /* ========================================================
       4. SCROLL REVEAL
       ======================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('visible'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        revealElements.forEach(el => observer.observe(el));
    }

    /* ========================================================
       5. PAUSE THE MELODY WHEN THE TAB IS HIDDEN
       ======================================================== */
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isPlaying && audioCtx) {
            audioCtx.suspend();
        } else if (!document.hidden && isPlaying && audioCtx) {
            audioCtx.resume();
        }
    });
    /* ========================================================
       6. LIGHTBOX / ZOOM FEATURE
       ======================================================== */
    const polaroids = document.querySelectorAll('.polaroid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightbox && polaroids.length > 0) {
        polaroids.forEach(polaroid => {
            polaroid.addEventListener('click', () => {
                const img = polaroid.querySelector('img');
                const caption = polaroid.querySelector('figcaption');
                
                // Only open lightbox if the image has actually loaded
                if (img && img.classList.contains('is-loaded')) {
                    lightboxImg.src = img.src;
                    lightboxCaption.textContent = caption ? caption.textContent : '';
                    lightbox.classList.add('active');
                    
                    // Stop the background website from scrolling while lightbox is open
                    document.body.style.overflow = 'hidden'; 
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
            // Clear the image source after the fade-out animation completes
            setTimeout(() => { lightboxImg.src = ''; }, 300); 
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        // Close if clicking on the dark background area
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        // Close if the Escape key is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
})();
