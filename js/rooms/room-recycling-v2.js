/* ============================================
   ÉcoTech 3D — Room 5: Recyclage
   Premium gallery with Holographic Simulations
   + Sculpture de la Métamorphose & Sablier de Plastique
   ============================================ */
const RoomRecycling = {
    _anim: { updates: [] },

    build(scene) {
        const pos = Museum.roomPositions.recycling;
        const g = new THREE.Group();
        g.name = 'RecyclingExhibits';

        // === 1. Trie ou Perds (Showcase Simulation) ===
        const sortShowcase = EcoUtils.createShowcase(6, 4, 3);
        sortShowcase.group.position.set(pos.x - 10, 0, pos.z + 5);
        const sGr = new THREE.Group();
        sGr.position.y = sortShowcase.baseHeight;

        const binColors = [0xf1c40f, 0x3498db, 0x2ecc71];
        binColors.forEach((c, i) => {
            const b = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 0.8), new THREE.MeshStandardMaterial({color: c, transparent: true, opacity: 0.8}));
            b.position.set(-1.5 + i*1.5, 0.5, 0.5);
            sGr.add(b);
        });

        const armBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4), new THREE.MeshStandardMaterial({color: 0x555555}));
        armBase.position.set(0, 0.2, -0.8);
        const armJoint = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5), new THREE.MeshStandardMaterial({color: 0xcccccc}));
        armJoint.position.set(0, 1, -0.8);
        const armHand = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshStandardMaterial({color: 0xff0000}));
        armHand.position.set(0, 1.6, -0.8);
        sGr.add(armBase); sGr.add(armJoint); sGr.add(armHand);

        const garbage = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshStandardMaterial({color: 0xffffff}));
        sGr.add(garbage);

        this._anim.updates.push((time) => {
            const t = time * 2;
            armJoint.rotation.z = Math.sin(t) * 0.5;
            armHand.position.x = Math.sin(t) * 1.5;
            armHand.position.y = 1.6 + Math.cos(t) * 0.2;
            garbage.position.x = armHand.position.x;
            garbage.position.y = 1.5 - ((time * 3) % 1.5);
            garbage.material.color.setHex(binColors[Math.floor((time)%3)]);
        });

        const sHit = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 3), new THREE.MeshBasicMaterial({visible:false}));
        sHit.position.y = 2;
        sHit.userData = { interactive: true, icon: '🗑️', title: 'Trie ou Perds',
            description: '<h3>Intelligence Artificielle</h3><p>Les centres de tri modernes utilisent des bras robotisés guidés par IA pour trier jusqu\'à 60 déchets par minute avec une précision de 99%.</p>',
            modelToClone: sGr };
        Controls.addInteractable(sHit);
        sortShowcase.group.add(sGr);
        sortShowcase.group.add(sHit);
        g.add(sortShowcase.group);

        // === 2. Combien de temps ? (Wall Vitrine) ===
        const timeVitrine = EcoUtils.createWallVitrine('Décomposition', 
            '<h3>Le Poids du Temps</h3><p>Chaque objet met un temps différent à se décomposer dans la nature.</p>',
            'recycling', { icon: '⏱️', accentColor: '#ff4444', lightColor: 0xffaaaa });
        timeVitrine.position.set(pos.x - 17.5, 2.5, pos.z - 8);
        timeVitrine.rotation.y = Math.PI / 2;
        Controls.addInteractable(timeVitrine);
        const tGr = new THREE.Group();
        const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6), new THREE.MeshPhysicalMaterial({color: 0xaaffff, transmission: 0.9}));
        bottle.position.set(-0.4, 0, 0);
        const cig = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3), new THREE.MeshStandardMaterial({color: 0xffddaa}));
        cig.position.set(0.4, 0, 0);
        tGr.add(bottle); tGr.add(cig);
        this._anim.updates.push((time) => {
            bottle.rotation.y = time; bottle.position.y = Math.sin(time*2)*0.1;
            cig.rotation.x = time*1.5; cig.position.y = Math.cos(time*2)*0.1;
        });
        timeVitrine.children.find(c => c.type === 'Group' && c.children.length>0).add(tGr);
        g.add(timeVitrine);

        // === 3. La Vie Secrète d'une Canette (Showcase) ===
        const cycleShowcase = EcoUtils.createShowcase(5, 3.5, 3);
        cycleShowcase.group.position.set(pos.x + 8, 0, pos.z + 5);
        const cGr = new THREE.Group();
        cGr.position.y = cycleShowcase.baseHeight;
        
        const belt = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.1, 8, 32), new THREE.MeshStandardMaterial({color: 0x222222}));
        belt.rotation.x = Math.PI/2;
        belt.position.y = 0.5;
        cGr.add(belt);

        const cans = [];
        for(let i=0; i<4; i++) {
            const can = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3), new THREE.MeshStandardMaterial({color: 0xaaaaaa, metalness: 0.9}));
            cGr.add(can);
            cans.push(can);
        }
        this._anim.updates.push((time) => {
            cans.forEach((c, i) => {
                const angle = (time * 0.5) + (i * Math.PI/2);
                c.position.set(Math.cos(angle)*1.2, 0.6 + Math.sin(time*5 + i)*0.05, Math.sin(angle)*1.2);
                c.rotation.y = angle;
                if(angle % (Math.PI*2) < Math.PI) c.material.color.setHex(0xaaaaaa);
                else c.material.color.setHex(0xffaa00);
            });
        });

        const cHit = new THREE.Mesh(new THREE.BoxGeometry(5, 3.5, 3), new THREE.MeshBasicMaterial({visible:false}));
        cHit.position.y = 1.75;
        cHit.userData = { interactive: true, icon: '🔄', title: 'Cycle de l\'Aluminium',
            description: '<h3>Recyclage Infini</h3><p>Une canette en aluminium est recyclable à 100% et à l\'infini. Il faut seulement 60 jours pour qu\'une canette recyclée revienne en rayon.</p>',
            modelToClone: cGr };
        Controls.addInteractable(cHit);
        cycleShowcase.group.add(cGr);
        cycleShowcase.group.add(cHit);
        g.add(cycleShowcase.group);

        // === 4. Champions du Recyclage (Wall Chart) ===
        const chartWall = EcoUtils.createWallPainting(6, 3, (ctx, w, h) => {
            ctx.fillStyle = '#0a1a0a'; ctx.fillRect(0, 0, w, h);
            ctx.font = 'bold 30px Outfit'; ctx.fillStyle = '#00d4aa'; ctx.textAlign = 'center';
            ctx.fillText('🌍 CHAMPIONS DU RECYCLAGE', w/2, 40);
            const data = [
                {n:'Allemagne', v:67, c:'#f1c40f'},
                {n:'Corée du Sud', v:60, c:'#3498db'},
                {n:'Autriche', v:59, c:'#e74c3c'},
                {n:'France', v:45, c:'#2ecc71'}
            ];
            const maxW = 400;
            data.forEach((d, i) => {
                const y = 100 + i * 50;
                ctx.font = 'bold 20px Inter'; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'right';
                ctx.fillText(d.n, 180, y+20);
                const barW = (d.v / 70) * maxW;
                ctx.fillStyle = d.c;
                ctx.fillRect(200, y, barW, 30);
                ctx.fillStyle = '#111'; ctx.textAlign = 'left';
                ctx.fillText(d.v + '%', 210, y+22);
            });
        }, { frameColor: 0x1a1a1a });
        chartWall.position.set(pos.x, 3.5, pos.z - 17.8);
        chartWall.userData = { interactive: true, icon: '📊', title: 'Taux de Recyclage',
            description: '<h3>Politiques Performantes</h3><p>L\'Allemagne mène le monde avec des lois strictes sur les emballages et un système de consigne très efficace (Pfandsystem).</p>' };
        Controls.addInteractable(chartWall);
        g.add(chartWall);

        // ===========================================================
        // === 5. 🔄 SCULPTURE DE LA MÉTAMORPHOSE (New Art) ===
        // ===========================================================
        const metaShowcase = EcoUtils.createShowcase(5, 5, 5);
        metaShowcase.group.position.set(pos.x, 0, pos.z + 10);
        const mtGr = new THREE.Group();
        mtGr.position.y = metaShowcase.baseHeight;

        // The morphing object — starts as a can, becomes particles, reforms as bicycle frame
        // Phase 1: Aluminum can
        const canBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16),
            new THREE.MeshStandardMaterial({color: 0xcccccc, metalness: 0.95, roughness: 0.1})
        );
        canBody.position.y = 1.5;
        mtGr.add(canBody);

        // Can label ring
        const canLabel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.31, 0.31, 0.3, 16),
            new THREE.MeshStandardMaterial({color: 0xff4444, metalness: 0.8, roughness: 0.2})
        );
        canLabel.position.y = 1.5;
        mtGr.add(canLabel);

        // Phase 2: Deconstructed particles
        const metaParticles = [];
        const mpGeo = new THREE.TetrahedronGeometry(0.06, 0);
        for(let i=0; i<40; i++) {
            const mp = new THREE.Mesh(mpGeo, new THREE.MeshStandardMaterial({
                color: 0xcccccc, metalness: 0.9, roughness: 0.1,
                emissive: 0x00d4aa, emissiveIntensity: 0.3
            }));
            mp.userData = {
                startAngle: Math.random() * Math.PI * 2,
                startR: Math.random() * 0.3,
                endAngle: Math.random() * Math.PI * 2,
                endR: 0.5 + Math.random() * 1.0,
                endY: 0.5 + Math.random() * 2.5,
                speed: 0.5 + Math.random()
            };
            mtGr.add(mp);
            metaParticles.push(mp);
        }

        // Phase 3: Bicycle frame (simplified wireframe)
        const bikeFrame = new THREE.Group();
        const frameMat = new THREE.MeshStandardMaterial({color: 0x00d4aa, metalness: 0.9, roughness: 0.1, emissive: 0x004422, emissiveIntensity: 0.3});

        // Main tube
        const mainTube = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8), frameMat);
        mainTube.rotation.z = Math.PI/6;
        mainTube.position.set(0, 1.5, 0);
        bikeFrame.add(mainTube);
        // Down tube
        const downTube = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 8), frameMat);
        downTube.rotation.z = -Math.PI/4;
        downTube.position.set(-0.2, 1.2, 0);
        bikeFrame.add(downTube);
        // Seat tube
        const seatTube = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8), frameMat);
        seatTube.position.set(0.2, 1.3, 0);
        bikeFrame.add(seatTube);
        // Wheels
        const wheelGeo = new THREE.TorusGeometry(0.35, 0.02, 8, 24);
        const wheel1 = new THREE.Mesh(wheelGeo, frameMat);
        wheel1.position.set(-0.6, 0.7, 0);
        bikeFrame.add(wheel1);
        const wheel2 = new THREE.Mesh(wheelGeo, frameMat);
        wheel2.position.set(0.6, 0.7, 0);
        bikeFrame.add(wheel2);

        bikeFrame.visible = false;
        mtGr.add(bikeFrame);

        // Circular orbit ring
        const orbitRing = new THREE.Mesh(
            new THREE.TorusGeometry(1.8, 0.01, 8, 64),
            new THREE.MeshBasicMaterial({color: 0x00d4aa, transparent: true, opacity: 0.4})
        );
        orbitRing.position.y = 1.5;
        orbitRing.rotation.x = Math.PI/2;
        mtGr.add(orbitRing);

        const metaLight = new THREE.PointLight(0x00d4aa, 1.0, 5);
        metaLight.position.set(0, 2, 0);
        mtGr.add(metaLight);

        this._anim.updates.push((time) => {
            // 3-phase cycle: can (0-3s), particles (3-6s), bike (6-9s)
            const cycle = time % 9;

            if(cycle < 3) {
                // Phase 1: Show can, hide bike
                canBody.visible = true; canLabel.visible = true; bikeFrame.visible = false;
                canBody.rotation.y = time;
                canLabel.rotation.y = time;
                const dissolve = cycle / 3;
                canBody.material.opacity = 1 - dissolve * 0.5;
                canLabel.material.opacity = 1 - dissolve * 0.5;
                metaParticles.forEach(mp => {
                    const a = mp.userData.startAngle + time;
                    const r = mp.userData.startR * (1 + dissolve * 2);
                    mp.position.set(Math.cos(a)*r, 1.5 + Math.sin(a + time)*0.2, Math.sin(a)*r);
                    mp.material.opacity = dissolve;
                    mp.visible = dissolve > 0.3;
                });
            } else if(cycle < 6) {
                // Phase 2: Particles swirl
                canBody.visible = false; canLabel.visible = false; bikeFrame.visible = false;
                const swirl = (cycle - 3) / 3;
                metaParticles.forEach(mp => {
                    mp.visible = true;
                    const a = mp.userData.endAngle + time * mp.userData.speed;
                    const r = mp.userData.endR * (1 - swirl * 0.5);
                    mp.position.set(Math.cos(a)*r, mp.userData.endY * (1-swirl) + 1.5 * swirl, Math.sin(a)*r);
                    mp.rotation.set(time*2, time*3, 0);
                    mp.material.emissiveIntensity = 0.3 + swirl * 0.7;
                });
            } else {
                // Phase 3: Show bike
                canBody.visible = false; canLabel.visible = false; bikeFrame.visible = true;
                const appear = (cycle - 6) / 3;
                bikeFrame.rotation.y = time * 0.5;
                bikeFrame.scale.setScalar(appear);
                metaParticles.forEach(mp => {
                    mp.visible = appear < 0.8;
                    mp.material.opacity = 1 - appear;
                });
                wheel1.rotation.z = time * 3;
                wheel2.rotation.z = time * 3;
            }

            orbitRing.rotation.z = time * 0.3;
        });

        const mtHit = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshBasicMaterial({visible:false}));
        mtHit.position.y = 2.5;
        mtHit.userData = { interactive: true, icon: '🔄', title: 'Sculpture de la Métamorphose',
            description: '<h3>De Déchet à Ressource</h3><p>Une canette d\'aluminium se déconstruit en particules pour se reformer en cadre de vélo. L\'économie circulaire transforme nos déchets en ressources infinies.</p>',
            modelToClone: mtGr };
        Controls.addInteractable(mtHit);
        metaShowcase.group.add(mtGr);
        metaShowcase.group.add(mtHit);
        g.add(metaShowcase.group);

        // ===========================================================
        // === 6. ⏳ LE SABLIER DE PLASTIQUE (New Art) ===
        // ===========================================================
        const hourglassShowcase = EcoUtils.createShowcase(4, 6, 4);
        hourglassShowcase.group.position.set(pos.x + 8, 0, pos.z - 10);
        const hgGr = new THREE.Group();
        hgGr.position.y = hourglassShowcase.baseHeight;

        // Hourglass frame — two connected cones
        const topCone = new THREE.Mesh(
            new THREE.CylinderGeometry(1.0, 0.08, 2, 16, 1, true),
            new THREE.MeshPhysicalMaterial({color: 0xffffff, transmission: 0.9, transparent: true, opacity: 0.2, side: THREE.DoubleSide, roughness: 0.05})
        );
        topCone.position.y = 3;
        hgGr.add(topCone);

        const bottomCone = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 1.0, 2, 16, 1, true),
            new THREE.MeshPhysicalMaterial({color: 0xffffff, transmission: 0.9, transparent: true, opacity: 0.2, side: THREE.DoubleSide, roughness: 0.05})
        );
        bottomCone.position.y = 1;
        hgGr.add(bottomCone);

        // Metal frame rings
        const ringMat = new THREE.MeshStandardMaterial({color: 0xcccccc, metalness: 0.9, roughness: 0.1});
        const topRing = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.04, 8, 32), ringMat);
        topRing.position.y = 4; topRing.rotation.x = Math.PI/2;
        hgGr.add(topRing);
        const midRing = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.04, 8, 16), ringMat);
        midRing.position.y = 2; midRing.rotation.x = Math.PI/2;
        hgGr.add(midRing);
        const botRing = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.04, 8, 32), ringMat);
        botRing.position.y = 0; botRing.rotation.x = Math.PI/2;
        hgGr.add(botRing);

        // Support pillars
        for(let i=0; i<4; i++) {
            const angle = (i/4) * Math.PI * 2;
            const pillar = new THREE.Mesh(
                new THREE.CylinderGeometry(0.03, 0.03, 4, 8),
                ringMat
            );
            pillar.position.set(Math.cos(angle)*1.0, 2, Math.sin(angle)*1.0);
            hgGr.add(pillar);
        }

        // Falling plastic "bottles" (colored cylinders cascading)
        const plasticItems = [];
        const plasticColors = [0xff4444, 0x4488ff, 0x44ff44, 0xffaa00, 0xff44ff, 0xaaaaaa];
        for(let i=0; i<30; i++) {
            const item = new THREE.Mesh(
                new THREE.CylinderGeometry(0.03, 0.03, 0.12, 6),
                new THREE.MeshStandardMaterial({
                    color: plasticColors[i % plasticColors.length],
                    transparent: true, opacity: 0.85
                })
            );
            item.userData = {
                phase: (i / 30) * Math.PI * 2,
                radius: Math.random() * 0.6,
                speed: 0.3 + Math.random() * 0.7,
                falling: true
            };
            hgGr.add(item);
            plasticItems.push(item);
        }

        // Accumulated pile at the bottom
        const pile = new THREE.Mesh(
            new THREE.ConeGeometry(0.6, 0.4, 12),
            new THREE.MeshStandardMaterial({color: 0x885533, roughness: 0.9})
        );
        pile.position.y = 0.2;
        hgGr.add(pile);

        // Counter display
        const counterCanvas = document.createElement('canvas');
        counterCanvas.width = 256; counterCanvas.height = 64;
        const cCtx = counterCanvas.getContext('2d');
        const counterTex = new THREE.CanvasTexture(counterCanvas);
        const counterMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1.2, 0.3),
            new THREE.MeshBasicMaterial({map: counterTex, transparent: true})
        );
        counterMesh.position.set(0, -0.2, 1.1);
        hgGr.add(counterMesh);

        const hgLight = new THREE.PointLight(0xff8844, 0.8, 5);
        hgLight.position.set(0, 2, 0);
        hgGr.add(hgLight);

        this._anim.updates.push((time) => {
            // Falling plastic items
            plasticItems.forEach(item => {
                const t = (time * item.userData.speed + item.userData.phase) % 4;
                if(t < 3) {
                    // Falls through the neck
                    const progress = t / 3;
                    const y = 3.8 - progress * 3.8;
                    const r = item.userData.radius * (1 - Math.abs(progress - 0.5)*2) * 0.5;
                    const angle = item.userData.phase + time * 2;
                    item.position.set(Math.cos(angle)*r, y, Math.sin(angle)*r);
                    item.rotation.set(time*3, time*2, 0);
                    item.visible = true;
                } else {
                    item.visible = false;
                }
            });

            // Pile grows
            const pileSize = 0.3 + ((Math.sin(time*0.2)+1)/2)*0.5;
            pile.scale.setScalar(pileSize);

            // Update counter (fake real-time stat: ~33,000 bottles/minute globally)
            const elapsed = Math.floor(time);
            const bottlesPerSec = 550;
            const total = elapsed * bottlesPerSec;
            cCtx.clearRect(0, 0, 256, 64);
            cCtx.fillStyle = '#111111'; cCtx.fillRect(0, 0, 256, 64);
            cCtx.fillStyle = '#ff4444'; cCtx.font = 'bold 24px monospace'; cCtx.textAlign = 'center';
            cCtx.fillText(total.toLocaleString(), 128, 28);
            cCtx.fillStyle = '#aaaaaa'; cCtx.font = '12px Inter';
            cCtx.fillText('bouteilles plastiques', 128, 50);
            counterTex.needsUpdate = true;
        });

        const hgHit = new THREE.Mesh(new THREE.BoxGeometry(4, 6, 4), new THREE.MeshBasicMaterial({visible:false}));
        hgHit.position.y = 3;
        hgHit.userData = { interactive: true, icon: '⏳', title: 'Le Sablier de Plastique',
            description: '<h3>La Cascade Infernale</h3><p>Chaque minute, l\'équivalent d\'un camion-poubelle de plastique se déverse dans les océans. Ce sablier visualise en temps réel le flux de pollution plastique mondiale.</p>',
            modelToClone: hgGr };
        Controls.addInteractable(hgHit);
        hourglassShowcase.group.add(hgGr);
        hourglassShowcase.group.add(hgHit);
        g.add(hourglassShowcase.group);

        // Fill wall with info
        const stats = EcoUtils.createInfoPanel('Impact du Recyclage',
            '• 1T papier recyclé = 17 arbres sauvés\n• 1T plastique = 2000L de pétrole évités\n• L\'aluminium recyclé économise 95% d\'énergie',
            { icon: '🌍', accentColor: '#3498db', width: 4, height: 3 });
        stats.position.set(pos.x + 17.8, 3.5, pos.z - 5);
        stats.rotation.y = -Math.PI / 2;
        Controls.addInteractable(stats);
        g.add(stats);

        scene.add(g);
    },
    update(time, delta) {
        this._anim.updates.forEach(fn => fn(time, delta));
    }
};
window.RoomRecycling = RoomRecycling;
