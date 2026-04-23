/* ============================================
   ÉcoTech 3D — Room 1: Climat & Réchauffement
   Bright museum style
   ============================================ */
const RoomClimate = {
    _anim: {},
    build(scene) {
        const pos = Museum.roomPositions.climate;
        const g = new THREE.Group();
        g.name = 'ClimateExhibits';

        // === PREMIUM WALL VITRINES ===
        const v1 = EcoUtils.createWallVitrine('Anomalie Thermique', 
            '<h3>Réchauffement Non-Uniforme</h3><p>Les pôles se réchauffent 3 fois plus vite que le reste de la planète. L\'Arctique a perdu 40% de sa banquise estivale depuis 1979.</p>',
            'climate', { variant: 'temp', icon: '🌡️', accentColor: '#ff4444', lightColor: 0xff6644 });
        v1.position.set(pos.x - 8, 2.5, pos.z - 17.5);
        Controls.addInteractable(v1);
        g.add(v1);

        const v2 = EcoUtils.createWallVitrine('Effet de Serre', 
            '<h3>Piège Atmosphérique</h3><p>Le CO2 et le méthane piègent la chaleur solaire. Depuis l\'ère industrielle, la concentration de CO2 a augmenté de 50%.</p>',
            'climate', { variant: 'co2', icon: '💨', accentColor: '#4da6ff', lightColor: 0x4488ff });
        v2.position.set(pos.x + 8, 2.5, pos.z - 17.5);
        Controls.addInteractable(v2);
        g.add(v2);

        const v3 = EcoUtils.createWallVitrine('Cryosphère en Péril', 
            '<h3>Fonte Accélérée</h3><p>La fonte des calottes glaciaires contribue à l\'élévation du niveau de la mer, menaçant des millions de citadins côtiers d\'ici 2050.</p>',
            'climate', { variant: 'ice', icon: '🧊', accentColor: '#88ccff', lightColor: 0x88ccff });
        v3.position.set(pos.x - 17.5, 2.5, pos.z + 10);
        v3.rotation.y = Math.PI / 2;
        Controls.addInteractable(v3);
        g.add(v3);

        const v4 = EcoUtils.createWallVitrine('Événements Extrêmes', 
            '<h3>Catastrophes Climatiques</h3><p>Ouragans, sécheresses et inondations deviennent plus fréquents et intenses à mesure que l\'atmosphère se réchauffe.</p>',
            'climate', { variant: 'storm', icon: '🌪️', accentColor: '#ff6b6b', lightColor: 0xff4444 });
        v4.position.set(pos.x, 2.5, pos.z + 17.5);
        v4.rotation.y = Math.PI;
        Controls.addInteractable(v4);
        g.add(v4);


        // === WALL PAINTINGS (Legacy upgraded) ===
        const glacierPaint = EcoUtils.createWallPainting(4, 3, (ctx, w, h) => {
            ctx.fillStyle = '#e0f4ff'; ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#88ccff'; ctx.beginPath(); ctx.moveTo(w*0.1, h*0.8); ctx.lineTo(w*0.25, h*0.15); ctx.lineTo(w*0.4, h*0.8); ctx.fill();
            ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#2980b9'; ctx.textAlign = 'center'; ctx.fillText('1950', w*0.25, h*0.92);
            ctx.font = '48px sans-serif'; ctx.fillStyle = '#ff4444'; ctx.fillText('→', w*0.5, h*0.5);
            ctx.fillStyle = '#aaddff'; ctx.beginPath(); ctx.moveTo(w*0.6, h*0.8); ctx.lineTo(w*0.72, h*0.45); ctx.lineTo(w*0.84, h*0.8); ctx.fill();
            ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#e74c3c'; ctx.fillText('2024', w*0.72, h*0.92);
            ctx.font = 'bold 36px Outfit'; ctx.fillStyle = '#333'; ctx.fillText('🧊 Fonte des Glaciers', w*0.5, 45);
        });
        glacierPaint.position.set(pos.x - 17.8, 3.5, pos.z - 6);
        glacierPaint.rotation.y = Math.PI / 2;
        glacierPaint.userData = { 
            interactive: true, icon: '🧊', title: 'Recul des Glaciers', 
            description: '<p>L\'observation par satellite montre une perte de masse glaciaire sans précédent depuis les années 2000. Les glaciers comme celui de la Mer de Glace en France ont reculé de plusieurs centaines de mètres.</p>' 
        };
        Controls.addInteractable(glacierPaint);
        g.add(glacierPaint);

        const disasterPaint = EcoUtils.createWallPainting(5, 3, (ctx, w, h) => {
            ctx.fillStyle = '#0a1520'; ctx.fillRect(0, 0, w, h);
            ctx.font = 'bold 32px Outfit'; ctx.fillStyle = '#ff6b6b'; ctx.textAlign = 'center'; ctx.fillText('Carte des Catastrophes Climatiques', w/2, 45);
        });
        disasterPaint.position.set(pos.x + 17.8, 3.5, pos.z + 10); // Door is at 0, moved to +10
        disasterPaint.rotation.y = -Math.PI / 2;
        Controls.addInteractable(disasterPaint);
        g.add(disasterPaint);

        // === SHOWCASES WITH 3D PROTOTYPES ===
        
        // 1. Globe Showcase
        const globeShowcase = EcoUtils.createShowcase(4, 5, 4);
        globeShowcase.group.position.set(pos.x - 6, 0, pos.z + 2);
        
        const gGeo = new THREE.SphereGeometry(1.2, 64, 64);
        const gTex = EcoUtils.createCanvasTexture(1024, 512, (ctx, w, h) => {
            ctx.fillStyle = '#0a1520'; ctx.fillRect(0, 0, w, h);
            for (let i = 0; i < 2000; i++) {
                const x = Math.random() * w; const y = Math.random() * h;
                const temp = Math.sin(y/h*Math.PI);
                ctx.fillStyle = `rgba(255, ${Math.floor(100*temp)}, 0, ${0.1 + 0.3*temp})`;
                ctx.beginPath(); ctx.arc(x, y, 2 + Math.random()*5, 0, Math.PI*2); ctx.fill();
            }
            ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
            for(let i=0; i<w; i+=40) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,h); ctx.stroke(); }
        });
        const gMat = new THREE.MeshStandardMaterial({ 
            map: gTex, 
            emissive: 0xff4400, 
            emissiveIntensity: 0.2,
            roughness: 0.2, 
            metalness: 0.1 
        });
        const globe = new THREE.Mesh(gGeo, gMat);
        globe.position.y = globeShowcase.baseHeight + 1.5;
        
        const globeHitbox = new THREE.Mesh(new THREE.BoxGeometry(4.2, 5.2, 4.2), new THREE.MeshBasicMaterial({visible:false}));
        globeHitbox.position.y = 2.5;
        globeHitbox.userData = { 
            interactive: true, icon: '🌍', title: 'Simulateur Thermique Global',
            description: `<h3>Analyse des Températures</h3>
                <p>Ce prototype interactif modélise les anomalies thermiques de surface. Les zones <strong>rouges</strong> indiquent des hausses supérieures à +2.5°C.</p>
                <p><strong>Objectif :</strong> Limiter le réchauffement à +1.5°C d'ici 2100 selon les accords de Paris.</p>`,
            prototypeFunc: () => {
                const gr = new THREE.Group();
                const m = new THREE.Mesh(gGeo, gMat);
                const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.02, 16, 100), new THREE.MeshStandardMaterial({color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2}));
                ring.rotation.x = Math.PI/2;
                gr.add(m); gr.add(ring);
                return gr;
            }
        };
        Controls.addInteractable(globeHitbox);
        globeShowcase.group.add(globe);
        globeShowcase.group.add(globeHitbox);
        this._anim.globe = globe;
        g.add(globeShowcase.group);

        // 2. Thermometer Showcase
        const thermoShowcase = EcoUtils.createShowcase(3, 6, 3);
        thermoShowcase.group.position.set(pos.x + 6, 0, pos.z - 8);

        const tubeGeo = new THREE.CylinderGeometry(0.25, 0.25, 3.5, 16);
        const tubeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, roughness: 0, metalness: 0.5 });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        tube.position.set(0, thermoShowcase.baseHeight + 2, 0);
        thermoShowcase.group.add(tube);
        
        const mercGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.5, 16);
        const mercMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5 });
        const mercury = new THREE.Mesh(mercGeo, mercMat);
        mercury.position.y = thermoShowcase.baseHeight + 1.5;
        thermoShowcase.group.add(mercury);
        this._anim.mercury = mercury;

        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), mercMat);
        bulb.position.y = thermoShowcase.baseHeight + 0.3;
        thermoShowcase.group.add(bulb);

        const thermoHitbox = new THREE.Mesh(new THREE.BoxGeometry(3.2, 6.2, 3.2), new THREE.MeshBasicMaterial({visible:false}));
        thermoHitbox.position.y = 3;
        thermoHitbox.userData = { 
            interactive: true, icon: '🌡️', title: 'Indicateur de Tendance',
            description: `<h3>Mesure du Réchauffement</h3>
                <p>Ce thermomètre intelligent suit l'augmentation de la température moyenne globale.</p>
                <p>Depuis 1880, la température a augmenté de 1.1°C. La décennie 2011-2020 a été la plus chaude jamais enregistrée.</p>`,
            prototypeFunc: () => {
                const tg = new THREE.Group();
                const t = new THREE.Mesh(tubeGeo, tubeMat);
                const m = new THREE.Mesh(mercGeo, mercMat);
                tg.add(t); tg.add(m); tg.add(new THREE.Mesh(new THREE.SphereGeometry(0.4,16,16), mercMat));
                return tg;
            }
        };
        Controls.addInteractable(thermoHitbox);
        thermoShowcase.group.add(thermoHitbox);
        
        g.add(thermoShowcase.group);

        scene.add(g);
    },
    update(time) {
        if (this._anim.globe) this._anim.globe.rotation.y = time * 0.2;
        if (this._anim.mercury) {
            const h = 2.8 + Math.sin(time * 0.5) * 0.4;
            this._anim.mercury.scale.y = h / 2.5;
            this._anim.mercury.position.y = 1.3 + (h / 2.8);
        }
    },
};
window.RoomClimate = RoomClimate;
