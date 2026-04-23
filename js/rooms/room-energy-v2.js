/* ============================================
   ÉcoTech 3D — Room 2: Énergies
   Premium gallery with Holographic Simulations
   + La Turbine Éthérée & L'Arbre Solaire
   ============================================ */
const RoomEnergy = {
    _anim: { updates: [] },

    build(scene) {
        const pos = Museum.roomPositions.energy;
        const g = new THREE.Group();
        g.name = 'EnergyExhibits';

        // === 1. Produis Ton Énergie (Central Showcase) ===
        const mixShowcase = EcoUtils.createShowcase(6, 4, 4);
        mixShowcase.group.position.set(pos.x, 0, pos.z);
        const mGr = new THREE.Group();
        mGr.position.y = mixShowcase.baseHeight;

        const city = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 1.5), new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
        city.position.set(0, 0.25, 0);
        mGr.add(city);

        const solar = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), new THREE.MeshStandardMaterial({color: 0x0044ff, metalness: 0.8}));
        solar.rotation.x = -Math.PI/4; solar.position.set(-1.5, 0.4, -1);
        mGr.add(solar);

        const windBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1), new THREE.MeshStandardMaterial({color: 0xffffff}));
        windBase.position.set(1.5, 0.5, -1);
        const windBlades = new THREE.Group();
        for(let i=0; i<3; i++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.02), new THREE.MeshStandardMaterial({color: 0xffffff}));
            blade.position.y = 0.3;
            const pivot = new THREE.Group();
            pivot.add(blade);
            pivot.rotation.z = i * Math.PI*2/3;
            windBlades.add(pivot);
        }
        windBlades.position.set(1.5, 1, -0.9);
        mGr.add(windBase); mGr.add(windBlades);

        const beamL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2), new THREE.MeshBasicMaterial({color: 0x00ffcc, transparent: true, opacity: 0.8}));
        beamL.position.set(-0.75, 0.3, -0.5); beamL.rotation.z = Math.PI/2; beamL.rotation.y = -Math.PI/6;
        const beamR = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2), new THREE.MeshBasicMaterial({color: 0x00ffcc, transparent: true, opacity: 0.8}));
        beamR.position.set(0.75, 0.3, -0.5); beamR.rotation.z = Math.PI/2; beamR.rotation.y = Math.PI/6;
        mGr.add(beamL); mGr.add(beamR);

        this._anim.updates.push((time) => {
            windBlades.rotation.z -= 0.05;
            const pulse = (Math.sin(time*5)+1)/2;
            beamL.material.opacity = 0.2 + pulse*0.8;
            beamR.material.opacity = 0.2 + pulse*0.8;
            city.material.emissive.setHex(pulse > 0.5 ? 0x222200 : 0x000000);
        });

        const mHit = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 4), new THREE.MeshBasicMaterial({visible:false}));
        mHit.position.y = 2;
        mHit.userData = { interactive: true, icon: '⚡', title: 'Le Mix Énergétique',
            description: '<h3>Équilibre Réseau</h3><p>Une ville 100% renouvelable nécessite de combiner l\'éolien, le solaire, l\'hydraulique et le stockage par batteries pour garantir du courant H24.</p>',
            modelToClone: mGr };
        Controls.addInteractable(mHit);
        mixShowcase.group.add(mGr);
        mixShowcase.group.add(mHit);
        g.add(mixShowcase.group);

        // === 2. 24h de Soleil (Showcase) ===
        const sunShowcase = EcoUtils.createShowcase(4, 3.5, 3);
        sunShowcase.group.position.set(pos.x - 8, 0, pos.z + 10);
        const snGr = new THREE.Group();
        snGr.position.y = sunShowcase.baseHeight;

        const sun = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), new THREE.MeshStandardMaterial({color: 0xffdd00, emissive: 0xffaa00, emissiveIntensity: 2}));
        sun.position.set(-1.2, 1.2, 0);
        const house = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.6), new THREE.MeshStandardMaterial({color: 0xffffff}));
        house.position.set(1.2, 0.25, 0);
        const houseRoof = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.4, 4), new THREE.MeshStandardMaterial({color: 0x4444ff, metalness: 0.8}));
        houseRoof.position.set(1.2, 0.7, 0); houseRoof.rotation.y = Math.PI/4;
        
        const photon = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshBasicMaterial({color: 0xffffff}));
        snGr.add(sun); snGr.add(house); snGr.add(houseRoof); snGr.add(photon);

        this._anim.updates.push((time) => {
            const t = (time * 1.5) % 2;
            photon.position.lerpVectors(sun.position, houseRoof.position, t / 2);
            photon.visible = t < 1.9;
        });

        const snHit = new THREE.Mesh(new THREE.BoxGeometry(4, 3.5, 3), new THREE.MeshBasicMaterial({visible:false}));
        snHit.position.y = 1.75;
        snHit.userData = { interactive: true, icon: '🌞', title: 'Le Voyage du Photon',
            description: '<h3>Une source inépuisable</h3><p>La lumière met 8 minutes à voyager du Soleil à la Terre. En 1 heure, la Terre reçoit assez d\'énergie solaire pour alimenter l\'humanité pendant 1 an.</p>',
            modelToClone: snGr };
        Controls.addInteractable(snHit);
        sunShowcase.group.add(snGr);
        sunShowcase.group.add(snHit);
        g.add(sunShowcase.group);

        // === 3. La Bataille des Énergies (Wall Vitrine) ===
        const battleVitrine = EcoUtils.createWallVitrine('Bataille des Énergies', 
            '<h3>Densité Énergétique</h3><p>Pour produire 1 kWh d\'électricité, il faut soit 300g de charbon (très polluant), soit 0.00001g d\'uranium, soit 1 heure d\'ensoleillement sur 5m² de panneaux.</p>',
            'energy', { icon: '🔋', accentColor: '#e67e22', lightColor: 0xffaa44, width: 3.5 });
        battleVitrine.position.set(pos.x + 17.5, 2.5, pos.z - 5);
        battleVitrine.rotation.y = -Math.PI / 2;
        Controls.addInteractable(battleVitrine);
        
        const bGr = new THREE.Group();
        const coal = new THREE.Mesh(new THREE.DodecahedronGeometry(0.3, 0), new THREE.MeshStandardMaterial({color: 0x111111, roughness: 0.9}));
        coal.position.set(-0.8, 0, 0);
        const uranium = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1}));
        uranium.position.set(0, 0, 0);
        const panel = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), new THREE.MeshStandardMaterial({color: 0x004488, metalness: 0.8}));
        panel.position.set(0.8, 0, 0); panel.rotation.x = -Math.PI/4;
        
        bGr.add(coal); bGr.add(uranium); bGr.add(panel);
        this._anim.updates.push((time) => {
            coal.rotation.y = time*0.5; uranium.rotation.y = time*2; panel.rotation.z = Math.sin(time)*0.2;
        });
        
        battleVitrine.children.find(c => c.type === 'Group' && c.children.length>0).add(bGr);
        bGr.position.y = -0.5;
        g.add(battleVitrine);

        // === 4. Carte des Ressources (Wall Painting) ===
        const resourceMap = EcoUtils.createWallPainting(6, 3, (ctx, w, h) => {
            ctx.fillStyle = '#0a1a3a'; ctx.fillRect(0, 0, w, h);
            ctx.font = 'bold 36px Outfit'; ctx.fillStyle = '#ffcc00'; ctx.textAlign = 'center';
            ctx.fillText('CARTE DES RESSOURCES MONDIALES', w/2, 50);
            ctx.fillStyle = '#335588';
            for(let i=0; i<300; i++) {
                ctx.beginPath();
                ctx.arc(Math.random()*w, 100 + Math.random()*(h-150), 3+Math.random()*4, 0, Math.PI*2);
                ctx.fill();
            }
            const sunGrad = ctx.createRadialGradient(0,0,0, 0,0,50);
            sunGrad.addColorStop(0, 'rgba(255, 200, 0, 0.8)'); sunGrad.addColorStop(1, 'rgba(255, 200, 0, 0)');
            [[w*0.4, h*0.5], [w*0.8, h*0.7], [w*0.2, h*0.4]].forEach(p => {
                ctx.save(); ctx.translate(p[0], p[1]); ctx.fillStyle = sunGrad;
                ctx.beginPath(); ctx.arc(0,0, 50, 0, Math.PI*2); ctx.fill(); ctx.restore();
            });
            ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 4; ctx.lineCap = 'round';
            [[w*0.45, h*0.3], [w*0.3, h*0.8]].forEach(p => {
                ctx.beginPath(); ctx.moveTo(p[0]-20, p[1]); ctx.lineTo(p[0]+20, p[1]); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(p[0]-10, p[1]+10); ctx.lineTo(p[0]+30, p[1]+10); ctx.stroke();
            });
            ctx.font = '20px Inter'; ctx.fillStyle = '#ffffff';
            ctx.fillText('🟡 Solaire Extrême   〰️ Éolien Fort', w/2, h - 30);
        }, { frameColor: 0x222222 });
        resourceMap.position.set(pos.x - 17.8, 3.5, pos.z - 5);
        resourceMap.rotation.y = Math.PI / 2;
        resourceMap.userData = { interactive: true, icon: '🗺️', title: 'Gisement Naturel',
            description: '<h3>Potentiel Local</h3><p>La transition énergétique nécessite d\'adapter la technologie à la géographie : éolien offshore en mer du Nord, solaire thermique au Sahara, géothermie en Islande.</p>' };
        Controls.addInteractable(resourceMap);
        g.add(resourceMap);

        // ===========================================================
        // === 5. 💨 LA TURBINE ÉTHÉRÉE (New Art — Transparent Wind Turbine) ===
        // ===========================================================
        const turbineShowcase = EcoUtils.createShowcase(5, 5, 5);
        turbineShowcase.group.position.set(pos.x + 8, 0, pos.z + 10);
        const tGr = new THREE.Group();
        tGr.position.y = turbineShowcase.baseHeight;

        // Transparent tower
        const tower = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.15, 3, 16),
            new THREE.MeshPhysicalMaterial({color: 0xffffff, transmission: 0.85, transparent: true, opacity: 0.3, roughness: 0.05})
        );
        tower.position.y = 1.5;
        tGr.add(tower);

        // Nacelle (hub)
        const nacelle = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 16, 16),
            new THREE.MeshPhysicalMaterial({color: 0xeeeeff, transmission: 0.7, transparent: true, opacity: 0.5, roughness: 0.05})
        );
        nacelle.position.y = 3.1;
        tGr.add(nacelle);

        // Three ethereal blades
        const bladeGroup = new THREE.Group();
        bladeGroup.position.y = 3.1;
        const bladeMat = new THREE.MeshPhysicalMaterial({
            color: 0xccddff, transmission: 0.8, transparent: true, opacity: 0.4,
            roughness: 0.05, clearcoat: 1.0
        });
        for(let i=0; i<3; i++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.4, 0.15), bladeMat);
            blade.position.y = 0.7;
            const pivot = new THREE.Group();
            pivot.add(blade);
            pivot.rotation.z = i * Math.PI*2/3;
            bladeGroup.add(pivot);
        }
        tGr.add(bladeGroup);

        // Luminous particle trails behind each blade
        const trailParticles = [];
        const tpGeo = new THREE.SphereGeometry(0.03, 4, 4);
        for(let i=0; i<60; i++) {
            const tp = new THREE.Mesh(tpGeo, new THREE.MeshBasicMaterial({
                color: new THREE.Color().setHSL(0.55 + Math.random()*0.1, 1, 0.7),
                transparent: true, opacity: 0.8
            }));
            tp.userData = { bladeIdx: i % 3, trail: Math.floor(i/3), age: Math.random() };
            tGr.add(tp);
            trailParticles.push(tp);
        }

        // Energy flow beam from turbine to grid
        const gridBeam = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 3),
            new THREE.MeshBasicMaterial({color: 0xffdd00, transparent: true, opacity: 0.6})
        );
        gridBeam.position.set(0, 0.5, 0);
        gridBeam.rotation.z = Math.PI/4;
        tGr.add(gridBeam);

        // Mini grid node
        const gridNode = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.2, 1),
            new THREE.MeshStandardMaterial({color: 0x00d4aa, emissive: 0x00d4aa, emissiveIntensity: 0.5, wireframe: true})
        );
        gridNode.position.set(1.5, -0.5, 0);
        tGr.add(gridNode);

        const turbLight = new THREE.PointLight(0x88aaff, 1.0, 5);
        turbLight.position.set(0, 3.5, 0);
        tGr.add(turbLight);

        this._anim.updates.push((time) => {
            bladeGroup.rotation.z -= 0.06;
            trailParticles.forEach(tp => {
                const bi = tp.userData.bladeIdx;
                const baseAngle = bladeGroup.rotation.z + bi * Math.PI*2/3;
                const trailDist = (tp.userData.trail * 0.08 + tp.userData.age * 0.5);
                const r = 0.3 + trailDist * 1.0;
                tp.position.set(
                    Math.cos(baseAngle - trailDist*0.5) * r,
                    3.1 + Math.sin(baseAngle - trailDist*0.5) * r,
                    trailDist * 0.1
                );
                tp.material.opacity = Math.max(0, 0.8 - trailDist * 0.15);
            });
            gridBeam.material.opacity = 0.3 + Math.sin(time*6)*0.3;
            gridNode.rotation.y = time;
            gridNode.scale.setScalar(0.9 + Math.sin(time*3)*0.1);
        });

        const tHit = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshBasicMaterial({visible:false}));
        tHit.position.y = 2.5;
        tHit.userData = { interactive: true, icon: '💨', title: 'La Turbine Éthérée',
            description: '<h3>Art Cinétique Éolien</h3><p>Cette éolienne transparente et artistique génère des traînées de photons lumineux à chaque rotation. L\'énergie invisible du vent est transformée en lumière pure, voyageant vers un Grid Intelligent.</p>',
            modelToClone: tGr };
        Controls.addInteractable(tHit);
        turbineShowcase.group.add(tGr);
        turbineShowcase.group.add(tHit);
        g.add(turbineShowcase.group);

        // ===========================================================
        // === 6. 🌳 L'ARBRE SOLAIRE INTERACTIF (New Art) ===
        // ===========================================================
        const treeShowcase = EcoUtils.createShowcase(5, 5, 5);
        treeShowcase.group.position.set(pos.x - 8, 0, pos.z - 10);
        const trGr = new THREE.Group();
        trGr.position.y = treeShowcase.baseHeight;

        // Trunk — organic form
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.2, 2.5, 8),
            new THREE.MeshStandardMaterial({color: 0x8B6914, roughness: 0.9})
        );
        trunk.position.y = 1.25;
        trGr.add(trunk);

        // Branches — 3 levels
        const branchMat = new THREE.MeshStandardMaterial({color: 0x6d5311, roughness: 0.8});
        const branches = [];
        for(let level = 0; level < 3; level++) {
            const h = 1.5 + level * 0.5;
            const count = 3 + level;
            for(let i=0; i<count; i++) {
                const angle = (i / count) * Math.PI * 2 + level * 0.5;
                const branch = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.02, 0.04, 0.6 + level*0.2, 6),
                    branchMat
                );
                branch.position.set(Math.cos(angle)*0.3, h, Math.sin(angle)*0.3);
                branch.rotation.z = Math.cos(angle) * 0.8;
                branch.rotation.x = Math.sin(angle) * 0.8;
                trGr.add(branch);
                branches.push(branch);
            }
        }

        // Photovoltaic leaves — hexagonal panels
        const leaves = [];
        const leafColors = [0x002266, 0x003399, 0x004488];
        for(let level = 0; level < 3; level++) {
            const h = 1.8 + level * 0.5;
            const count = 5 + level * 2;
            const radius = 0.5 + level * 0.3;
            for(let i=0; i<count; i++) {
                const angle = (i / count) * Math.PI * 2 + level * 0.3;
                const leaf = new THREE.Mesh(
                    new THREE.CircleGeometry(0.12, 6),
                    new THREE.MeshStandardMaterial({
                        color: leafColors[level], metalness: 0.9, roughness: 0.15,
                        emissive: 0x001122, emissiveIntensity: 0.3
                    })
                );
                leaf.position.set(Math.cos(angle)*radius, h + Math.random()*0.2, Math.sin(angle)*radius);
                leaf.rotation.x = -Math.PI/3 + Math.random()*0.3;
                leaf.rotation.y = angle;
                trGr.add(leaf);
                leaves.push(leaf);
            }
        }

        // Sap flow — glowing particles inside the trunk
        const sapParticles = [];
        const sapGeo = new THREE.SphereGeometry(0.025, 4, 4);
        const sapMat = new THREE.MeshBasicMaterial({color: 0xffdd00, transparent: true, opacity: 0.9});
        for(let i=0; i<15; i++) {
            const sp = new THREE.Mesh(sapGeo, sapMat.clone());
            sp.userData = { phase: Math.random() * Math.PI * 2, speed: 0.5 + Math.random()*0.5 };
            trGr.add(sp);
            sapParticles.push(sp);
        }

        const treeSunLight = new THREE.PointLight(0xffdd44, 1.5, 5);
        treeSunLight.position.set(0, 3.5, 0);
        trGr.add(treeSunLight);

        this._anim.updates.push((time) => {
            // Leaves glow when hit by "sun"
            const sunAngle = time * 0.5;
            leaves.forEach((leaf, i) => {
                const exposure = (Math.sin(sunAngle + i*0.3) + 1) / 2;
                leaf.material.emissiveIntensity = 0.1 + exposure * 0.8;
            });

            // Sap flow
            sapParticles.forEach(sp => {
                const t = (time * sp.userData.speed + sp.userData.phase) % 3;
                const yPos = t / 3 * 3.0;
                const wobble = Math.sin(time * 3 + sp.userData.phase) * 0.03;
                sp.position.set(wobble, yPos, wobble);
                sp.material.opacity = yPos < 2.5 ? 0.9 : 0.3;
            });
        });

        const trHit = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshBasicMaterial({visible:false}));
        trHit.position.y = 2.5;
        trHit.userData = { interactive: true, icon: '🌳', title: 'L\'Arbre Solaire',
            description: '<h3>Bio-Mimétisme Énergétique</h3><p>Inspiré de la photosynthèse, cet arbre artistique possède des feuilles photovoltaïques hexagonales. La \"sève électrique\" lumineuse illumine le tronc, montrant comment la nature inspire la technologie verte.</p>',
            modelToClone: trGr };
        Controls.addInteractable(trHit);
        treeShowcase.group.add(trGr);
        treeShowcase.group.add(trHit);
        g.add(treeShowcase.group);

        scene.add(g);
    },
    update(time, delta) {
        this._anim.updates.forEach(fn => fn(time, delta));
    }
};
window.RoomEnergy = RoomEnergy;
