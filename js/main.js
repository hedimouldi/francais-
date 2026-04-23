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
        this.scene.background = new THREE.Color(0x0a0a0e); // Near black
        this.scene.fog = new THREE.Fog(0x0a0a0e, 60, 180);

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
        this.renderer.toneMappingExposure = 1.1; // Reduced from 1.5 for realism
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
        // Warm ambient (low for drama)
        const ambient = new THREE.AmbientLight(0xffeedd, 0.3);
        this.scene.add(ambient);

        // Hemisphere: warm ceiling glow / dark floor
        const hemi = new THREE.HemisphereLight(0xfff0d0, 0x222222, 0.4);
        this.scene.add(hemi);

        // Primary warm directional (strong)
        const sunLight = new THREE.DirectionalLight(0xfff0cc, 0.9);
        sunLight.position.set(20, 50, 10);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.left = -60;
        sunLight.shadow.camera.right = 60;
        sunLight.shadow.camera.top = 60;
        sunLight.shadow.camera.bottom = -60;
        this.scene.add(sunLight);

        // Warm fill from opposite side
        const fillLight = new THREE.DirectionalLight(0xffddaa, 0.35);
        fillLight.position.set(-30, 25, -25);
        this.scene.add(fillLight);

        // Cool accent for depth
        const accentLight = new THREE.DirectionalLight(0x8899bb, 0.2);
        accentLight.position.set(0, 30, -40);
        this.scene.add(accentLight);

        console.log('Dark luxury gallery lighting active');
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
