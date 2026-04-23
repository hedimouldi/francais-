/* ============================================
   ÉcoTech 3D — Room 3: Villes Durables
   Premium gallery with Holographic Simulations
   + Diorama Ville Éponge & Immeuble Respirant
   ============================================ */
const RoomCities = {
    _anim: { updates: [] },

    build(scene) {
        const pos = Museum.roomPositions.cities;
        const g = new THREE.Group();
        g.name = 'CitiesExhibits';

        // === 1. Marche dans la Ville 2100 (Central Showcase) ===
        const futureShowcase = EcoUtils.createShowcase(6, 4, 4);
        futureShowcase.group.position.set(pos.x, 0, pos.z);
        const fGr = new THREE.Group();
        fGr.position.y = futureShowcase.baseHeight;

        const street = new THREE.Mesh(new THREE.PlaneGeometry(5, 3), new THREE.MeshStandardMaterial({color: 0x333333}));
        street.rotation.x = -Math.PI/2;
        fGr.add(street);

        for(let i=0; i<8; i++) {
            const h = 0.5 + Math.random()*1.5;
            const b = new THREE.Mesh(new THREE.BoxGeometry(0.6, h, 0.6), new THREE.MeshStandardMaterial({color: 0xdddddd, roughness: 0.2, metalness: 0.8}));
            const z = -1 + Math.random()*2;
            const x = (i%2===0) ? -1.5 : 1.5;
            b.position.set(x, h/2, z);
            fGr.add(b);
            const roof = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.6), new THREE.MeshStandardMaterial({color: 0x2ecc71}));
            roof.position.set(x, h+0.025, z);
            fGr.add(roof);
        }

        const cars = [];
        for(let i=0; i<3; i++) {
            const car = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.4), new THREE.MeshStandardMaterial({color: 0x00ffff, emissive: 0x00aaaa}));
            fGr.add(car);
            cars.push({mesh: car, offset: i, speed: 1+Math.random()});
        }

        this._anim.updates.push((time) => {
            cars.forEach(c => {
                c.mesh.position.set(
                    Math.sin(time*c.speed + c.offset)*1.2,
                    0.4 + Math.cos(time*2 + c.offset)*0.2,
                    (time*c.speed + c.offset*2)%3 - 1.5
                );
            });
        });

        const fHit = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 4), new THREE.MeshBasicMaterial({visible:false}));
        fHit.position.y = 2;
        fHit.userData = { interactive: true, icon: '🚶', title: 'Ville de 2100',
            description: '<h3>L\'Utopie Réalisable</h3><p>Les villes de demain intégreront l\'agriculture verticale, des matériaux bio-sourcés, et des transports autonomes électriques. 80% des trajets se feront en mobilité douce.</p>',
            modelToClone: fGr };
        Controls.addInteractable(fHit);
        futureShowcase.group.add(fGr);
        futureShowcase.group.add(fHit);
        g.add(futureShowcase.group);

        // === 2. Construis Ta Ville (Showcase) ===
        const buildShowcase = EcoUtils.createShowcase(5, 3.5, 3);
        buildShowcase.group.position.set(pos.x - 8, 0, pos.z + 10);
        const bGr = new THREE.Group();
        bGr.position.y = buildShowcase.baseHeight;

        const grid = new THREE.Group();
        const mats = [
            new THREE.MeshStandardMaterial({color: 0x555555}),
            new THREE.MeshStandardMaterial({color: 0x27ae60})
        ];
        const blocks = [];
        for(let x=-1; x<=1; x++) {
            for(let z=-1; z<=1; z++) {
                const block = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.6), mats[0]);
                block.position.set(x*0.7, 0.2, z*0.7);
                grid.add(block);
                blocks.push(block);
            }
        }
        bGr.add(grid);

        this._anim.updates.push((time) => {
            const greenCount = Math.floor(((Math.sin(time*0.5)+1)/2) * 10);
            blocks.forEach((b, i) => {
                if(i < greenCount) {
                    b.material = mats[1]; b.scale.y = 0.2; b.position.y = 0.1;
                } else {
                    b.material = mats[0]; b.scale.y = 1; b.position.y = 0.2;
                }
            });
        });

        const bHit = new THREE.Mesh(new THREE.BoxGeometry(5, 3.5, 3), new THREE.MeshBasicMaterial({visible:false}));
        bHit.position.y = 1.75;
        bHit.userData = { interactive: true, icon: '🏗️', title: 'Planification Urbaine IA',
            description: '<h3>Simulateur de Durabilité</h3><p>Remplacer le béton par des parcs réduit l\'effet d\'îlot de chaleur urbain de 4°C et améliore la qualité de l\'air de 20%.</p>',
            modelToClone: bGr };
        Controls.addInteractable(bHit);
        buildShowcase.group.add(bGr);
        buildShowcase.group.add(bHit);
        g.add(buildShowcase.group);

        // === 3. Comparatif Mondial (Wall Vitrine) ===
        const radarVitrine = EcoUtils.createWallVitrine('Comparatif Mondial', 
            '<h3>Villes Contrastées</h3><p>Singapour excelle en espaces verts (City in a Garden), Paris transforme sa mobilité (Ville du quart d\'heure), tandis que Dubaï fait face à des défis d\'empreinte carbone et d\'eau.</p>',
            'cities', { icon: '📊', accentColor: '#9b59b6', lightColor: 0xdd99ff, width: 3.5 });
        radarVitrine.position.set(pos.x + 17.5, 2.5, pos.z - 5);
        radarVitrine.rotation.y = -Math.PI / 2;
        Controls.addInteractable(radarVitrine);
        
        const rGr = new THREE.Group();
        const colors = [0x3498db, 0xf1c40f, 0x2ecc71];
        const radars = [];
        for(let i=0; i<3; i++) {
            const rad = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.05, 6), new THREE.MeshStandardMaterial({color: colors[i], wireframe: true}));
            rad.position.set(-0.8 + i*0.8, 0, 0);
            rad.rotation.x = Math.PI/4;
            rGr.add(rad);
            radars.push(rad);
        }
        this._anim.updates.push((time) => {
            radars.forEach((r, i) => {
                r.rotation.y = time * 0.5 + i;
                r.scale.setScalar(0.8 + Math.sin(time*2 + i)*0.2);
            });
        });
        radarVitrine.children.find(c => c.type === 'Group' && c.children.length>0).add(rGr);
        rGr.position.y = -0.5;
        g.add(radarVitrine);

        // === 4. Le Quartier qui Respire (Showcase) ===
        const breathShowcase = EcoUtils.createShowcase(5, 4, 3);
        breathShowcase.group.position.set(pos.x + 8, 0, pos.z - 10);
        const brGr = new THREE.Group();
        brGr.position.y = breathShowcase.baseHeight;

        const baseMat = new THREE.MeshStandardMaterial({color: 0x444444});
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), baseMat);
        ground.rotation.x = -Math.PI/2;
        brGr.add(ground);

        const treeGeo = new THREE.ConeGeometry(0.2, 0.6, 8);
        const treeMat = new THREE.MeshStandardMaterial({color: 0x2ecc71});
        const trees = [];
        for(let i=0; i<12; i++) {
            const t = new THREE.Mesh(treeGeo, treeMat);
            t.position.set((Math.random()-0.5)*1.6, 0.3, (Math.random()-0.5)*1.6);
            brGr.add(t);
            trees.push(t);
        }

        this._anim.updates.push((time) => {
            const breath = (Math.sin(time) + 1) / 2;
            const color = new THREE.Color(0x444444).lerp(new THREE.Color(0x27ae60), breath);
            baseMat.color = color;
            trees.forEach(t => {
                t.scale.y = 0.1 + breath * 0.9;
                t.position.y = t.scale.y * 0.3;
            });
        });

        const brHit = new THREE.Mesh(new THREE.BoxGeometry(5, 4, 3), new THREE.MeshBasicMaterial({visible:false}));
        brHit.position.y = 2;
        brHit.userData = { interactive: true, icon: '🌱', title: 'Le Quartier qui Respire',
            description: '<h3>Désimperméabilisation</h3><p>Remplacer l\'asphalte par de la pleine terre permet à l\'eau de pluie de s\'infiltrer, prévient les inondations et recrée de la biodiversité locale.</p>',
            modelToClone: brGr };
        Controls.addInteractable(brHit);
        breathShowcase.group.add(brGr);
        breathShowcase.group.add(brHit);
        g.add(breathShowcase.group);

        // ===========================================================
        // === 5. 🌧️ DIORAMA VILLE ÉPONGE (New Art) ===
        // ===========================================================
        const spongeShowcase = EcoUtils.createShowcase(6, 4.5, 5);
        spongeShowcase.group.position.set(pos.x - 8, 0, pos.z - 10);
        const spGr = new THREE.Group();
        spGr.position.y = spongeShowcase.baseHeight;

        // LEFT SIDE: Permeable soil with rain gardens
        const permeableGround = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.5), new THREE.MeshStandardMaterial({color: 0x3d6b2e}));
        permeableGround.rotation.x = -Math.PI/2;
        permeableGround.position.set(-1.2, 0.01, 0);
        spGr.add(permeableGround);

        // Rain garden depressions
        for(let i=0; i<3; i++) {
            const garden = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.1, 8), new THREE.MeshStandardMaterial({color: 0x1a5e1a}));
            garden.position.set(-1.2 + (i-1)*0.6, 0.05, (i-1)*0.8);
            spGr.add(garden);
            // Mini plants in gardens
            for(let j=0; j<3; j++) {
                const plant = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 6), new THREE.MeshStandardMaterial({color: 0x2ecc71}));
                plant.position.set(-1.2 + (i-1)*0.6 + (j-1)*0.1, 0.2, (i-1)*0.8);
                spGr.add(plant);
            }
        }

        // Soil cross-section layers
        const soilLayer1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 3.5), new THREE.MeshStandardMaterial({color: 0x5a3d1a}));
        soilLayer1.position.set(-1.2, -0.15, 0);
        spGr.add(soilLayer1);
        const soilLayer2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.2, 3.5), new THREE.MeshStandardMaterial({color: 0x8B7355}));
        soilLayer2.position.set(-1.2, -0.4, 0);
        spGr.add(soilLayer2);

        // Water infiltration arrows (blue cylinders going down)
        const arrows = [];
        for(let i=0; i<5; i++) {
            const arrow = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.02, 0.5),
                new THREE.MeshBasicMaterial({color: 0x3498db, transparent: true, opacity: 0.8})
            );
            arrow.position.set(-1.2 + (Math.random()-0.5)*1.5, 0, (Math.random()-0.5)*2.5);
            spGr.add(arrow);
            arrows.push(arrow);
        }

        // RIGHT SIDE: Concrete — flooded
        const concreteGround = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.5), new THREE.MeshStandardMaterial({color: 0x666666}));
        concreteGround.rotation.x = -Math.PI/2;
        concreteGround.position.set(1.2, 0.01, 0);
        spGr.add(concreteGround);

        // Concrete buildings
        for(let i=0; i<3; i++) {
            const cb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6 + i*0.2, 0.5), new THREE.MeshStandardMaterial({color: 0x888888}));
            cb.position.set(1.2 + (i-1)*0.6, (0.6 + i*0.2)/2, (i-1)*0.8);
            spGr.add(cb);
        }

        // Flood water on the concrete side
        const floodWater = new THREE.Mesh(
            new THREE.PlaneGeometry(2.2, 3.5),
            new THREE.MeshPhysicalMaterial({color: 0x2244aa, transmission: 0.85, transparent: true, opacity: 0.6})
        );
        floodWater.rotation.x = -Math.PI/2;
        floodWater.position.set(1.2, 0.05, 0);
        spGr.add(floodWater);

        // Divider line
        const divider = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.5, 3.5), new THREE.MeshBasicMaterial({color: 0xffffff}));
        divider.position.set(0, 0.75, 0);
        spGr.add(divider);

        // Rain drops
        const rainDrops = [];
        const rdGeo = new THREE.SphereGeometry(0.025, 4, 4);
        const rdMat = new THREE.MeshBasicMaterial({color: 0x88bbff, transparent: true, opacity: 0.7});
        for(let i=0; i<30; i++) {
            const rd = new THREE.Mesh(rdGeo, rdMat);
            rd.userData = { x: (Math.random()-0.5)*4.5, z: (Math.random()-0.5)*3, speed: 1 + Math.random()*2, phase: Math.random()*2 };
            spGr.add(rd);
            rainDrops.push(rd);
        }

        this._anim.updates.push((time) => {
            // Rain animation
            rainDrops.forEach(rd => {
                const t = (time * rd.userData.speed + rd.userData.phase) % 2;
                rd.position.set(rd.userData.x, 2.5 - t * 1.5, rd.userData.z);
                rd.material.opacity = t < 1.5 ? 0.7 : 0;
            });

            // Infiltration arrows pulse
            arrows.forEach((a, i) => {
                const t = (time * 1.5 + i * 0.3) % 1.5;
                a.position.y = 0.3 - t * 0.5;
                a.material.opacity = Math.max(0, 0.8 - t * 0.6);
            });

            // Flood water rises
            floodWater.position.y = 0.05 + ((Math.sin(time*0.8)+1)/2) * 0.2;
        });

        const spHit = new THREE.Mesh(new THREE.BoxGeometry(6, 4.5, 5), new THREE.MeshBasicMaterial({visible:false}));
        spHit.position.y = 2.25;
        spHit.userData = { interactive: true, icon: '🌧️', title: 'La Ville Éponge',
            description: '<h3>Sols Perméables vs Béton</h3><p>Gauche : les jardins de pluie absorbent l\'eau via des sols perméables. Droite : le béton imperméable cause des inondations. Les villes éponges réduisent les risques d\'inondation de 70%.</p>',
            modelToClone: spGr };
        Controls.addInteractable(spHit);
        spongeShowcase.group.add(spGr);
        spongeShowcase.group.add(spHit);
        g.add(spongeShowcase.group);

        // ===========================================================
        // === 6. 🏢 L'IMMEUBLE RESPIRANT (New Art — Wall Vitrine) ===
        // ===========================================================
        const breathVitrine = EcoUtils.createWallVitrine('L\'Immeuble Respirant',
            '<h3>Architecture Bioclimatique</h3><p>Les façades végétales s\'ouvrent et se ferment selon l\'exposition solaire pour réguler naturellement la température intérieure, réduisant la consommation d\'énergie de 40%.</p>',
            'cities', { icon: '🏢', accentColor: '#2ecc71', lightColor: 0x44ff88 });
        breathVitrine.position.set(pos.x - 17.5, 2.5, pos.z - 5);
        breathVitrine.rotation.y = Math.PI / 2;
        Controls.addInteractable(breathVitrine);

        const imGr = new THREE.Group();

        // Building core
        const buildingCore = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 1.6, 0.4),
            new THREE.MeshStandardMaterial({color: 0xdddddd, roughness: 0.3, metalness: 0.5})
        );
        buildingCore.position.y = 0.8;
        imGr.add(buildingCore);

        // Green facade panels that open/close
        const facadePanels = [];
        for(let floor=0; floor<4; floor++) {
            for(let side=-1; side<=1; side+=2) {
                const panel = new THREE.Mesh(
                    new THREE.BoxGeometry(0.02, 0.3, 0.35),
                    new THREE.MeshStandardMaterial({color: 0x27ae60, emissive: 0x114422, emissiveIntensity: 0.3})
                );
                panel.position.set(side * 0.31, 0.2 + floor * 0.38, 0);
                imGr.add(panel);
                facadePanels.push({ mesh: panel, side, floor });
            }
        }

        // Rooftop garden
        const roofGarden = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.45), new THREE.MeshStandardMaterial({color: 0x1a8c3a}));
        roofGarden.position.y = 1.63;
        imGr.add(roofGarden);

        // Mini trees on roof
        for(let i=0; i<3; i++) {
            const mt = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.15, 6), new THREE.MeshStandardMaterial({color: 0x2ecc71}));
            mt.position.set(-0.2 + i*0.2, 1.74, 0);
            imGr.add(mt);
        }

        this._anim.updates.push((time) => {
            // Facade panels open and close based on "sunlight"
            facadePanels.forEach(fp => {
                const sunExposure = (Math.sin(time * 0.8 + fp.floor * 0.5) + 1) / 2;
                const openAngle = sunExposure * 0.6;
                fp.mesh.rotation.y = fp.side > 0 ? openAngle : -openAngle;
            });
        });

        breathVitrine.children.find(c => c.type === 'Group' && c.children.length>0).add(imGr);
        imGr.position.y = -0.5;
        g.add(breathVitrine);

        scene.add(g);
    },
    update(time, delta) {
        this._anim.updates.forEach(fn => fn(time, delta));
    }
};
window.RoomCities = RoomCities;
