/* ============================================
   ÉcoTech 3D — Room 2: Énergies Renouvelables
   ============================================ */
const RoomEnergy = {
    _anim: {},
    build(scene) {
        const pos = Museum.roomPositions.energy;
        const g = new THREE.Group();
        g.name = 'EnergyExhibits';

        // === PREMIUM WALL VITRINES ===
        const v1 = EcoUtils.createWallVitrine('Énergie du Vent', 
            '<h3>Éolien Offshore</h3><p>Les éoliennes offshore produisent jusqu\'à 15 MW par unité grâce à la force constante des vents marins.</p>',
            'energy', { variant: 'wind', icon: '🌬️', accentColor: '#ffd700', lightColor: 0xffaa00 });
        v1.position.set(pos.x - 8, 2.5, pos.z - 17.5);
        Controls.addInteractable(v1);
        g.add(v1);

        const v2 = EcoUtils.createWallVitrine('Solaire Thermique', 
            '<h3>Concentration Solaire</h3><p>Des miroirs paraboliques concentrent la chaleur pour produire de la vapeur et alimenter des turbines.</p>',
            'energy', { variant: 'solar', icon: '☀️', accentColor: '#ff9500', lightColor: 0xff9500 });
        v2.position.set(pos.x + 8, 2.5, pos.z - 17.5);
        Controls.addInteractable(v2);
        g.add(v2);

        const v3 = EcoUtils.createWallVitrine('Hydro-électricité', 
            '<h3>Force de l\'Eau</h3><p>Les barrages modernes produisent 16% de l\'énergie mondiale tout en préservant la biodiversité grâce aux passes à poissons.</p>',
            'energy', { variant: 'hydro', icon: '💧', accentColor: '#4da6ff', lightColor: 0x4488ff });
        v3.position.set(pos.x - 17.5, 2.5, pos.z + 10);
        v3.rotation.y = Math.PI / 2;
        Controls.addInteractable(v3);
        g.add(v3);

        const v4 = EcoUtils.createWallVitrine('Smart Grids', 
            '<h3>Réseaux Intelligents</h3><p>Le futur repose sur des réseaux capables d\'équilibrer en temps réel la production intermittente et la consommation.</p>',
            'energy', { variant: 'grid', icon: '⚡', accentColor: '#00d4aa', lightColor: 0x00d4aa });
        v4.position.set(pos.x, 2.5, pos.z + 17.5);
        v4.rotation.y = Math.PI;
        Controls.addInteractable(v4);
        g.add(v4);

        // === WALL PAINTINGS (Legacy upgraded) ===
        const solarPaint = EcoUtils.createWallPainting(4.5, 3, (ctx, w, h) => {
            ctx.fillStyle = '#fffbe6'; ctx.fillRect(0, 0, w, h);
            const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
            sky.addColorStop(0, '#87CEEB'); sky.addColorStop(1, '#ffeebb');
            ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.5);
            ctx.beginPath(); ctx.arc(w * 0.8, h * 0.15, 50, 0, Math.PI * 2); ctx.fillStyle = '#ffd700'; ctx.fill();
            ctx.fillStyle = '#1a1a4a';
            for (let i = 0; i < 6; i++) {
                const px = 80 + i * 130; const py = h * 0.65;
                ctx.save(); ctx.translate(px, py); ctx.rotate(-0.3); ctx.fillRect(-50, -30, 100, 60); ctx.restore();
            }
            ctx.fillStyle = '#4a7856'; ctx.fillRect(0, h * 0.82, w, h * 0.18);
            ctx.font = 'bold 30px Outfit'; ctx.fillStyle = '#333'; ctx.textAlign = 'center'; ctx.fillText('☀️ Ferme Solaire', w/2, h - 20);
        });
        solarPaint.position.set(pos.x + 17.8, 3.5, pos.z + 5);
        solarPaint.rotation.y = -Math.PI / 2;
        solarPaint.userData = { 
            interactive: true, icon: '☀️', title: 'Le Photovoltaïque', 
            description: '<p>Les cellules de silicium captent les photons pour créer un flux d\'électrons. Cette technologie est devenue la source d\'énergie la moins chère de l\'histoire dans de nombreuses régions.</p>' 
        };
        Controls.addInteractable(solarPaint);
        g.add(solarPaint);

        const windPaint = EcoUtils.createWallPainting(4.5, 3, (ctx, w, h) => {
            const sky = ctx.createLinearGradient(0, 0, 0, h);
            sky.addColorStop(0, '#5a9ad5'); sky.addColorStop(1, '#a4d4a4'); ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#3a6a3a'; ctx.fillRect(0, h * 0.85, w, h * 0.15);
            ctx.font = 'bold 30px Outfit'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('🌬️ Parc Éolien', w/2, h - 20);
        });
        windPaint.position.set(pos.x + 17.8, 3.5, pos.z - 5);
        windPaint.rotation.y = -Math.PI / 2;
        windPaint.userData = { interactive: true, icon: '🌬️', title: 'Énergie Éolienne', description: 'L\'éolien fournit 7% de l\'électricité mondiale.' };
        Controls.addInteractable(windPaint);
        g.add(windPaint);

        const compPaint = EcoUtils.createWallPainting(4, 3, (ctx, w, h) => {
            ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
            ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#333'; ctx.textAlign = 'center'; ctx.fillText('⚡ Fossile vs Renouvelable', w/2, 40);
        });
        compPaint.position.set(pos.x - 17.8, 3.5, pos.z - 10); // Door is at pos.z = 0
        compPaint.rotation.y = Math.PI / 2;
        Controls.addInteractable(compPaint);
        g.add(compPaint);

        // === SHOWCASES WITH 3D PROTOTYPES ===
        
        // 1. Turbine Showcase
        const turbineShowcase = EcoUtils.createShowcase(4, 6, 4);
        turbineShowcase.group.position.set(pos.x - 5, 0, pos.z);
        
        const turbine = this._createTurbine();
        turbine.position.set(0, turbineShowcase.baseHeight - 3.5, 0);
        turbine.scale.set(0.6, 0.6, 0.6);
        turbineShowcase.group.add(turbine);
        
        const turbineHitbox = new THREE.Mesh(new THREE.BoxGeometry(4.2, 6.2, 4.2), new THREE.MeshBasicMaterial({visible:false}));
        turbineHitbox.position.y = 3;
        turbineHitbox.userData = { 
            interactive: true, icon: '🌬️', title: 'Aérogénérateur Haliade-X',
            description: `<h3>Technologie Éolienne</h3>
                <p>Ce prototype représente une éolienne de nouvelle génération. </p>
                <ul style="padding-left:20px;">
                    <li><strong>Hauteur :</strong> 260 mètres</li>
                    <li><strong>Diamètre rotor :</strong> 220 mètres</li>
                    <li><strong>Puissance :</strong> 14 MW</li>
                </ul>
                <p>Une seule turbine peut alimenter 16 000 foyers européens.</p>`,
            prototypeFunc: () => {
                const t = this._createTurbine();
                t.position.y = -3;
                return t;
            }
        };
        Controls.addInteractable(turbineHitbox);
        turbineShowcase.group.add(turbineHitbox);
        g.add(turbineShowcase.group);

        // 2. Battery Showcase (Smart Storage)
        const battShowcase = EcoUtils.createShowcase(3, 4.5, 3);
        battShowcase.group.position.set(pos.x + 5, 0, pos.z + 5);

        const battGeo = new THREE.BoxGeometry(0.8, 2.5, 0.6);
        const battMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.9 });
        const batt = new THREE.Mesh(battGeo, battMat);
        batt.position.y = battShowcase.baseHeight + 1.25;
        battShowcase.group.add(batt);

        const fillGeo = new THREE.BoxGeometry(0.65, 2, 0.45);
        const fillMat = new THREE.MeshStandardMaterial({ color: 0x00d4aa, emissive: 0x00d4aa, emissiveIntensity: 1, transparent: true, opacity: 0.8 });
        const fill = new THREE.Mesh(fillGeo, fillMat);
        fill.position.y = battShowcase.baseHeight + 1.0; 
        fill.scale.y = 0.5;
        battShowcase.group.add(fill);
        this._anim.batteryFill = fill;

        const battHitbox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.7, 3.2), new THREE.MeshBasicMaterial({visible:false}));
        battHitbox.position.y = 2.25;
        battHitbox.userData = { 
            interactive: true, icon: '🔋', title: 'Unité de Stockage Tesla Megapack',
            description: `<h3>Gestion Intermittente</h3>
                <p>Le stockage est la clé des énergies renouvelables. Ces batteries lithium-ion stabilisent le réseau lors des pics de demande ou des baisses de vent/soleil.</p>
                <p><strong>Réactivité :</strong> Moins de 100ms pour injecter du courant sur le réseau.</p>`,
            prototypeFunc: () => {
                const bg = new THREE.Group();
                const b = new THREE.Mesh(battGeo, battMat);
                b.position.y = 1.25;
                const f = new THREE.Mesh(fillGeo, fillMat);
                f.position.y = 1.0; f.scale.y = 0.8;
                bg.add(b); bg.add(f);
                const light = new THREE.PointLight(0x00d4aa, 2, 5);
                light.position.set(0, 2, 1);
                bg.add(light);
                return bg;
            }
        };
        Controls.addInteractable(battHitbox);
        battShowcase.group.add(battHitbox);
        g.add(battShowcase.group);

        scene.add(g);
    },
    _createSolarPanel() {
        const g = new THREE.Group();
        const panelGeo = new THREE.BoxGeometry(1.5, 0.05, 1);
        const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a4a, roughness: 0.15, metalness: 0.8 });
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.position.y = 1.5; panel.rotation.x = -Math.PI / 6; g.add(panel);
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8),
            new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7 }));
        pole.position.y = 0.75; g.add(pole);
        return g;
    },
    _createTurbine() {
        const g = new THREE.Group();
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 7, 16),
            new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 }));
        tower.position.y = 3.5; g.add(tower);
        const nac = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.8),
            new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2 }));
        nac.position.y = 7.1; g.add(nac);
        const blades = new THREE.Group();
        blades.position.set(0, 7.1, 0.45);
        for (let i = 0; i < 3; i++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3, 0.03),
                new THREE.MeshStandardMaterial({ color: 0xffffff }));
            blade.position.y = 1.5;
            const bc = new THREE.Group(); bc.add(blade);
            bc.rotation.z = (i / 3) * Math.PI * 2;
            blades.add(bc);
        }
        g.add(blades);
        this._anim.blades = blades;
        return g;
    },
    update(time) {
        if (this._anim.blades) this._anim.blades.rotation.z += 0.05;
        if (this._anim.batteryFill) {
            const l = 0.4 + (Math.sin(time * 0.8) + 1) / 2 * 0.6;
            this._anim.batteryFill.scale.y = l;
            this._anim.batteryFill.position.y = 1.25 - (1-l)*1.25; 
        }
    },
};
window.RoomEnergy = RoomEnergy;
