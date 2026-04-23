/* ============================================
   ÉcoTech 3D — Room 4: Biodiversité
   Premium gallery with Holographic Simulations
   + La Forêt Fantôme & Mural Corallien Dynamique
   ============================================ */
const RoomBiodiversity = {
    _anim: { updates: [] },

    build(scene) {
        const pos = Museum.roomPositions.biodiversity;
        const g = new THREE.Group();
        g.name = 'BiodiversityExhibits';

        // === 1. Le Compte à Rebours des Espèces (Wall Painting) ===
        const countdownWall = EcoUtils.createWallPainting(6, 3, (ctx, w, h) => {
            ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, w, h);
            ctx.font = 'bold 36px Outfit'; ctx.fillStyle = '#ff4444'; ctx.textAlign = 'center';
            ctx.fillText('LE COMPTE À REBOURS DES ESPÈCES', w/2, 50);
            const now = new Date();
            const extinctToday = Math.floor((now.getHours() * 60 + now.getMinutes()) / 10);
            ctx.font = 'bold 120px monospace'; ctx.fillStyle = '#ff0000';
            ctx.fillText(extinctToday.toString().padStart(3, '0'), w/2, h/2 + 30);
            ctx.font = '20px Inter'; ctx.fillStyle = '#aaaaaa';
            ctx.fillText('Espèces éteintes aujourd\'hui', w/2, h/2 + 80);
        }, { frameColor: 0x111111 });
        countdownWall.position.set(pos.x, 3.5, pos.z - 17.8);
        countdownWall.userData = { interactive: true, icon: '⏱️', title: 'Le Compte à Rebours',
            description: '<h3>Extinction de Masse</h3><p>La 6ème extinction est en cours. Une espèce disparaît environ toutes les 10 minutes à cause des activités humaines.</p>',
            prototypeFunc: () => {
                const gr = new THREE.Group();
                const dodo = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 0.5), new THREE.MeshStandardMaterial({color: 0x885533, wireframe: true, transparent: true, opacity: 0.8}));
                gr.add(dodo);
                return gr;
            }
        };
        Controls.addInteractable(countdownWall);
        g.add(countdownWall);

        // === 2. L'Aquarium Vivant vs Mort (Showcase) ===
        const aquariumShowcase = EcoUtils.createShowcase(6, 4, 3);
        aquariumShowcase.group.position.set(pos.x - 10, 0, pos.z + 5);
        const aqGr = new THREE.Group();
        aqGr.position.y = aquariumShowcase.baseHeight;
        
        const tank = new THREE.Mesh(new THREE.BoxGeometry(5.8, 2, 2.8), new THREE.MeshPhysicalMaterial({color: 0x4488ff, transmission: 0.9, transparent: true, opacity: 0.4, depthWrite: false}));
        tank.position.y = 1;
        aqGr.add(tank);

        const aliveCoral = new THREE.Group();
        for(let i=0; i<15; i++) {
            const c = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 0.5+Math.random()), new THREE.MeshStandardMaterial({color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5)}));
            c.position.set(-2.5 + Math.random()*2.2, 0.25, -1 + Math.random()*2);
            c.rotation.set(Math.random()-0.5, 0, Math.random()-0.5);
            aliveCoral.add(c);
        }
        aliveCoral.position.y = 0.1;
        aqGr.add(aliveCoral);

        const deadCoral = new THREE.Group();
        for(let i=0; i<15; i++) {
            const c = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 0.5+Math.random()), new THREE.MeshStandardMaterial({color: 0xdddddd, roughness: 1}));
            c.position.set(0.3 + Math.random()*2.2, 0.25, -1 + Math.random()*2);
            c.rotation.set(Math.random()-0.5, 0, Math.random()-0.5);
            deadCoral.add(c);
        }
        deadCoral.position.y = 0.1;
        aqGr.add(deadCoral);

        const aqHit = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 3), new THREE.MeshBasicMaterial({visible:false}));
        aqHit.position.y = 2;
        aqHit.userData = { interactive: true, icon: '🌊', title: 'Récif Corallien',
            description: '<h3>Vivant vs Mort</h3><p>Le réchauffement et l\'acidification des océans provoquent le blanchissement des coraux. 50% des récifs ont déjà disparu.</p>',
            modelToClone: aqGr };
        Controls.addInteractable(aqHit);
        aquariumShowcase.group.add(aqGr);
        aquariumShowcase.group.add(aqHit);
        g.add(aquariumShowcase.group);

        // === 3. Plonge dans le Sol (Wall Vitrine) ===
        const soilVitrine = EcoUtils.createWallVitrine('Plonge dans le Sol', 
            '<h3>Le Monde Invisible</h3><p>1m² de sol sain contient des milliards d\'organismes (vers, champignons, bactéries) vitaux pour les écosystèmes.</p>',
            'biodiversity', { icon: '🔍', accentColor: '#8B4513', lightColor: 0x8B4513 });
        soilVitrine.position.set(pos.x + 10, 2.5, pos.z - 17.5);
        Controls.addInteractable(soilVitrine);
        const soilGr = new THREE.Group();
        const dirt = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 1.2), new THREE.MeshStandardMaterial({color: 0x3d2314, roughness: 0.9}));
        const worm = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 8, 16, Math.PI), new THREE.MeshStandardMaterial({color: 0xff99aa}));
        worm.position.set(0, 0.3, 0); worm.rotation.x = -Math.PI/2;
        soilGr.add(dirt); soilGr.add(worm);
        this._anim.updates.push((t) => { worm.scale.x = 1 + Math.sin(t*2)*0.1; });
        soilVitrine.children.find(c => c.type === 'Group' && c.children.length>0).add(soilGr);
        soilGr.position.y = -0.5;
        g.add(soilVitrine);

        // === 4. Le Silence des Forêts (Showcase) ===
        const forestShowcase = EcoUtils.createShowcase(6, 4, 4);
        forestShowcase.group.position.set(pos.x + 8, 0, pos.z + 5);
        const forestGr = new THREE.Group();
        forestGr.position.y = forestShowcase.baseHeight;
        
        const forestBase = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.2, 32), new THREE.MeshStandardMaterial({color: 0x27ae60}));
        forestGr.add(forestBase);

        const forestTrees = [];
        const waves = [];
        for(let i=0; i<30; i++) {
            const tx = (Math.random()-0.5)*3;
            const tz = (Math.random()-0.5)*3;
            if (tx*tx + tz*tz > 3) continue;
            const t = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 8), new THREE.MeshStandardMaterial({color: 0x1e8449}));
            t.position.set(tx, 0.4, tz);
            forestGr.add(t);
            forestTrees.push(t);
            const wave = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.15, 16), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, side: THREE.DoubleSide}));
            wave.position.copy(t.position); wave.position.y += 0.4; wave.rotation.x = Math.PI/2;
            forestGr.add(wave);
            waves.push({mesh: wave, phase: Math.random()*Math.PI*2, active: true});
        }
        
        this._anim.updates.push((time) => {
            waves.forEach((w, i) => {
                if(!w.active) return;
                w.mesh.scale.setScalar(1 + (time*2 + w.phase)%2);
                w.mesh.material.opacity = 1 - ((time*2 + w.phase)%2)/2;
                if ((time*0.5) > i && w.active) {
                    w.active = false;
                    w.mesh.visible = false;
                    forestTrees[i].material.color.setHex(0x554433);
                    forestTrees[i].position.y = 0.1;
                    forestTrees[i].scale.y = 0.2;
                }
            });
        });

        const fHit = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 4), new THREE.MeshBasicMaterial({visible:false}));
        fHit.position.y = 2;
        fHit.userData = { interactive: true, icon: '🎵', title: 'Le Silence des Forêts',
            description: '<h3>Perte d\'Habitat</h3><p>La déforestation silencieuse vide nos forêts de leur faune. Observez les ondes sonores disparaître avec les arbres coupés.</p>',
            modelToClone: forestGr };
        Controls.addInteractable(fHit);
        forestShowcase.group.add(forestGr);
        forestShowcase.group.add(fHit);
        g.add(forestShowcase.group);

        // ===========================================================
        // === 5. 👻 LA FORÊT FANTÔME (New Art — Holographic Installation) ===
        // ===========================================================
        const ghostShowcase = EcoUtils.createShowcase(6, 5, 5);
        ghostShowcase.group.position.set(pos.x, 0, pos.z + 10);
        const ghGr = new THREE.Group();
        ghGr.position.y = ghostShowcase.baseHeight;

        // Dark forest floor
        const darkFloor = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.1, 32), new THREE.MeshStandardMaterial({color: 0x111a11}));
        ghGr.add(darkFloor);

        // Dead tree trunks (bare, pale)
        for(let i=0; i<8; i++) {
            const angle = (i/8) * Math.PI * 2;
            const r = 1.0 + Math.random()*0.8;
            const trunk = new THREE.Mesh(
                new THREE.CylinderGeometry(0.04, 0.06, 1.5 + Math.random(), 6),
                new THREE.MeshStandardMaterial({color: 0x554433, roughness: 0.9})
            );
            trunk.position.set(Math.cos(angle)*r, 0.8, Math.sin(angle)*r);
            ghGr.add(trunk);
            // Bare branches
            const branch = new THREE.Mesh(
                new THREE.CylinderGeometry(0.015, 0.03, 0.5, 4),
                new THREE.MeshStandardMaterial({color: 0x443322})
            );
            branch.position.set(Math.cos(angle)*r + 0.1, 1.2 + Math.random()*0.3, Math.sin(angle)*r);
            branch.rotation.z = (Math.random()-0.5)*1.5;
            ghGr.add(branch);
        }

        // Holographic animal silhouettes (wireframe, glowing, fragile)
        const animalShapes = [
            { geo: new THREE.ConeGeometry(0.3, 0.8, 4), name: 'Loup', y: 0.5 },    // Wolf (abstracted)
            { geo: new THREE.SphereGeometry(0.25, 8, 6), name: 'Hibou', y: 1.8 },   // Owl
            { geo: new THREE.BoxGeometry(0.5, 0.3, 0.8), name: 'Renard', y: 0.3 },  // Fox
            { geo: new THREE.CylinderGeometry(0.15, 0.2, 0.6, 6), name: 'Cerf', y: 0.6 }, // Deer
            { geo: new THREE.DodecahedronGeometry(0.2, 0), name: 'Papillon', y: 1.5 }  // Butterfly
        ];

        const ghosts = [];
        animalShapes.forEach((shape, i) => {
            const angle = (i / animalShapes.length) * Math.PI * 2 + 0.3;
            const r = 0.6 + Math.random() * 0.5;
            const ghost = new THREE.Mesh(shape.geo, new THREE.MeshBasicMaterial({
                color: 0x88ffaa, wireframe: true, transparent: true, opacity: 0.7
            }));
            ghost.position.set(Math.cos(angle)*r, shape.y, Math.sin(angle)*r);
            ghGr.add(ghost);

            // Glow halo around each ghost
            const halo = new THREE.Mesh(
                new THREE.SphereGeometry(0.35, 8, 8),
                new THREE.MeshBasicMaterial({color: 0x44ff88, transparent: true, opacity: 0.1})
            );
            halo.position.copy(ghost.position);
            ghGr.add(halo);

            ghosts.push({ mesh: ghost, halo, baseOpacity: 0.7, angle, phase: Math.random()*Math.PI*2 });
        });

        // Atmospheric fog particles
        const fogParticles = [];
        const fogGeo = new THREE.SphereGeometry(0.08, 4, 4);
        for(let i=0; i<20; i++) {
            const fog = new THREE.Mesh(fogGeo, new THREE.MeshBasicMaterial({color: 0x224422, transparent: true, opacity: 0.15}));
            fog.position.set((Math.random()-0.5)*4, 0.5 + Math.random()*2, (Math.random()-0.5)*4);
            fog.userData = { speed: 0.1 + Math.random()*0.2, phase: Math.random()*Math.PI*2 };
            ghGr.add(fog);
            fogParticles.push(fog);
        }

        const ghostLight = new THREE.PointLight(0x44ff88, 0.8, 6);
        ghostLight.position.set(0, 2, 0);
        ghGr.add(ghostLight);

        this._anim.updates.push((time) => {
            ghosts.forEach((gh, i) => {
                // Ghosts flicker and pulse
                const flicker = Math.sin(time * 2 + gh.phase) * 0.3 + 0.5;
                gh.mesh.material.opacity = flicker;
                gh.halo.material.opacity = flicker * 0.15;
                gh.mesh.rotation.y = time * 0.3 + gh.phase;
                // Float gently
                gh.mesh.position.y = animalShapes[i].y + Math.sin(time + gh.phase)*0.1;
                gh.halo.position.y = gh.mesh.position.y;
            });
            // Fog drifts
            fogParticles.forEach(f => {
                f.position.x += Math.sin(time * f.userData.speed + f.userData.phase) * 0.005;
                f.position.z += Math.cos(time * f.userData.speed) * 0.005;
            });
            ghostLight.intensity = 0.5 + Math.sin(time*1.5)*0.3;
        });

        const ghHit = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 5), new THREE.MeshBasicMaterial({visible:false}));
        ghHit.position.y = 2.5;
        ghHit.userData = { interactive: true, icon: '👻', title: 'La Forêt Fantôme',
            description: '<h3>Mémoire du Vivant</h3><p>Des silhouettes holographiques d\'animaux menacés hantent une forêt morte. Si l\'activité humaine continue, ces espèces ne seront bientôt plus que des fantômes numériques.</p>',
            modelToClone: ghGr };
        Controls.addInteractable(ghHit);
        ghostShowcase.group.add(ghGr);
        ghostShowcase.group.add(ghHit);
        g.add(ghostShowcase.group);

        // ===========================================================
        // === 6. 🐠 MURAL CORALLIEN DYNAMIQUE (New Art — Wall Installation) ===
        // ===========================================================
        const coralVitrine = EcoUtils.createWallVitrine('Mural Corallien',
            '<h3>Écosystème Sous-Marin</h3><p>Les récifs coralliens couvrent 0.1% de l\'océan mais abritent 25% de la vie marine. Chaque espèce joue un rôle essentiel dans l\'équilibre de l\'écosystème.</p>',
            'biodiversity', { icon: '🐠', accentColor: '#00aaff', lightColor: 0x0088cc });
        coralVitrine.position.set(pos.x - 17.8, 2.5, pos.z - 5);
        coralVitrine.rotation.y = Math.PI / 2;
        Controls.addInteractable(coralVitrine);

        const crGr = new THREE.Group();

        // Vibrant coral structures
        const coralColors = [0xff4466, 0xff8800, 0xffcc00, 0x44ddaa, 0x8844ff, 0xff44aa];
        for(let i=0; i<12; i++) {
            const coral = new THREE.Mesh(
                new THREE.CylinderGeometry(0.01 + Math.random()*0.03, 0.04 + Math.random()*0.04, 0.3 + Math.random()*0.4, 6),
                new THREE.MeshStandardMaterial({
                    color: coralColors[i % coralColors.length],
                    emissive: coralColors[i % coralColors.length],
                    emissiveIntensity: 0.3
                })
            );
            coral.position.set((Math.random()-0.5)*1.2, -0.3 + Math.random()*0.2, (Math.random()-0.5)*0.6);
            coral.rotation.set((Math.random()-0.5)*0.5, 0, (Math.random()-0.5)*0.5);
            crGr.add(coral);
        }

        // Fish (small swimming shapes)
        const fish = [];
        for(let i=0; i<6; i++) {
            const fishBody = new THREE.Mesh(
                new THREE.ConeGeometry(0.04, 0.15, 4),
                new THREE.MeshStandardMaterial({
                    color: new THREE.Color().setHSL(Math.random(), 0.9, 0.6),
                    emissive: new THREE.Color().setHSL(Math.random(), 0.5, 0.3),
                    emissiveIntensity: 0.4
                })
            );
            fishBody.rotation.z = Math.PI/2;
            fishBody.userData = { angle: Math.random()*Math.PI*2, speed: 0.5 + Math.random()*1, radius: 0.3 + Math.random()*0.3, y: -0.2 + Math.random()*0.6 };
            crGr.add(fishBody);
            fish.push(fishBody);
        }

        // Sea anemone (waving tentacles)
        const tentacles = [];
        for(let i=0; i<5; i++) {
            const t = new THREE.Mesh(
                new THREE.CylinderGeometry(0.01, 0.015, 0.3, 4),
                new THREE.MeshStandardMaterial({color: 0xff6688, emissive: 0xff2244, emissiveIntensity: 0.3})
            );
            t.position.set(-0.3 + i*0.15, -0.15, 0.2);
            crGr.add(t);
            tentacles.push(t);
        }

        this._anim.updates.push((time) => {
            fish.forEach(f => {
                f.userData.angle += f.userData.speed * 0.03;
                f.position.set(
                    Math.cos(f.userData.angle) * f.userData.radius,
                    f.userData.y + Math.sin(time*2)*0.05,
                    Math.sin(f.userData.angle) * f.userData.radius
                );
                f.rotation.y = -f.userData.angle + Math.PI/2;
            });
            tentacles.forEach((t, i) => {
                t.rotation.x = Math.sin(time*2 + i*0.5) * 0.4;
                t.rotation.z = Math.cos(time*1.5 + i*0.3) * 0.2;
            });
        });

        coralVitrine.children.find(c => c.type === 'Group' && c.children.length>0).add(crGr);
        crGr.position.y = -0.5;
        g.add(coralVitrine);

        scene.add(g);
    },
    update(time, delta) {
        this._anim.updates.forEach(fn => fn(time, delta));
    }
};
window.RoomBiodiversity = RoomBiodiversity;
