/* ============================================
   ÉcoTech 3D — Room 5: Recyclage & Économie Circulaire
   Premium gallery with diverse unique exhibits
   ============================================ */
const RoomRecycling = {
    _anim: {},
    build(scene) {
        const pos = Museum.roomPositions.recycling;
        const g = new THREE.Group();
        g.name = 'RecyclingExhibits';

        // === PREMIUM WALL VITRINES ===
        const v1 = EcoUtils.createWallVitrine('Tri Optique', 
            '<h3>Haute Précision</h3><p>Le tri laser sépare les plastiques par résine (PET, PEHD) avec 99% de précision.</p>',
            'recycling', { icon: '♻️', accentColor: '#2ecc71', lightColor: 0x22cc66 });
        v1.position.set(pos.x - 8, 2.5, pos.z - 17.5);
        Controls.addInteractable(v1);
        g.add(v1);

        const v2 = EcoUtils.createWallVitrine('Valorisation', 
            '<h3>Économie de Ressources</h3><p>Recycler une tonne de papier économise 2,5 tonnes de bois et 50 000 litres d\'eau.</p>',
            'recycling', { icon: '📦', accentColor: '#00d4aa', lightColor: 0x00d4aa });
        v2.position.set(pos.x + 8, 2.5, pos.z - 17.5);
        Controls.addInteractable(v2);
        g.add(v2);

        const v3 = EcoUtils.createWallVitrine('Éco-Conception', 
            '<h3>Design Circulaire</h3><p>Concevoir des produits faciles à démonter et recycler dès leur phase de conception.</p>',
            'recycling', { icon: '🔧', accentColor: '#4da6ff', lightColor: 0x4488ff });
        v3.position.set(pos.x - 17.5, 2.5, pos.z - 10);
        v3.rotation.y = Math.PI / 2;
        Controls.addInteractable(v3);
        g.add(v3);

        const v4 = EcoUtils.createWallVitrine('Zéro Déchet', 
            '<h3>Boucle Fermée</h3><p>Transformer chaque résidu en ressource pour fermer la boucle du cycle de vie.</p>',
            'recycling', { icon: '🔄', accentColor: '#ffd700', lightColor: 0xffaa00 });
        v4.position.set(pos.x + 17.5, 2.5, pos.z - 10);
        v4.rotation.y = -Math.PI / 2;
        Controls.addInteractable(v4);
        g.add(v4);

        // === UNIQUE WALL ART 1: Guide du Tri (front wall) ===
        const sortGuide = EcoUtils.createWallPainting(6, 3, (ctx, w, h) => {
            ctx.fillStyle = '#0a1a0a'; ctx.fillRect(0, 0, w, h);
            ctx.font = 'bold 30px Outfit'; ctx.fillStyle = '#00d4aa'; ctx.textAlign = 'center';
            ctx.fillText('♻️ Guide Intelligent du Tri', w/2, 40);
            const bins = [
                {c:'#f1c40f', t:'Plastique', i:'🧴', items:['Bouteilles','Flacons','Films']},
                {c:'#3498db', t:'Papier', i:'📄', items:['Journaux','Cartons','Enveloppes']},
                {c:'#2ecc71', t:'Verre', i:'🍾', items:['Bocaux','Bouteilles','Pots']},
                {c:'#e74c3c', t:'Organique', i:'🍎', items:['Épluchures','Coquilles','Marc café']}
            ];
            bins.forEach((b, i) => {
                const x = 30 + i * (w/4.2);
                // Bin shape
                ctx.fillStyle = b.c; ctx.globalAlpha = 0.3;
                ctx.fillRect(x+10, 80, 100, 130); ctx.globalAlpha = 1;
                ctx.strokeStyle = b.c; ctx.lineWidth = 2;
                ctx.strokeRect(x+10, 80, 100, 130);
                ctx.font = '36px serif'; ctx.textAlign = 'center'; ctx.fillText(b.i, x+60, 130);
                ctx.font = 'bold 16px Outfit'; ctx.fillStyle = b.c; ctx.fillText(b.t, x+60, 165);
                ctx.font = '12px Inter'; ctx.fillStyle = '#aaa';
                b.items.forEach((item, j) => ctx.fillText(item, x+60, 190 + j*16));
            });
        });
        sortGuide.position.set(pos.x, 3.5, pos.z - 17.8);
        sortGuide.userData = { interactive: true, icon: '♻️', title: 'Guide Intelligent du Tri',
            description: '<h3>Tri Connecté</h3><p>Les poubelles intelligentes scannent les codes-barres pour guider le citoyen. En France, le taux de recyclage atteint 68% pour les emballages ménagers.</p>' };
        Controls.addInteractable(sortGuide);
        g.add(sortGuide);

        // === UNIQUE WALL ART 2: Cycle de Vie d'un Produit (left wall) ===
        const cyclePaint = EcoUtils.createWallPainting(4, 3, (ctx, w, h) => {
            ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, w, h);
            ctx.font = 'bold 24px Outfit'; ctx.fillStyle = '#ffd700'; ctx.textAlign = 'center';
            ctx.fillText('🔄 Cycle de Vie d\'un Produit', w/2, 35);
            const stages = ['⛏️ Extraction','🏭 Fabrication','🚛 Transport','🛒 Usage','♻️ Recyclage'];
            const cx = w/2, cy = h/2 + 20, r = Math.min(w,h) * 0.28;
            stages.forEach((s, i) => {
                const angle = (i / stages.length) * Math.PI * 2 - Math.PI/2;
                const sx = cx + Math.cos(angle) * r;
                const sy = cy + Math.sin(angle) * r;
                ctx.fillStyle = '#1a2a3a'; ctx.beginPath(); ctx.arc(sx, sy, 30, 0, Math.PI*2); ctx.fill();
                ctx.strokeStyle = '#00d4aa'; ctx.lineWidth = 2; ctx.stroke();
                ctx.font = '22px serif'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(s.split(' ')[0], sx, sy+6);
                ctx.font = '11px Inter'; ctx.fillStyle = '#aaa'; ctx.fillText(s.split(' ').slice(1).join(' '), sx, sy+22);
                // Arrow to next
                const na = ((i+1)/stages.length) * Math.PI * 2 - Math.PI/2;
                const midA = (angle + na) / 2;
                ctx.strokeStyle = 'rgba(0,212,170,0.4)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(sx + Math.cos(na)*12, sy + Math.sin(na)*12);
                ctx.lineTo(cx + Math.cos(midA)*(r-20), cy + Math.sin(midA)*(r-20)); ctx.stroke();
            });
        });
        cyclePaint.position.set(pos.x - 17.8, 3.5, pos.z + 5);
        cyclePaint.rotation.y = Math.PI / 2;
        cyclePaint.userData = { interactive: true, icon: '🔄', title: 'Cycle de Vie',
            description: '<h3>Analyse du Cycle de Vie</h3><p>L\'ACV mesure l\'impact environnemental d\'un produit de sa création à sa fin de vie. L\'objectif : refermer la boucle.</p>' };
        Controls.addInteractable(cyclePaint);
        g.add(cyclePaint);

        // === UNIQUE WALL ART 3: Pollution Plastique (right wall) ===
        const oceanPaint = EcoUtils.createWallPainting(4, 3, (ctx, w, h) => {
            const ocean = ctx.createLinearGradient(0, 0, 0, h);
            ocean.addColorStop(0, '#0a2a4a'); ocean.addColorStop(1, '#1a4a6a');
            ctx.fillStyle = ocean; ctx.fillRect(0, 0, w, h);
            ctx.font = 'bold 24px Outfit'; ctx.fillStyle = '#ff6b6b'; ctx.textAlign = 'center';
            ctx.fillText('🌊 7e Continent de Plastique', w/2, 35);
            // Floating debris
            const debrisColors = ['#ff6b6b','#ffaa44','#aaaaaa','#ff88cc','#88aacc'];
            for (let i = 0; i < 40; i++) {
                const dx = Math.random() * w;
                const dy = 60 + Math.random() * (h-80);
                ctx.fillStyle = debrisColors[i%5]; ctx.globalAlpha = 0.3 + Math.random()*0.4;
                const s = 3 + Math.random()*8;
                ctx.fillRect(dx, dy, s, s*0.7);
            }
            ctx.globalAlpha = 1;
            ctx.font = 'bold 40px Outfit'; ctx.fillStyle = 'rgba(255,100,100,0.3)';
            ctx.fillText('150M tonnes', w/2, h/2 + 10);
            ctx.font = '16px Inter'; ctx.fillStyle = '#ffaa44';
            ctx.fillText('de plastique dans les océans', w/2, h/2 + 40);
        });
        oceanPaint.position.set(pos.x + 17.8, 3.5, pos.z + 3);
        oceanPaint.rotation.y = -Math.PI / 2;
        oceanPaint.userData = { interactive: true, icon: '🌊', title: 'Pollution Plastique',
            description: '<h3>Urgence Océanique</h3><p>8 millions de tonnes de plastique entrent dans les océans chaque année. D\'ici 2050, il y aura plus de plastique que de poissons.</p>' };
        Controls.addInteractable(oceanPaint);
        g.add(oceanPaint);

        // === SHOWCASE 1: Bacs de Tri Intelligents ===
        const binsShowcase = EcoUtils.createShowcase(7, 4, 3);
        binsShowcase.group.position.set(pos.x - 4, 0, pos.z + 5);
        const binsGr = new THREE.Group();
        binsGr.position.set(0, binsShowcase.baseHeight, 0);
        const binsData = [
            {l:'Plastique', c:0xf1c40f}, {l:'Papier', c:0x3498db},
            {l:'Verre', c:0x2ecc71}, {l:'Organique', c:0xe74c3c}
        ];
        binsData.forEach((b, i) => {
            const binMat = new THREE.MeshStandardMaterial({color: b.c, roughness: 0.15, metalness: 0.6});
            const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 1.3, 16), binMat);
            bMesh.position.set(-2 + i*1.4, 0.65, 0);
            binsGr.add(bMesh);
            const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 16), new THREE.MeshStandardMaterial({color: 0x222222, metalness: 0.9}));
            lid.position.set(-2 + i*1.4, 1.35, 0);
            binsGr.add(lid);
        });
        const binsHitbox = new THREE.Mesh(new THREE.BoxGeometry(7, 4, 3), new THREE.MeshBasicMaterial({visible:false}));
        binsHitbox.position.y = 2;
        binsHitbox.userData = { interactive: true, icon: '♻️', title: 'Points d\'Apport Volontaire',
            description: '<h3>Gestion Intelligente</h3><p>Ces bacs intègrent des capteurs de remplissage IoT pour optimiser les tournées de collecte et réduire les émissions des camions.</p>',
            prototypeFunc: () => { const c = binsGr.clone(); c.position.y = -1; return c; }
        };
        Controls.addInteractable(binsHitbox);
        binsShowcase.group.add(binsGr);
        binsShowcase.group.add(binsHitbox);
        g.add(binsShowcase.group);

        // === SHOWCASE 2: Tapis Roulant Automatisé ===
        const convShowcase = EcoUtils.createShowcase(7, 3.5, 3);
        convShowcase.group.position.set(pos.x + 5, 0, pos.z + 5);
        const convGr = new THREE.Group();
        convGr.position.set(0, convShowcase.baseHeight, 0);
        const belt = new THREE.Mesh(new THREE.BoxGeometry(5, 0.15, 1), new THREE.MeshStandardMaterial({color: 0x111111, roughness: 0.2, metalness: 0.7}));
        belt.position.y = 0.4; convGr.add(belt);
        // Rollers
        for (let i = 0; i < 6; i++) {
            const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 8), new THREE.MeshStandardMaterial({color: 0x555555, metalness: 0.9}));
            roller.position.set(-2.5 + i, 0.25, 0); roller.rotation.x = Math.PI/2;
            convGr.add(roller);
        }
        // Sorting items
        const items = [];
        const itemData = [{c:0xf1c40f, s:0.25},{c:0x3498db, s:0.2},{c:0x2ecc71, s:0.22},{c:0xe74c3c, s:0.18},{c:0xffffff, s:0.2}];
        itemData.forEach((d, i) => {
            const geom = i%2===0 ? new THREE.BoxGeometry(d.s,d.s,d.s) : new THREE.SphereGeometry(d.s/2, 8, 8);
            const item = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({color: d.c, roughness: 0.2}));
            item.position.set(-2 + i*0.9, 0.6, 0);
            convGr.add(item); items.push(item);
        });
        this._anim.items = items;
        const convHitbox = new THREE.Mesh(new THREE.BoxGeometry(7, 3.5, 3), new THREE.MeshBasicMaterial({visible:false}));
        convHitbox.position.y = 1.75;
        convHitbox.userData = { interactive: true, icon: '🏭', title: 'Centre de Tri Automatisé',
            description: '<h3>Le Voyage des Déchets</h3><p>Séparateur électromagnétique (métaux) + trieur optique. Un centre moderne traite 15 tonnes/heure.</p>',
            prototypeFunc: () => {
                const c = convGr.clone(); c.position.y = -0.5;
                c.add(new THREE.PointLight(0x4488ff, 2, 6));
                return c;
            }
        };
        Controls.addInteractable(convHitbox);
        convShowcase.group.add(convGr);
        convShowcase.group.add(convHitbox);
        g.add(convShowcase.group);

        // === INFO PANEL: back wall ===
        const stats = EcoUtils.createInfoPanel('Le Recyclage en Chiffres',
            '• 68% des emballages recyclés en France\n• 30 bouteilles = 1 polaire\n• 1 tonne d\'alu recyclé = 6 tonnes de bauxite\n• Objectif UE 2030 : 70% de recyclage',
            { icon: '📊', accentColor: '#00d4aa', width: 3.5, height: 3.5 });
        stats.position.set(pos.x - 8, 3.5, pos.z + 17.8);
        stats.rotation.y = Math.PI;
        Controls.addInteractable(stats);
        g.add(stats);

        scene.add(g);
    },
    update(time, delta) {
        if (this._anim.items) {
            this._anim.items.forEach(item => {
                item.position.x += 1.2 * (delta || 0.016);
                if (item.position.x > 2.5) item.position.x = -2.5;
                item.rotation.z += 0.04;
                item.rotation.y += 0.02;
            });
        }
    }
};
window.RoomRecycling = RoomRecycling;
