/* ============================================
   ÉcoTech 3D — Room 3: Villes Durables
   ============================================ */
const RoomCities = {
    _anim: {},
    build(scene) {
        const pos = Museum.roomPositions.cities;
        const g = new THREE.Group();
        g.name = 'CitiesExhibits';
        // === PREMIUM WALL VITRINES ===
        const v1 = EcoUtils.createWallVitrine('Mobilité Décarbonée', 
            '<h3>Transports du Futur</h3><p>La ville durable privilégie les transports doux et partagés pour réduire la dépendance à la voiture individuelle.</p>',
            'cities', { variant: 'transport', icon: '🚊', accentColor: '#b48eff', lightColor: 0xb48eff });
        v1.position.set(pos.x - 8, 2.5, pos.z - 17.5);
        Controls.addInteractable(v1);
        g.add(v1);

        const v2 = EcoUtils.createWallVitrine('Bâtiments Passifs', 
            '<h3>Architecture Autonome</h3><p>Ces structures produisent plus d\'énergie qu\'elles n\'en consomment grâce à une isolation extrême et au solaire intégré.</p>',
            'cities', { variant: 'building', icon: '🏢', accentColor: '#4da6ff', lightColor: 0x4488ff });
        v2.position.set(pos.x + 8, 2.5, pos.z - 17.5);
        Controls.addInteractable(v2);
        g.add(v2);

        const v3 = EcoUtils.createWallVitrine('Fermes Verticales', 
            '<h3>Agriculture Urbaine</h3><p>L\'hydroponie permet d\'économiser 90% d\'eau par rapport à l\'agriculture classique tout en raccourcissant les circuits.</p>',
            'cities', { variant: 'farm', icon: '🌱', accentColor: '#2ecc71', lightColor: 0x22cc66 });
        v3.position.set(pos.x - 17.5, 2.5, pos.z - 10);
        v3.rotation.y = Math.PI / 2;
        Controls.addInteractable(v3);
        g.add(v3);

        const v4 = EcoUtils.createWallVitrine('Économie Circulaire', 
            '<h3>Zéro Déchet Urbain</h3><p>Les déchets des uns deviennent les ressources des autres via des systèmes de gestion intelligents.</p>',
            'cities', { variant: 'circular', icon: '♻️', accentColor: '#00d4aa', lightColor: 0x00d4aa });
        v4.position.set(pos.x + 17.5, 2.5, pos.z - 10);
        v4.rotation.y = -Math.PI / 2;
        Controls.addInteractable(v4);
        g.add(v4);

        // === WALL PAINTINGS ===
        const cityPaint = EcoUtils.createWallPainting(5, 3.5, (ctx, w, h) => {
            const sky = ctx.createLinearGradient(0, 0, 0, h * 0.4);
            sky.addColorStop(0, '#1a0a3a'); sky.addColorStop(1, '#4a2a8a');
            ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.4);
            const bColors = ['#2a3a5a', '#3a4a6a', '#4a5a7a', '#2a4a5a'];
            const buildings = [{x:50,w:80,h:350},{x:140,w:60,h:280},{x:220,w:100,h:400},{x:340,w:70,h:320},
                {x:430,w:90,h:380},{x:540,w:60,h:250},{x:620,w:110,h:420},{x:750,w:70,h:300},{x:840,w:80,h:360}];
            buildings.forEach((b, i) => {
                ctx.fillStyle = bColors[i % bColors.length];
                ctx.fillRect(b.x, h - b.h, b.w, b.h);
                ctx.fillStyle = 'rgba(255,215,0,0.4)';
                for (let wy = h - b.h + 15; wy < h - 20; wy += 25) {
                    for (let wx = b.x + 10; wx < b.x + b.w - 10; wx += 18) { ctx.fillRect(wx, wy, 8, 12); }
                }
            });
            ctx.font = 'bold 30px Outfit'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('🏙️ Vision Urbaine 2050', w/2, h - 15);
        });
        cityPaint.position.set(pos.x, 3.5, pos.z + 17.8);
        cityPaint.rotation.y = Math.PI;
        cityPaint.userData = { 
            interactive: true, icon: '🏙️', title: 'La Ville Régénératrice', 
            description: '<p>Au-delà de la durabilité, la ville du futur cherche à régénérer son environnement en filtrant l\'air et en favorisant la biodiversité urbaine.</p>' 
        };
        Controls.addInteractable(cityPaint);
        g.add(cityPaint);
 
        // === SHOWCASES WITH 3D PROTOTYPES ===
        
        // 1. City Diorama Showcase
        const cityShowcase = EcoUtils.createShowcase(12, 4, 12);
        cityShowcase.group.position.set(pos.x, 0, pos.z);
        
        const cityModel = new THREE.Group();
        cityModel.position.set(0, cityShowcase.baseHeight, 0);
        const platform = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.2, 0.4, 32),
            new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.8 }));
        platform.position.y = 0.2;
        cityModel.add(platform);
        
        const bData = [
            {x:-2,z:-1.5,w:0.8,h:2.5,d:0.8,c:0x5577aa},
            {x:0,z:-2,w:1,h:3.5,d:0.7,c:0x6688bb},
            {x:2,z:-1,w:0.7,h:2,d:0.7,c:0x5588aa},
            {x:-1.5,z:1,w:0.9,h:1.8,d:0.9,c:0x4477aa},
            {x:1,z:1.5,w:1.2,h:2.8,d:0.8,c:0x6699bb},
            {x:-3,z:0,w:0.6,h:1.5,d:0.6,c:0x557799}
        ];
        bData.forEach(b => {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d),
                new THREE.MeshStandardMaterial({ color: b.c, roughness: 0.1, metalness: 0.5 }));
            mesh.position.set(b.x, 0.4 + b.h / 2, b.z);
            cityModel.add(mesh);
            // Window lights emissive
            const win = new THREE.Mesh(new THREE.BoxGeometry(b.w + 0.01, b.h * 0.8, b.d + 0.01),
                new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x00d4aa, emissiveIntensity: 0.1 }));
            win.position.set(b.x, 0.4 + b.h / 2, b.z);
            cityModel.add(win);
        });
        
        const car = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.2),
            new THREE.MeshStandardMaterial({ color: 0x00d4aa, emissive: 0x00d4aa, emissiveIntensity: 2 }));
        car.position.y = 0.5;
        cityModel.add(car);
        this._anim.car = car;
        
        const cityHitbox = new THREE.Mesh(new THREE.BoxGeometry(11.8, 4, 11.8), new THREE.MeshBasicMaterial({visible:false}));
        cityHitbox.position.y = 2;
        cityHitbox.userData = { 
            interactive: true, icon: '🏙️', title: 'Maquette Smart City 2.0',
            description: `<h3>Urbanisme Intelligent</h3>
                <p>Cette maquette présente un quartier à énergie positive.</p>
                <ul style="padding-left:20px;">
                    <li><strong>Bâtiments :</strong> Pilotés par IA pour optimiser le chauffage.</li>
                    <li><strong>Transports :</strong> Navettes autonomes partagées (en mouvement).</li>
                    <li><strong>Nature :</strong> 40% de surfaces végétalisées.</li>
                </ul>`,
            prototypeFunc: () => {
                const clone = cityModel.clone();
                clone.position.y = -1;
                const light = new THREE.PointLight(0x00d4aa, 2, 10);
                light.position.set(0, 5, 0);
                clone.add(light);
                return clone;
            }
        };
        Controls.addInteractable(cityHitbox);
        
        cityShowcase.group.add(cityModel);
        cityShowcase.group.add(cityHitbox);
        g.add(cityShowcase.group);
 
        scene.add(g);
    },
    update(time) {
        if (this._anim.car) {
            this._anim.car.position.x = Math.cos(time * 0.5) * 3.5;
            this._anim.car.position.z = Math.sin(time * 0.5) * 3.5;
            this._anim.car.rotation.y = -time * 0.5 + Math.PI / 2;
        }
    },
};
window.RoomCities = RoomCities;
