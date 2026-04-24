/* ============================================
   ÉcoTech 3D — UI System
   ============================================ */

const UI = {
    minimapCtx: null,
    minimapScale: 2.2,

    init() {
        const canvas = document.getElementById('minimap-canvas');
        if (canvas) {
            this.minimapCtx = canvas.getContext('2d');
        }

        // Info panel close button
        const closeBtn = document.getElementById('info-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('info-panel').style.display = 'none';
            });
        }

        // Generate welcome particles
        this._generateWelcomeParticles();
    },

    /**
     * Update room indicator
     */
    updateRoomIndicator(roomName) {
        const indicator = document.getElementById('room-indicator');
        if (!indicator) return;

        const names = {
            hall: { icon: '🏛️', text: 'Hall Central' },
            climate: { icon: '🌿', text: 'Climat & Réchauffement' },
            energy: { icon: '⚡', text: 'Énergies Renouvelables' },
            cities: { icon: '🏙️', text: 'Villes Durables' },
            biodiversity: { icon: '🌳', text: 'Biodiversité' },
            recycling: { icon: '♻️', text: 'Recyclage' },
            corridor: { icon: '🚶', text: 'Couloir' },
        };

        const info = names[roomName] || names.corridor;
        indicator.querySelector('.room-indicator-icon').textContent = info.icon;
        indicator.querySelector('.room-indicator-text').textContent = info.text;

        // Change indicator color based on room
        const colors = {
            hall: '#00d4aa',
            climate: '#4da6ff',
            energy: '#ffd700',
            cities: '#b48eff',
            biodiversity: '#2ecc71',
            recycling: '#2ecc71',
            corridor: '#888888',
        };
        indicator.style.borderColor = (colors[roomName] || '#888') + '40';
    },

    /**
     * AI Assistant Messages
     */
    showAIMessage(text) {
        const aiText = document.getElementById('ai-text');
        if (!aiText) return;
        
        const aiBubble = aiText.parentElement;
        
        // Restart animation
        aiBubble.style.animation = 'none';
        aiBubble.offsetHeight; // trigger reflow
        aiBubble.style.animation = null;
        
        aiText.textContent = '';
        let i = 0;
        const speed = 20;
        
        // Cancel any previous typing
        if (this._typeTimer) clearTimeout(this._typeTimer);
        
        const self = this;
        function type() {
            if (i < text.length) {
                aiText.textContent = text.substring(0, i + 1);
                i++;
                self._typeTimer = setTimeout(type, speed);
            }
        }
        type();
    },

    triggerRoomAI(roomName) {
        const messages = {
            hall: "Nous sommes dans le Hall Central. De là, vous pouvez accéder aux 5 thématiques majeures de l'écologie moderne.",
            climate: "Cette salle traite du réchauffement climatique. Les prototypes 3D vous montrent l'impact thermique sur notre planète.",
            energy: "Ici, nous explorons les énergies du futur. Regardez comment les réseaux intelligents optimisent la distribution.",
            cities: "Bienvenue dans la Smart City. Tout ici est interconnecté pour réduire l'empreinte carbone urbaine.",
            biodiversity: "La préservation des espèces est notre priorité. Chaque espèce disparue affaiblit l'équilibre global.",
            recycling: "Le recyclage n'est que le début. L'objectif est l'économie circulaire totale, où rien ne se perd.",
            corridor: "Les couloirs de transition utilisent un éclairage adaptatif pour économiser 40% d'énergie."
        };
        this.showAIMessage(messages[roomName] || "Continuez votre exploration.");
    },

    /**
     * Smart Dashboard updates
     */
    updateDashboard() {
        const energy = Math.floor(95 + Math.random() * 5);
        const co2 = (12.4 + Math.random() * 0.5).toFixed(1);
        
        const eEl = document.getElementById('dash-energy');
        const cEl = document.getElementById('dash-co2');
        if (eEl) eEl.innerText = energy + '% Propre';
        if (cEl) cEl.innerText = co2 + ' Tonnes';
    },

    /**
     * Update minimap
     */
    updateMinimap(playerX, playerZ, playerRotY) {
        const ctx = this.minimapCtx;
        if (!ctx) return;

        const canvas = ctx.canvas;
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const scale = 1.3;

        ctx.clearRect(0, 0, w, h);

        // Draw rooms
        const rooms = {
            hall: { color: '#00d4aa', size: Museum.hallWidth },
            climate: { color: '#4da6ff', size: Museum.roomWidth },
            energy: { color: '#ffd700', size: Museum.roomWidth },
            cities: { color: '#b48eff', size: Museum.roomWidth },
            biodiversity: { color: '#2ecc71', size: Museum.roomWidth },
            recycling: { color: '#2ecc71', size: Museum.roomWidth },
        };

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-playerRotY);

        for (const [name, room] of Object.entries(rooms)) {
            const rPos = Museum.roomPositions[name];
            const mx = (rPos.x - playerX) * scale;
            const my = (rPos.z - playerZ) * scale;
            const size = room.size * scale;

            ctx.fillStyle = room.color + '25';
            ctx.strokeStyle = room.color + '88';
            ctx.lineWidth = 1;
            ctx.fillRect(mx - size/2, my - size/2, size, size);
            ctx.strokeRect(mx - size/2, my - size/2, size, size);

            // Room label
            ctx.save();
            ctx.translate(mx, my);
            ctx.rotate(playerRotY);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 9px Inter';
            ctx.textAlign = 'center';
            const labels = {
                hall: 'Hall', climate: 'Climat', energy: 'Énergie',
                cities: 'Villes', biodiversity: 'Bio', recycling: 'Recyclage'
            };
            ctx.fillText(labels[name], 0, 4);
            ctx.restore();
        }

        ctx.restore();

        // Player marker
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#00d4aa';
        ctx.lineWidth = 2;
        ctx.stroke();
    },

    /**
     * Exhibit Info & 3D Prototype Modal
     */
    showExhibit(data) {
        if (!data) return;

        const modal = document.getElementById('prototype-modal');
        const title = document.getElementById('prototype-title');
        const body = document.getElementById('prototype-description');
        const container = document.getElementById('prototype-3d-container');

        if (!modal) return;

        title.innerText = data.title || 'Exposition';
        body.innerHTML = data.description || 'Détails à venir.';

        modal.style.display = 'flex';
        Controls.enabled = false;
        document.exitPointerLock();

        // Clear previous prototype
        while (container.firstChild) container.removeChild(container.firstChild);

        if (data.prototypeFunc) {
            this._initPrototype3D(container, data.prototypeFunc);
        } else {
            container.innerHTML = '<div style="color:#555">Aperçu 3D non disponible</div>';
        }
    },

    _initPrototype3D(container, prototypeFunc) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x040810);
        
        const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);
        
        // Rich lighting setup
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambient);
        
        const keyLight = new THREE.PointLight(0x00d4aa, 3, 30);
        keyLight.position.set(5, 5, 5);
        scene.add(keyLight);
        
        const fillLight = new THREE.PointLight(0x4488ff, 1.5, 20);
        fillLight.position.set(-4, 3, -3);
        scene.add(fillLight);
        
        const rimLight = new THREE.PointLight(0xffd700, 1, 15);
        rimLight.position.set(0, -3, 5);
        scene.add(rimLight);
        
        // Grid floor for premium look
        const gridHelper = new THREE.GridHelper(10, 20, 0x00d4aa, 0x112233);
        gridHelper.position.y = -2;
        scene.add(gridHelper);
        
        const prototype = prototypeFunc();
        scene.add(prototype);
        
        // Auto-fit camera to prototype size
        const box = new THREE.Box3().setFromObject(prototype);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const dist = maxDim * 2.5;
        camera.position.set(center.x, center.y + maxDim * 0.3, center.z + Math.max(dist, 4));
        camera.lookAt(center);
        
        const animate = () => {
            if (document.getElementById('prototype-modal').style.display === 'none') {
                renderer.dispose();
                return;
            }
            requestAnimationFrame(animate);
            prototype.rotation.y += 0.008;
            renderer.render(scene, camera);
        };
        animate();
        
        this.prototypeRenderer = renderer;
    },

    hideExhibit() {
        const modal = document.getElementById('prototype-modal');
        if (modal) modal.style.display = 'none';
        
        if (this.prototypeRenderer) {
            this.prototypeRenderer.dispose();
            this.prototypeRenderer = null;
        }
        Controls.enabled = true;
        document.body.requestPointerLock();
    },

    /**
     * Generate welcome screen floating particles
     */
    _generateWelcomeParticles() {
        const container = document.getElementById('welcome-particles');
        if (!container) return;

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'welcome-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (6 + Math.random() * 6) + 's';
            particle.style.width = (2 + Math.random() * 4) + 'px';
            particle.style.height = particle.style.width;
            if (Math.random() > 0.5) {
                particle.style.background = '#ffd700';
            }
            container.appendChild(particle);
        }
    },

    /**
     * Show loading progress
     */
    updateLoading(progress, text) {
        const bar = document.getElementById('loader-bar');
        const textEl = document.getElementById('loader-text');
        if (bar) bar.style.width = progress + '%';
        if (textEl) textEl.textContent = text || 'Chargement...';
    },
};

window.UI = UI;
