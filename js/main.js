/* ============================================
   ÉcoTech 3D — Main Application
   Bright, realistic museum lighting
   ============================================ */

const EcoApp = {
    state: 'loading',
    scene: null,
    camera: null,
    renderer: null,
    clock: null,
    rooms: null,
    currentRoom: 'hall',
    rgbOrbitLights: [],

    init() {
        this.clock = new THREE.Clock();
        this.rooms = [HallRoom, RoomClimate, RoomEnergy, RoomCities, RoomBiodiversity, RoomRecycling];
        UI.init();
        this._startLoading();
    },

    async _startLoading() {
        try {
            UI.updateLoading(10, 'Initialisation du moteur 3D...');
            await this._delay(300);

            this._initThreeJS();
            UI.updateLoading(30, 'Construction du musée...');
            await this._delay(300);

            this._buildMuseum();
            UI.updateLoading(60, 'Création des expositions...');
            await this._delay(300);

            this._buildExhibits();
            UI.updateLoading(85, 'Configuration de l\'éclairage...');
            await this._delay(200);

            this._setupLighting();
            UI.updateLoading(95, 'Préparation de la visite...');
            await this._delay(300);

            UI.updateLoading(100, 'Prêt !');
            await this._delay(500);
            this._showWelcome();
        } catch (error) {
            console.error('Erreur au chargement:', error);
            UI.updateLoading(100, 'Erreur : ' + error.message);
            await this._delay(2000);
            this._showWelcome();
        }
    },

    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    _initThreeJS() {
        // Scene — bright background
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x040611);
        this.scene.fog = new THREE.Fog(0x040611, 48, 170);

        // Camera
        this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 300);
        this.camera.position.set(0, 1.7, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance',
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.outputEncoding = THREE.sRGBEncoding || 3001; // r128 compatibility
        document.body.appendChild(this.renderer.domElement);
        console.log('Renderer added to DOM');

        Controls.init(this.camera, this.renderer.domElement);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        console.log('Three.js initialized — realistic gallery mode');
    },

    _buildMuseum() {
        Museum.build(this.scene);
        console.log('Museum built, walls:', Museum.collisionWalls.length);
    },

    _buildExhibits() {
        this.rooms.forEach((room, i) => {
            try {
                room.build(this.scene);
                console.log('Room', i, 'built');
            } catch (e) {
                console.warn('Error building room', i, ':', e);
            }
        });
    },

    /**
     * Premium gallery lighting — warm, dramatic, realistic
     */
    _setupLighting() {
        const ambient = new THREE.AmbientLight(0x1a2348, 0.22);
        this.scene.add(ambient);

        const hemi = new THREE.HemisphereLight(0x2f5cff, 0x05060d, 0.42);
        this.scene.add(hemi);

        const keyLight = new THREE.DirectionalLight(0x7ab3ff, 0.42);
        keyLight.position.set(18, 30, 14);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.left = -60;
        keyLight.shadow.camera.right = 60;
        keyLight.shadow.camera.top = 60;
        keyLight.shadow.camera.bottom = -60;
        this.scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xff46d8, 0.28);
        fillLight.position.set(-24, 20, -16);
        this.scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0x32d9ff, 0.22);
        rimLight.position.set(0, 22, -30);
        this.scene.add(rimLight);

        const cyanOrbit = new THREE.PointLight(0x2dfdff, 0.85, 95, 1.9);
        const magentaOrbit = new THREE.PointLight(0xff2bd6, 0.85, 95, 1.9);
        const blueOrbit = new THREE.PointLight(0x2b6bff, 0.75, 90, 1.9);
        this.scene.add(cyanOrbit);
        this.scene.add(magentaOrbit);
        this.scene.add(blueOrbit);

        this.rgbOrbitLights = [
            { light: cyanOrbit, radius: 26, speed: 0.23, phase: 0.0, y: 7.8 },
            { light: magentaOrbit, radius: 22, speed: 0.27, phase: 2.2, y: 8.6 },
            { light: blueOrbit, radius: 28, speed: 0.19, phase: 4.1, y: 7.2 },
        ];

        const hallPulse = new THREE.PointLight(0x6f8fff, 0.75, 65, 2.0);
        hallPulse.position.set(0, 4.5, 0);
        this.scene.add(hallPulse);
        this.rgbOrbitLights.push({ light: hallPulse, radius: 0, speed: 0.85, phase: 1.4, y: 4.5, pulseOnly: true });

        const sunLight = new THREE.DirectionalLight(0x8fb6ff, 0.35);
        sunLight.position.set(20, 50, 10);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.left = -60;
        sunLight.shadow.camera.right = 60;
        sunLight.shadow.camera.top = 60;
        sunLight.shadow.camera.bottom = -60;
        this.scene.add(sunLight);

        console.log('Neo gaming RGB lighting active');
    },

    _showWelcome() {
        this.state = 'welcome';
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('welcome-screen').style.display = 'flex';

        document.getElementById('enter-btn').addEventListener('click', () => {
            this._startMuseum();
        });
    },

    _startMuseum() {
        this.state = 'playing';
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('hud').style.display = 'block';
        Controls.enabled = true;
        
        this.camera.position.set(0, 1.7, 12); // Start a bit back

        this.renderer.domElement.requestPointerLock();
        this._animate();
        
        // Initial AI greeting
        UI.showAIMessage("Bienvenue à l'ÉcoTech 3D. Je suis votre guide. Explorez les différentes salles pour découvrir le futur du développement durable.");
    },

    showPause() {
        if (this.state !== 'playing') return;
        this.state = 'paused';
        document.getElementById('pause-menu').style.display = 'block';
        Controls.enabled = false;

        const resumeBtn = document.getElementById('resume-btn');
        const restartBtn = document.getElementById('restart-btn');

        const resumeHandler = () => {
            this.state = 'playing';
            document.getElementById('pause-menu').style.display = 'none';
            Controls.enabled = true;
            this.renderer.domElement.requestPointerLock();
            resumeBtn.removeEventListener('click', resumeHandler);
        };

        const restartHandler = () => {
            location.reload();
        };

        resumeBtn.addEventListener('click', resumeHandler);
        restartBtn.addEventListener('click', restartHandler);
    },

    _animate() {
        if (this.state === 'loading' || this.state === 'welcome') return;

        requestAnimationFrame(() => this._animate());

        const delta = Math.min(this.clock.getDelta(), 0.05);
        const elapsed = this.clock.getElapsedTime();

        if (this.state === 'playing') {
            try {
                Controls.update(delta);
            } catch (error) {
                console.error('Controls update error:', error);
            }
        }

        // Update smart dashboard every few seconds
        if (Math.floor(elapsed) % 3 === 0 && Math.floor(elapsed) !== this._lastDashUpdate) {
            this._lastDashUpdate = Math.floor(elapsed);
            UI.updateDashboard();
        }

        // Wrap room and UI updates in try-catch to ensure renderer.render is always reached
        try {
            this.rooms.forEach(room => {
                if (room.update) room.update(elapsed, delta);
            });
            if (Museum.update) Museum.update(elapsed, delta);

            if (this.rgbOrbitLights && this.rgbOrbitLights.length) {
                this.rgbOrbitLights.forEach(item => {
                    if (item.pulseOnly) {
                        item.light.intensity = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(elapsed * item.speed + item.phase));
                        return;
                    }
                    item.light.position.set(
                        Math.cos(elapsed * item.speed + item.phase) * item.radius,
                        item.y + Math.sin(elapsed * item.speed * 1.8 + item.phase) * 0.8,
                        Math.sin(elapsed * item.speed + item.phase) * item.radius
                    );
                });
            }

            const newRoom = Museum.getPlayerRoom(this.camera.position.x, this.camera.position.z);
            if (newRoom !== this.currentRoom) {
                this.currentRoom = newRoom;
                UI.updateRoomIndicator(newRoom);
                UI.triggerRoomAI(newRoom);
            }

            const cameraDir = new THREE.Vector3();
            this.camera.getWorldDirection(cameraDir);
            const rotY = Math.atan2(cameraDir.x, cameraDir.z);
            UI.updateMinimap(this.camera.position.x, this.camera.position.z, rotY);
        } catch (error) {
            console.error('Animation loop non-critical error:', error);
        }

        try {
            this.renderer.render(this.scene, this.camera);
        } catch (err) {
            console.error('Render error:', err);
        }
    },
};

window.EcoApp = EcoApp;

document.addEventListener('DOMContentLoaded', () => {
    EcoApp.init();
});
