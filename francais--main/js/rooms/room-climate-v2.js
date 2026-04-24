/* ============================================
   ÉcoTech 3D — Room 1: Climat
   Premium gallery with Holographic Simulations
   + La Sphère des Courants & L'Iceberg de Verre
   ============================================ */
const RoomClimate = {
    _anim: { updates: [] },

    build(scene) {
        const pos = Museum.roomPositions.climate;
        const g = new THREE.Group();
        g.name = 'ClimateExhibits';

        // === 1. Thermomètre Mondial (Central Showcase) ===
        const thermoShowcase = EcoUtils.createShowcase(4, 5, 4);
        thermoShowcase.group.position.set(pos.x, 0, pos.z);
        const thGr = new THREE.Group();
        thGr.position.y = thermoShowcase.baseHeight;

        const glassTube = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 16), new THREE.MeshPhysicalMaterial({color: 0xffffff, transmission: 0.9, transparent: true, opacity: 0.3}));
        glassTube.position.y = 1.5;
        const baseBulb = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), new THREE.MeshStandardMaterial({color: 0xff0000, emissive: 0xaa0000}));
        baseBulb.position.y = 0.2;
        const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1, 16), new THREE.MeshStandardMaterial({color: 0xff0000, emissive: 0xcc0000}));
        liquid.position.y = 0.5;
        
        // Degree markers
        const markers = new THREE.Group();
        for(let i=0; i<5; i++) {
            const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.02), new THREE.MeshBasicMaterial({color: 0xffffff}));
            m.position.set(0, 0.8 + i*0.5, 0.2);
            markers.add(m);
        }
        
        thGr.add(glassTube); thGr.add(baseBulb); thGr.add(liquid); thGr.add(markers);
        this._anim.updates.push((time) => {
            const h = 1 + (Math.sin(time*0.5) + 1) * 0.8;
            liquid.scale.y = h;
            liquid.position.y = 0.2 + h/2;
            const heatColor = new THREE.Color().setHSL(0, 1, 0.2 + (h/3)*0.5);
            liquid.material.emissive = heatColor;
            baseBulb.material.emissive = heatColor;
        });

        const thHit = new THREE.Mesh(new THREE.BoxGeometry(4, 5, 4), new THREE.MeshBasicMaterial({visible:false}));
        thHit.position.y = 2.5;
        thHit.userData = { interactive: true, icon: '🌡️', title: 'Le Thermomètre Mondial',
            description: '<h3>Alerte Rouge</h3><p>Depuis l\'ère préindustrielle, la Terre s\'est réchauffée de +1.2°C. À +2°C, 99% des coraux mourront et les canicules extrêmes seront 14 fois plus fréquentes.</p>',
            modelToClone: thGr };
        Controls.addInteractable(thHit);
        thermoShowcase.group.add(thGr);
        thermoShowcase.group.add(thHit);
        g.add(thermoShowcase.group);

        // === 2. La Banquise qui Fond (Showcase) ===
        const iceShowcase = EcoUtils.createShowcase(5, 3.5, 3);
        iceShowcase.group.position.set(pos.x - 8, 0, pos.z + 10);
        const iceGr = new THREE.Group();
        iceGr.position.y = iceShowcase.baseHeight;

        const water = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.2, 32), new THREE.MeshPhysicalMaterial({color: 0x00aaff, transmission: 0.9, transparent: true, opacity: 0.8}));
        water.position.y = 0.1;
        const iceberg = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8, 1), new THREE.MeshPhysicalMaterial({color: 0xffffff, transmission: 0.8, roughness: 0.1, ior: 1.3}));
        iceberg.position.y = 0.6;
        iceGr.add(water); iceGr.add(iceberg);

        this._anim.updates.push((time) => {
            const melt = (Math.sin(time) + 1) / 2;
            iceberg.scale.setScalar(0.4 + (1-melt)*0.6);
            iceberg.position.y = 0.2 + iceberg.scale.y * 0.4;
            water.scale.y = 1 + melt*2;
            water.position.y = 0.1 * water.scale.y;
        });

        const iceHit = new THREE.Mesh(new THREE.BoxGeometry(5, 3.5, 3), new THREE.MeshBasicMaterial({visible:false}));
        iceHit.position.y = 1.75;
        iceHit.userData = { interactive: true, icon: '🧊', title: 'La Banquise qui Fond',
            description: '<h3>Hausse du Niveau de la Mer</h3><p>La fonte du Groenland et de l\'Antarctique contribue à la montée des océans, menaçant 800 millions de personnes vivant en zone côtière d\'ici 2050.</p>',
            modelToClone: iceGr };
        Controls.addInteractable(iceHit);
        iceShowcase.group.add(iceGr);
        iceShowcase.group.add(iceHit);
        g.add(iceShowcase.group);

        // === 3. Voyage dans un Nuage de CO2 (Showcase) ===
        const co2Showcase = EcoUtils.createShowcase(5, 4, 3);
        co2Showcase.group.position.set(pos.x + 8, 0, pos.z - 10);
        const co2Gr = new THREE.Group();
        co2Gr.position.y = co2Showcase.baseHeight;

        const earth = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshStandardMaterial({color: 0x2288ff, roughness: 0.8}));
        earth.position.y = 1.2;
        co2Gr.add(earth);

        const particles = [];
        const pMat = new THREE.MeshBasicMaterial({color: 0x333333, transparent: true, opacity: 0.6});
        const pGeo = new THREE.SphereGeometry(0.05, 4, 4);
        for(let i=0; i<100; i++) {
            const p = new THREE.Mesh(pGeo, pMat);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            p.userData = {theta, phi, speed: 0.5 + Math.random(), dist: 0.9 + Math.random()*0.5};
            co2Gr.add(p);
            particles.push(p);
        }

        this._anim.updates.push((time) => {
            earth.rotation.y = time * 0.2;
            particles.forEach(p => {
                p.userData.theta += p.userData.speed * 0.02;
                const r = p.userData.dist;
                p.position.set(
                    r * Math.sin(p.userData.phi) * Math.cos(p.userData.theta),
                    1.2 + r * Math.cos(p.userData.phi),
                    r * Math.sin(p.userData.phi) * Math.sin(p.userData.theta)
                );
            });
        });

        const co2Hit = new THREE.Mesh(new THREE.BoxGeometry(5, 4, 3), new THREE.MeshBasicMaterial({visible:false}));
        co2Hit.position.y = 2;
        co2Hit.userData = { interactive: true, icon: '☁️', title: 'Nuage de CO₂',
            description: '<h3>Émissions Mondiales</h3><p>L\'humanité émet 36 milliards de tonnes de CO2 par an. Ce gaz invisible s\'accumule dans l\'atmosphère et agit comme une couverture chauffante.</p>',
            modelToClone: co2Gr };
        Controls.addInteractable(co2Hit);
        co2Showcase.group.add(co2Gr);
        co2Showcase.group.add(co2Hit);
        g.add(co2Showcase.group);

        // === 4. Ma Ville en 2100 (Wall Vitrine) ===
        const cityVitrine = EcoUtils.createWallVitrine('Ma Ville en 2100', 
            '<h3>Scénario +4°C</h3><p>À +4°C, des villes comme New York, Shanghai ou Tokyo verront leurs rues transformées en canaux permanents. Le niveau de la mer pourrait monter de 2 mètres.</p>',
            'climate', { icon: '🗺️', accentColor: '#4da6ff', lightColor: 0x4488ff });
        cityVitrine.position.set(pos.x - 17.5, 2.5, pos.z - 5);
        cityVitrine.rotation.y = Math.PI / 2;
        Controls.addInteractable(cityVitrine);
        
        const cityGr = new THREE.Group();
        for(let i=0; i<6; i++) {
            const b = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4+Math.random()*0.6, 0.2), new THREE.MeshStandardMaterial({color: 0x888888}));
            b.position.set((Math.random()-0.5)*0.8, b.geometry.parameters.height/2, (Math.random()-0.5)*0.8);
            cityGr.add(b);
        }
        const flood = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), new THREE.MeshPhysicalMaterial({color: 0x0044ff, transmission: 0.9, transparent: true, opacity: 0.8}));
        flood.rotation.x = -Math.PI/2;
        cityGr.add(flood);
        
        this._anim.updates.push((time) => {
            flood.position.y = 0.1 + ((Math.sin(time)+1)/2) * 0.4;
        });
        
        cityVitrine.children.find(c => c.type === 'Group' && c.children.length>0).add(cityGr);
        cityGr.position.y = -0.5;
        g.add(cityVitrine);

        // ================================================================
        // === 5. 🌊 LA SPHÈRE DES COURANTS (New Art — Central Pedestal) ===
        // ================================================================
        const sphereShowcase = EcoUtils.createShowcase(5, 4.5, 5);
        sphereShowcase.group.position.set(pos.x + 8, 0, pos.z + 10);
        const spGr = new THREE.Group();
        spGr.position.y = sphereShowcase.baseHeight;

        // Translucent ocean globe
        const globeGeo = new THREE.SphereGeometry(1.5, 48, 48);
        const globeMat = new THREE.MeshPhysicalMaterial({
            color: 0x0066aa, transmission: 0.85, transparent: true, opacity: 0.3,
            roughness: 0.05, metalness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.05
        });
        const globe = new THREE.Mesh(globeGeo, globeMat);
        globe.position.y = 1.8;
        spGr.add(globe);

        // Continents (wireframe layer)
        const continentGeo = new THREE.IcosahedronGeometry(1.52, 2);
        const continentMat = new THREE.MeshBasicMaterial({color: 0x2ecc71, wireframe: true, transparent: true, opacity: 0.4});
        const continents = new THREE.Mesh(continentGeo, continentMat);
        continents.position.y = 1.8;
        spGr.add(continents);

        // Ocean current streams (luminous torus rings at different angles)
        const currentColors = [0x00ffcc, 0xff6644, 0x4488ff];
        const currentNames = ['Gulf Stream', 'Kuroshio', 'Courant Circumpolaire'];
        const currents = [];
        currentColors.forEach((cc, i) => {
            const torusGeo = new THREE.TorusGeometry(1.6 + i*0.15, 0.025, 8, 64);
            const torusMat = new THREE.MeshBasicMaterial({color: cc, transparent: true, opacity: 0.8});
            const torus = new THREE.Mesh(torusGeo, torusMat);
            torus.position.y = 1.8;
            torus.rotation.x = 0.3 + i * 0.5;
            torus.rotation.z = i * 0.4;
            spGr.add(torus);
            currents.push(torus);
        });

        // Animated luminous particles flowing along currents
        const flowParticles = [];
        const fpGeo = new THREE.SphereGeometry(0.04, 4, 4);
        for(let i=0; i<40; i++) {
            const ci = i % 3;
            const fp = new THREE.Mesh(fpGeo, new THREE.MeshBasicMaterial({color: currentColors[ci]}));
            fp.userData = { currentIdx: ci, angle: Math.random() * Math.PI * 2, speed: 0.3 + Math.random()*0.5 };
            spGr.add(fp);
            flowParticles.push(fp);
        }

        // Inner glow light
        const sphereLight = new THREE.PointLight(0x0088ff, 1.5, 6);
        sphereLight.position.set(0, 1.8, 0);
        spGr.add(sphereLight);

        this._anim.updates.push((time) => {
            globe.rotation.y = time * 0.15;
            continents.rotation.y = time * 0.15;
            currents.forEach((c, i) => {
                c.rotation.y = time * (0.2 + i*0.1);
            });
            flowParticles.forEach(fp => {
                fp.userData.angle += fp.userData.speed * 0.03;
                const ci = fp.userData.currentIdx;
                const r = 1.6 + ci * 0.15;
                const a = fp.userData.angle;
                const rx = 0.3 + ci * 0.5;
                const rz = ci * 0.4;
                // Approximate position along the torus orbit
                const x = r * Math.cos(a);
                const z = r * Math.sin(a);
                // Apply rotation of the torus
                const cosRx = Math.cos(rx), sinRx = Math.sin(rx);
                const y2 = z * sinRx;
                const z2 = z * cosRx;
                fp.position.set(x, 1.8 + y2, z2);
            });
        });

        const spHit = new THREE.Mesh(new THREE.BoxGeometry(5, 4.5, 5), new THREE.MeshBasicMaterial({visible:false}));
        spHit.position.y = 2.25;
        spHit.userData = { interactive: true, icon: '🌊', title: 'La Sphère des Courants',
            description: '<h3>Les Autoroutes de l\'Océan</h3><p>Le Gulf Stream, le Kuroshio et le Courant Circumpolaire Antarctique régulent le climat mondial. Leur ralentissement dû au réchauffement pourrait plonger l\'Europe dans un froid extrême malgré le réchauffement global.</p>',
            modelToClone: spGr };
        Controls.addInteractable(spHit);
        sphereShowcase.group.add(spGr);
        sphereShowcase.group.add(spHit);
        g.add(sphereShowcase.group);

        // ===========================================================
        // === 6. 🧊 L'ICEBERG DE VERRE (New Art — Suspended Sculpture) ===
        // ===========================================================
        const icebergShowcase = EcoUtils.createShowcase(5, 5, 4);
        icebergShowcase.group.position.set(pos.x - 8, 0, pos.z - 10);
        const ibGr = new THREE.Group();
        ibGr.position.y = icebergShowcase.baseHeight;

        // Main iceberg body — faceted crystal
        const icebergBody = new THREE.Mesh(
            new THREE.DodecahedronGeometry(1.2, 1),
            new THREE.MeshPhysicalMaterial({
                color: 0xccffff, transmission: 0.92, transparent: true, opacity: 0.6,
                roughness: 0.02, metalness: 0.0, ior: 1.31, clearcoat: 1.0,
                clearcoatRoughness: 0.05
            })
        );
        icebergBody.position.y = 2.2;
        icebergBody.scale.set(1, 1.4, 0.8);
        ibGr.add(icebergBody);

        // Inner core glow
        const coreGlow = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.5, 1),
            new THREE.MeshBasicMaterial({color: 0x88ddff, transparent: true, opacity: 0.4})
        );
        coreGlow.position.y = 2.2;
        ibGr.add(coreGlow);

        // Fragmenting ice shards floating around the main body
        const shards = [];
        for(let i=0; i<12; i++) {
            const shard = new THREE.Mesh(
                new THREE.TetrahedronGeometry(0.1 + Math.random()*0.15, 0),
                new THREE.MeshPhysicalMaterial({
                    color: 0xeeffff, transmission: 0.9, transparent: true, opacity: 0.5,
                    roughness: 0.05
                })
            );
            const angle = (i / 12) * Math.PI * 2;
            const radius = 1.0 + Math.random() * 0.8;
            shard.userData = { angle, radius, yOffset: 1.5 + Math.random()*1.5, speed: 0.2 + Math.random()*0.3, drift: Math.random() };
            ibGr.add(shard);
            shards.push(shard);
        }

        // Water pool at the base — the melt
        const meltPool = new THREE.Mesh(
            new THREE.CylinderGeometry(1.5, 1.5, 0.08, 32),
            new THREE.MeshPhysicalMaterial({color: 0x0088cc, transmission: 0.9, transparent: true, opacity: 0.7, roughness: 0.0})
        );
        meltPool.position.y = 0.04;
        ibGr.add(meltPool);

        // Drip particles
        const drips = [];
        const dripGeo = new THREE.SphereGeometry(0.04, 6, 6);
        const dripMat = new THREE.MeshBasicMaterial({color: 0x66ccff, transparent: true, opacity: 0.8});
        for(let i=0; i<6; i++) {
            const drip = new THREE.Mesh(dripGeo, dripMat);
            drip.userData = { phase: Math.random() * Math.PI * 2, x: (Math.random()-0.5)*0.8, z: (Math.random()-0.5)*0.5 };
            ibGr.add(drip);
            drips.push(drip);
        }

        const ibLight = new THREE.PointLight(0x88ddff, 1.2, 5);
        ibLight.position.set(0, 2.5, 0);
        ibGr.add(ibLight);

        this._anim.updates.push((time) => {
            // Iceberg slowly rotates
            icebergBody.rotation.y = time * 0.1;
            coreGlow.rotation.y = -time * 0.15;
            coreGlow.scale.setScalar(0.9 + Math.sin(time*2)*0.1);

            // Fragmentation — shards orbit outward over time
            const fragLevel = (Math.sin(time*0.3)+1)/2; // 0 to 1
            shards.forEach(s => {
                s.userData.angle += s.userData.speed * 0.02;
                const r = s.userData.radius + fragLevel * 0.5;
                s.position.set(
                    Math.cos(s.userData.angle) * r,
                    s.userData.yOffset + Math.sin(time + s.userData.drift*5) * 0.2,
                    Math.sin(s.userData.angle) * r
                );
                s.rotation.x = time * s.userData.speed;
                s.material.opacity = 0.6 - fragLevel * 0.3;
            });

            // Iceberg shrinks as it melts
            const scale = 1.0 - fragLevel * 0.25;
            icebergBody.scale.set(scale, scale * 1.4, scale * 0.8);

            // Melt pool grows
            meltPool.scale.setScalar(0.5 + fragLevel * 1.0);

            // Drips
            drips.forEach(d => {
                const t = (time * 1.5 + d.userData.phase) % 2;
                d.position.set(d.userData.x, 1.0 - t * 0.8, d.userData.z);
                d.material.opacity = t < 1.5 ? 0.8 : 0;
            });
        });

        const ibHit = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 4), new THREE.MeshBasicMaterial({visible:false}));
        ibHit.position.y = 2.5;
        ibHit.userData = { interactive: true, icon: '💎', title: 'L\'Iceberg de Verre',
            description: '<h3>Sculpture Cinétique</h3><p>Cette œuvre cristalline symbolise l\'urgence climatique. L\'iceberg se fragmente lentement, ses éclats s\'éloignent et l\'eau s\'accumule à sa base — un rappel poignant que chaque seconde compte.</p>',
            modelToClone: ibGr };
        Controls.addInteractable(ibHit);
        icebergShowcase.group.add(ibGr);
        icebergShowcase.group.add(ibHit);
        g.add(icebergShowcase.group);

        scene.add(g);
    },
    update(time, delta) {
        this._anim.updates.forEach(fn => fn(time, delta));
    }
};
window.RoomClimate = RoomClimate;
