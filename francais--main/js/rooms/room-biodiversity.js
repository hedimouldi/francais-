/* ============================================
   ÉcoTech 3D — Room 4: Biodiversité
   Premium gallery with diverse unique exhibits
   ============================================ */
const RoomBiodiversity = {
    _anim: {},
    build(scene) {
        const pos = Museum.roomPositions.biodiversity;
        const g = new THREE.Group();
        g.name = 'BiodiversityExhibits';

        // === PREMIUM WALL VITRINES ===
        const v1 = EcoUtils.createWallVitrine('Équilibre Fragile', 
            '<h3>Services Écosystémiques</h3><p>La biodiversité assure la pollinisation, la filtration de l\'eau et la régulation du climat. Chaque espèce joue un rôle vital.</p>',
            'biodiversity', { icon: '🌿', accentColor: '#2ecc71', lightColor: 0x22cc66 });
        v1.position.set(pos.x - 8, 2.5, pos.z - 17.5);
        Controls.addInteractable(v1);
        g.add(v1);

        const v2 = EcoUtils.createWallVitrine('Hotspots Mondiaux', 
            '<h3>Zones Critiques</h3><p>36 zones sur Terre abritent 50% des espèces végétales endémiques.</p>',
            'biodiversity', { icon: '🌍', accentColor: '#00d4aa', lightColor: 0x00d4aa });
        v2.position.set(pos.x + 8, 2.5, pos.z - 17.5);
        Controls.addInteractable(v2);
        g.add(v2);

        const v3 = EcoUtils.createWallVitrine('Restauration', 
            '<h3>Décennie ONU</h3><p>Prévenir, arrêter et inverser la dégradation de la nature d\'ici 2030.</p>',
            'biodiversity', { icon: '🌱', accentColor: '#27ae60', lightColor: 0x22aa55 });
        v3.position.set(pos.x - 17.5, 2.5, pos.z - 8);
        v3.rotation.y = Math.PI / 2;
        Controls.addInteractable(v3);
        g.add(v3);

        const v4 = EcoUtils.createWallVitrine('Forêts Primaires', 
            '<h3>Poumons Verts</h3><p>Les forêts primaires abritent 80% de la biodiversité terrestre.</p>',
            'biodiversity', { icon: '🌳', accentColor: '#1e8449', lightColor: 0x118833 });
        v4.position.set(pos.x + 17.5, 2.5, pos.z - 8);
        v4.rotation.y = -Math.PI / 2;
        Controls.addInteractable(v4);
        g.add(v4);

        // === UNIQUE WALL ART 1: Arbre de Vie (left wall) ===
        const treeOfLife = EcoUtils.createWallPainting(4, 3.5, (ctx, w, h) => {
            const bg = ctx.createRadialGradient(w/2, h, 10, w/2, h/2, w);
            bg.addColorStop(0, '#0a2e1a'); bg.addColorStop(1, '#041008');
            ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
            // Trunk
            ctx.fillStyle = '#5a3a1a';
            ctx.fillRect(w*0.46, h*0.35, w*0.08, h*0.65);
            // Branches & leaves
            const leafColors = ['#2ecc71','#27ae60','#1abc9c','#16a085','#00d4aa'];
            for (let i = 0; i < 80; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 30 + Math.random() * 200;
                const lx = w*0.5 + Math.cos(angle) * dist;
                const ly = h*0.3 + Math.sin(angle) * dist * 0.6 - 50;
                const size = 8 + Math.random() * 18;
                ctx.fillStyle = leafColors[Math.floor(Math.random()*5)];
                ctx.globalAlpha = 0.4 + Math.random() * 0.6;
                ctx.beginPath(); ctx.arc(lx, ly, size, 0, Math.PI*2); ctx.fill();
            }
            ctx.globalAlpha = 1;
            ctx.font = 'bold 32px Outfit'; ctx.fillStyle = '#2ecc71'; ctx.textAlign = 'center';
            ctx.fillText('🌳 Arbre de Vie', w/2, 40);
        });
        treeOfLife.position.set(pos.x - 17.8, 3.5, pos.z + 5);
        treeOfLife.rotation.y = Math.PI / 2;
        treeOfLife.userData = { interactive: true, icon: '🌳', title: 'Arbre de Vie',
            description: '<h3>Interconnexion du Vivant</h3><p>Chaque branche représente un embranchement de la classification du vivant. 8.7 millions d\'espèces peuplent notre planète.</p>' };
        Controls.addInteractable(treeOfLife);
        g.add(treeOfLife);

        // === UNIQUE WALL ART 2: Récif Corallien (right wall) ===
        const coralPaint = EcoUtils.createWallPainting(4, 3, (ctx, w, h) => {
            const ocean = ctx.createLinearGradient(0, 0, 0, h);
            ocean.addColorStop(0, '#0a3a6a'); ocean.addColorStop(1, '#1a6b9c');
            ctx.fillStyle = ocean; ctx.fillRect(0, 0, w, h);
            // Coral structures
            const coralColors = ['#ff7f50','#ff6b6b','#ffaa44','#ff88cc','#ff4488'];
            for (let i = 0; i < 15; i++) {
                ctx.fillStyle = coralColors[i%5];
                const cx = 40 + i*(w/15);
                for (let j = 0; j < 4; j++) {
                    ctx.beginPath();
                    ctx.ellipse(cx+j*10, h-20-j*25, 12+j*3, 20+j*5, 0, Math.PI, 0);
                    ctx.fill();
                }
            }
            // Fish
            ctx.fillStyle = '#ffd700';
            for (let i = 0; i < 8; i++) {
                const fx = 60 + i*90; const fy = 80 + (i%3)*60;
                ctx.beginPath(); ctx.ellipse(fx, fy, 18, 8, 0.1*i, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.moveTo(fx+18, fy); ctx.lineTo(fx+30, fy-8); ctx.lineTo(fx+30, fy+8); ctx.fill();
            }
            ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
            ctx.fillText('🐠 Grande Barrière de Corail', w/2, 35);
        });
        coralPaint.position.set(pos.x + 17.8, 3.5, pos.z + 3);
        coralPaint.rotation.y = -Math.PI / 2;
        coralPaint.userData = { interactive: true, icon: '🐠', title: 'Grande Barrière de Corail',
            description: '<h3>Écosystème Marin</h3><p>Le plus grand organisme vivant visible depuis l\'espace. 2300 km de long, abritant 1500 espèces de poissons.</p>' };
        Controls.addInteractable(coralPaint);
        g.add(coralPaint);

        // === UNIQUE WALL ART 3: Espèces Disparues Timeline (front wall) ===
        const extinctPaint = EcoUtils.createWallPainting(6, 2.5, (ctx, w, h) => {
            ctx.fillStyle = '#1a0a0a'; ctx.fillRect(0, 0, w, h);
            ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#ff6b6b'; ctx.textAlign = 'center';
            ctx.fillText('⚠️ Chronologie des Extinctions', w/2, 35);
            const species = [
                {e:'🦤', n:'Dodo', y:'1681'}, {e:'🐺', n:'Loup Marsupial', y:'1936'},
                {e:'🦏', n:'Rhino Blanc N.', y:'2018'}, {e:'🐦', n:'Ara de Spix', y:'2000'}
            ];
            species.forEach((sp, i) => {
                const x = 80 + i * (w/4.5);
                ctx.font = '50px serif'; ctx.fillText(sp.e, x, h*0.45);
                ctx.font = 'bold 18px Outfit'; ctx.fillStyle = '#fff'; ctx.fillText(sp.n, x, h*0.65);
                ctx.font = '16px Inter'; ctx.fillStyle = '#ff6b6b'; ctx.fillText(sp.y, x, h*0.8);
                if (i < species.length-1) {
                    ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 2;
                    ctx.setLineDash([4,4]); ctx.beginPath();
                    ctx.moveTo(x+60, h*0.5); ctx.lineTo(x+w/4.5-60, h*0.5); ctx.stroke();
                    ctx.setLineDash([]);
                }
            });
        }, { frameColor: 0x993333 });
        extinctPaint.position.set(pos.x, 3.5, pos.z - 17.8);
        extinctPaint.userData = { interactive: true, icon: '⚠️', title: 'Extinctions de Masse',
            description: '<h3>Sixième Extinction</h3><p>Le taux d\'extinction actuel est 1000 fois supérieur au taux naturel. Plus d\'un million d\'espèces sont menacées.</p>' };
        Controls.addInteractable(extinctPaint);
        g.add(extinctPaint);

        // === SHOWCASE 1: ADN Helicoïdal (centre gauche) ===
        const dnaShowcase = EcoUtils.createShowcase(3.5, 5, 3.5);
        dnaShowcase.group.position.set(pos.x - 5, 0, pos.z + 3);
        const dnaGroup = new THREE.Group();
        const helixMat1 = new THREE.MeshStandardMaterial({color: 0x2ecc71, emissive: 0x00ff44, emissiveIntensity: 0.3, metalness: 0.6});
        const helixMat2 = new THREE.MeshStandardMaterial({color: 0x4da6ff, emissive: 0x0066ff, emissiveIntensity: 0.3, metalness: 0.6});
        for (let i = 0; i < 16; i++) {
            const angle = i * 0.5;
            const y = -1.5 + i * 0.2;
            const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), helixMat1);
            s1.position.set(Math.cos(angle)*0.5, y, Math.sin(angle)*0.5);
            const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), helixMat2);
            s2.position.set(Math.cos(angle+Math.PI)*0.5, y, Math.sin(angle+Math.PI)*0.5);
            dnaGroup.add(s1); dnaGroup.add(s2);
        }
        dnaGroup.position.y = dnaShowcase.baseHeight + 2;
        dnaShowcase.group.add(dnaGroup);
        this._anim.dna = dnaGroup;
        const dnaHit = new THREE.Mesh(new THREE.BoxGeometry(3.5, 5, 3.5), new THREE.MeshBasicMaterial({visible:false}));
        dnaHit.position.y = 2.5;
        dnaHit.userData = { interactive: true, icon: '🧬', title: 'Double Hélice ADN',
            description: '<h3>Code de la Vie</h3><p>L\'ADN contient le plan de construction de chaque organisme. La diversité génétique est la clé de l\'adaptation aux changements environnementaux.</p>',
            prototypeFunc: () => {
                const pg = new THREE.Group();
                for (let i = 0; i < 24; i++) {
                    const a = i * 0.4; const y = -2 + i * 0.18;
                    const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshStandardMaterial({color: 0x2ecc71, emissive: 0x00ff44, emissiveIntensity: 0.5}));
                    s1.position.set(Math.cos(a)*0.8, y, Math.sin(a)*0.8);
                    const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshStandardMaterial({color: 0x4da6ff, emissive: 0x0066ff, emissiveIntensity: 0.5}));
                    s2.position.set(Math.cos(a+Math.PI)*0.8, y, Math.sin(a+Math.PI)*0.8);
                    const link = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.6, 6), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3}));
                    link.position.set(0, y, 0); link.rotation.z = Math.PI/2; link.rotation.y = -a;
                    pg.add(s1); pg.add(s2); pg.add(link);
                }
                return pg;
            }
        };
        Controls.addInteractable(dnaHit);
        dnaShowcase.group.add(dnaHit);
        g.add(dnaShowcase.group);

        // === SHOWCASE 2: Globe Biodiversité (centre droit) ===
        const bioGlobeShowcase = EcoUtils.createShowcase(4, 5, 4);
        bioGlobeShowcase.group.position.set(pos.x + 5, 0, pos.z + 3);
        const globeGeo = new THREE.IcosahedronGeometry(1.2, 2);
        const globeMat = new THREE.MeshStandardMaterial({color: 0x1a8a4a, emissive: 0x004422, emissiveIntensity: 0.2, wireframe: false, flatShading: true});
        const bioGlobe = new THREE.Mesh(globeGeo, globeMat);
        bioGlobe.position.y = bioGlobeShowcase.baseHeight + 1.8;
        bioGlobeShowcase.group.add(bioGlobe);
        this._anim.bioGlobe = bioGlobe;
        // Water ring
        const waterRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.04, 16, 64), new THREE.MeshStandardMaterial({color: 0x4488ff, emissive: 0x0044ff, emissiveIntensity: 0.8}));
        waterRing.rotation.x = Math.PI / 2;
        waterRing.position.y = bioGlobeShowcase.baseHeight + 1.8;
        bioGlobeShowcase.group.add(waterRing);
        const bioGlobeHit = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 4), new THREE.MeshBasicMaterial({visible:false}));
        bioGlobeHit.position.y = 2.5;
        bioGlobeHit.userData = { interactive: true, icon: '🌍', title: 'Globe Biodiversité',
            description: '<h3>Répartition du Vivant</h3><p>70% de la surface terrestre est recouverte d\'eau. Les océans abritent 80% de la vie sur Terre, dont 91% reste encore inexplorée.</p>',
            prototypeFunc: () => EcoUtils.getThemePrototype('biodiversity')
        };
        Controls.addInteractable(bioGlobeHit);
        bioGlobeShowcase.group.add(bioGlobeHit);
        g.add(bioGlobeShowcase.group);

        // === INFO PANEL: Statistiques clés ===
        const stats = EcoUtils.createInfoPanel('La Biodiversité en Chiffres',
            '• 8.7 millions d\'espèces sur Terre\n• 1 million menacées d\'extinction\n• 68% de déclin depuis 1970\n• 10 millions ha de forêts perdues/an',
            { icon: '📊', accentColor: '#27ae60', width: 3.5, height: 3.5 });
        stats.position.set(pos.x + 8, 3.5, pos.z + 17.8);
        stats.rotation.y = Math.PI;
        Controls.addInteractable(stats);
        g.add(stats);

        scene.add(g);
    },
    update(time) {
        if (this._anim.dna) this._anim.dna.rotation.y = time * 0.4;
        if (this._anim.bioGlobe) {
            this._anim.bioGlobe.rotation.y = time * 0.15;
            this._anim.bioGlobe.rotation.x = Math.sin(time * 0.3) * 0.1;
        }
    },
};
window.RoomBiodiversity = RoomBiodiversity;
