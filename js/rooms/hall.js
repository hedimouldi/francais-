/* ============================================
   ÉcoTech 3D — Central Hall
   Dark luxury gallery — cleaned layout
   ============================================ */

const HallRoom = {
    _globe: null,
    _rings: [],
    _doors: [],

    build(scene) {
        const pos = Museum.roomPositions.hall;
        const group = new THREE.Group();
        group.name = 'HallExhibits';

        // === CENTRAL GLOBE (on pedestal) ===
        const globeGroup = new THREE.Group();
        globeGroup.position.set(pos.x, 0, pos.z);

        // Pedestal
        const pedestal = EcoUtils.createPedestal(1.8, 1.2, 1.8, 0x222222);
        globeGroup.add(pedestal);

        // Globe
        const globeGeo = new THREE.SphereGeometry(1.5, 64, 64);
        const globeTexture = EcoUtils.createCanvasTexture(1024, 512, (ctx, w, h) => {
            ctx.fillStyle = '#1a5a8a'; ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#1a7a4a';
            ctx.beginPath(); ctx.ellipse(550, 240, 55, 95, 0.1, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(520, 140, 45, 35, 0.3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(250, 180, 35, 110, 0.1, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(220, 300, 45, 75, 0.3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(700, 160, 90, 55, 0.2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(800, 340, 35, 25, 0.4, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
            for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(i*(w/12), 0); ctx.lineTo(i*(w/12), h); ctx.stroke(); }
            for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(0, i*(h/6)); ctx.lineTo(w, i*(h/6)); ctx.stroke(); }
        });

        const globeMat = new THREE.MeshStandardMaterial({ map: globeTexture, roughness: 0.35, metalness: 0.15 });
        const globe = new THREE.Mesh(globeGeo, globeMat);
        globe.position.y = 2.8;
        globe.userData = {
            interactive: true, icon: '🌍', title: 'Globe Terrestre',
            description: '<p><strong>Bienvenue au Musée ÉcoTech 3D</strong></p><p>Explorez 5 salles thématiques :</p><ul style="padding-left:20px;margin:8px 0;"><li>🌿 Climat</li><li>⚡ Énergies</li><li>🏙️ Villes durables</li><li>🌳 Biodiversité</li><li>♻️ Recyclage</li></ul>',
        };
        Controls.addInteractable(globe);
        globeGroup.add(globe);
        this._globe = globe;

        // Rings
        const ring1 = EcoUtils.createGlowRing(1.8, 0x2dfdff, 0.02);
        ring1.rotation.x = Math.PI / 2; ring1.position.y = 2.8;
        globeGroup.add(ring1);
        const ring2 = EcoUtils.createGlowRing(2.1, 0xff2bd6, 0.015);
        ring2.rotation.x = Math.PI / 3; ring2.rotation.z = Math.PI / 4; ring2.position.y = 2.8;
        globeGroup.add(ring2);
        this._rings = [ring1, ring2];

        // Spotlight on globe
        const globeSpot = new THREE.SpotLight(0xffffff, 1.5, 10, Math.PI / 5, 0.5);
        globeSpot.position.set(0, 7, 0); globeSpot.target = globe;
        globeGroup.add(globeSpot); globeGroup.add(globeSpot.target);

        group.add(globeGroup);

        // === WALL ART (carefully placed away from doors) ===
        // Back wall (z=+19.5): doors at z=-10 and z=+10 — place art in center
        const artworks = [
            { draw: this._drawOceanArt, x: -19.5, z: -14, rotY: Math.PI / 2, title: 'Océan Vivant', desc: 'Les océans produisent 50% de l\'oxygène et absorbent 25% du CO₂.' },
            { draw: this._drawForestArt, x: -19.5, z: 14, rotY: Math.PI / 2, title: 'Forêt Tropicale', desc: 'Les forêts couvrent 31% des terres et abritent 80% de la biodiversité terrestre.' },
            { draw: this._drawSunsetArt, x: 8, z: 19.5, rotY: Math.PI, title: 'Coucher de Soleil', desc: 'La beauté de notre planète nous rappelle pourquoi nous devons la protéger.' },
        ];

        artworks.forEach(art => {
            const painting = EcoUtils.createWallPainting(3.5, 2.5, art.draw);
            painting.position.set(pos.x + art.x, 3.5, pos.z + art.z);
            painting.rotation.y = art.rotY;
            painting.userData = { interactive: true, icon: '🖼️', title: art.title, description: '<p>' + art.desc + '</p>' };
            Controls.addInteractable(painting);
            group.add(painting);
        });

        // === ODD PANELS (on BACK wall, away from front doors) ===
        const odds = [
            { num: 7, title: 'Énergie propre', color: '#fcc30b' },
            { num: 11, title: 'Villes durables', color: '#f99d26' },
            { num: 12, title: 'Conso responsable', color: '#cf8d2a' },
            { num: 13, title: 'Action climatique', color: '#48773e' },
            { num: 14, title: 'Vie aquatique', color: '#0a97d9' },
            { num: 15, title: 'Vie terrestre', color: '#5dbb46' },
        ];
        odds.forEach((odd, i) => {
            const oddPainting = EcoUtils.createWallPainting(1.8, 2.2, (ctx, w, h) => {
                ctx.fillStyle = '#111111'; ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = odd.color; ctx.fillRect(0, 0, w, 70);
                ctx.font = 'bold 56px Outfit'; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
                ctx.fillText('ODD ' + odd.num, w/2, 52);
                ctx.font = 'bold 28px Outfit'; ctx.fillStyle = odd.color;
                ctx.fillText(odd.title, w/2, 130);
            }, { frameColor: 0x444444 });
            // Place along back wall (z=+19.5), spread out, avoiding center door
            const spacing = 5.5;
            const startX = -(odds.length - 1) * spacing / 2;
            oddPainting.position.set(pos.x + startX + i * spacing, 3.5, pos.z + 19.5);
            oddPainting.rotation.y = Math.PI;
            group.add(oddPainting);
        });

        // === LUXURY DOORS at each room entrance ===
        this._buildLuxuryDoor(group, pos.x - 20, 0, pos.z, 'x', '🌿 Climat');
        this._buildLuxuryDoor(group, pos.x + 20, 0, pos.z, 'x', '⚡ Énergies');
        this._buildLuxuryDoor(group, pos.x, 0, pos.z + 20, 'z', '🏙️ Villes');
        this._buildLuxuryDoor(group, pos.x - 10, 0, pos.z - 20, 'z', '🌳 Biodiversité');
        this._buildLuxuryDoor(group, pos.x + 10, 0, pos.z - 20, 'z', '♻️ Recyclage');

        scene.add(group);
    },

    // === LUXURY DOOR BUILDER ===
    _buildLuxuryDoor(parent, x, y, z, axis, label) {
        const doorGroup = new THREE.Group();
        doorGroup.position.set(x, y, z);

        const doorH = 5.2;
        const doorW = 2.2; // Width of one panel
        const gap = 0.05;

        const doorMat = new THREE.MeshStandardMaterial({
            color: 0x0f1630,
            emissive: 0x2b6bff,
            emissiveIntensity: 0.1,
            roughness: 0.28,
            metalness: 0.55,
        });
        const edgeMat = new THREE.MeshStandardMaterial({
            color: 0x2dfdff,
            emissive: 0x2dfdff,
            emissiveIntensity: 0.9,
            roughness: 0.15,
            metalness: 0.85,
        });

        // Left Hinge and Door
        const leftHinge = new THREE.Group();
        leftHinge.position.set(-doorW - gap, 0, 0); // Position at left edge
        const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH, 0.12), doorMat);
        leftDoor.position.set(doorW/2, doorH/2, 0); // Offset geometry
        leftHinge.add(leftDoor);

        // Right Hinge and Door
        const rightHinge = new THREE.Group();
        rightHinge.position.set(doorW + gap, 0, 0); // Position at right edge
        const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH, 0.12), doorMat);
        rightDoor.position.set(-doorW/2, doorH/2, 0); // Offset geometry
        rightHinge.add(rightDoor);

        // Neon handle bars
        const handleMat = new THREE.MeshStandardMaterial({
            color: 0x2dfdff,
            emissive: 0x2dfdff,
            emissiveIntensity: 0.85,
            roughness: 0.15,
            metalness: 0.9,
        });
        const lHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 8), handleMat);
        lHandle.position.set(doorW - 0.3, doorH/2, 0.08); leftDoor.add(lHandle);
        const rHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 8), handleMat);
        rHandle.position.set(-doorW + 0.3, doorH/2, 0.08); rightDoor.add(rHandle);

        // Neon decorative panels on each door
        const panelMat = new THREE.MeshStandardMaterial({
            color: 0xff2bd6,
            emissive: 0xff2bd6,
            emissiveIntensity: 0.6,
            roughness: 0.22,
            metalness: 0.72,
        });
        [-1, 1].forEach(side => {
            const door = side === -1 ? leftDoor : rightDoor;
            const sign = side === -1 ? 1 : -1;
            for (let row = 0; row < 3; row++) {
                const panel = new THREE.Mesh(
                    new THREE.BoxGeometry(doorW * 0.7, doorH * 0.22, 0.02),
                    panelMat
                );
                // Center the panel on the door width
                panel.position.set(0, doorH * 0.2 + row * doorH * 0.3, 0.07);
                door.add(panel);
            }
        });

        const leftEdgeStrip = new THREE.Mesh(new THREE.BoxGeometry(doorW, 0.03, 0.03), edgeMat);
        leftEdgeStrip.position.set(doorW / 2, doorH - 0.12, 0.08);
        leftDoor.add(leftEdgeStrip);
        const rightEdgeStrip = new THREE.Mesh(new THREE.BoxGeometry(doorW, 0.03, 0.03), edgeMat);
        rightEdgeStrip.position.set(-doorW / 2, doorH - 0.12, 0.08);
        rightDoor.add(rightEdgeStrip);

        // Rotate for axis
        if (axis === 'x') {
            doorGroup.rotation.y = Math.PI / 2;
        }

        doorGroup.add(leftHinge);
        doorGroup.add(rightHinge);

        // Door label above
        const labelSprite = EcoUtils.createTextSprite(label, {
            fontSize: 32, fontWeight: 'bold', color: '#8fdfff',
            bgColor: 'rgba(8,14,34,0.88)', padding: 12, scale: 0.008,
        });
        labelSprite.position.set(0, doorH + 0.5, 0);
        doorGroup.add(labelSprite);

        // Interaction hitbox
        const hitbox = new THREE.Mesh(new THREE.BoxGeometry(doorW*2 + 0.5, doorH, 1.5), new THREE.MeshBasicMaterial({visible: false}));
        hitbox.position.y = doorH/2;
        
        // Store door refs for animation
        const doorRef = {
            left: leftHinge,
            right: rightHinge,
            open: false,
            angle: 0,
            targetAngle: 0,
            glowMats: [doorMat, edgeMat, handleMat, panelMat],
        };
        this._doors.push(doorRef);

        hitbox.userData = {
            interactive: true, icon: '🚪', title: label,
            description: '<h3>Accès Salle</h3><p>Appuyez sur E pour ouvrir ou fermer cette porte.</p>',
            onInteract: () => {
                doorRef.open = !doorRef.open;
                doorRef.targetAngle = doorRef.open ? -Math.PI / 2 + 0.1 : 0;
            }
        };
        Controls.addInteractable(hitbox);
        doorGroup.add(hitbox);

        parent.add(doorGroup);
    },

    // === ART DRAWING FUNCTIONS ===
    _drawForestArt(ctx, w, h) {
        const sky = ctx.createLinearGradient(0, 0, 0, h * 0.4);
        sky.addColorStop(0, '#1a2a3a'); sky.addColorStop(1, '#0a1a10');
        ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.4);
        ctx.fillStyle = '#0a3a1a'; ctx.fillRect(0, h * 0.35, w, h * 0.65);
        for (let i = 0; i < 12; i++) {
            const tx = (i / 12) * w + 20;
            const th = 100 + Math.random() * 200;
            ctx.fillStyle = Math.random() > 0.5 ? '#1a6a3a' : '#0e5028';
            ctx.beginPath(); ctx.moveTo(tx, h*0.6); ctx.lineTo(tx-30-Math.random()*20, h*0.6);
            ctx.lineTo(tx-5+Math.random()*10, h*0.6-th); ctx.closePath(); ctx.fill();
        }
        ctx.fillStyle = '#0a2a0e'; ctx.fillRect(0, h*0.85, w, h*0.15);
    },

    _drawOceanArt(ctx, w, h) {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0a4a6a'); grad.addColorStop(0.5, '#063050'); grad.addColorStop(1, '#041a30');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(100,180,255,0.12)'; ctx.lineWidth = 2;
        for (let i = 0; i < 8; i++) {
            const y = 50 + i * 60; ctx.beginPath();
            for (let x = 0; x < w; x += 5) ctx.lineTo(x, y + Math.sin(x/30+i)*15);
            ctx.stroke();
        }
        ctx.fillStyle = '#ff6040';
        for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(50+i*(w/6), h-40, 15, 30, 0, Math.PI, 0); ctx.fill(); }
    },

    _drawSunsetArt(ctx, w, h) {
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#0a0520'); grad.addColorStop(0.3, '#882222');
        grad.addColorStop(0.5, '#cc6622'); grad.addColorStop(0.7, '#cc9922'); grad.addColorStop(1, '#ddcc66');
        ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
        ctx.beginPath(); ctx.arc(w/2, h*0.55, 60, 0, Math.PI*2); ctx.fillStyle = '#ddaa22'; ctx.fill();
        ctx.fillStyle = '#1a0a05'; ctx.beginPath();
        ctx.moveTo(0, h*0.7); ctx.lineTo(w*0.2, h*0.4); ctx.lineTo(w*0.4, h*0.65);
        ctx.lineTo(w*0.6, h*0.35); ctx.lineTo(w*0.8, h*0.55); ctx.lineTo(w, h*0.6);
        ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
    },

    update(time, delta) {
        if (this._globe) this._globe.rotation.y = time * 0.15;
        if (this._rings[0]) this._rings[0].rotation.z = time * 0.3;
        if (this._rings[1]) this._rings[1].rotation.y = time * 0.2;

        // Animate doors
        if (this._doors) {
            this._doors.forEach(door => {
                door.angle += (door.targetAngle - door.angle) * 5 * delta;
                door.left.rotation.y = -door.angle; // Left door opens outwards
                door.right.rotation.y = door.angle; // Right door opens outwards

                if (door.glowMats) {
                    const pulse = 0.5 + 0.5 * Math.sin(time * 2.1 + door.angle * 3);
                    door.glowMats.forEach((mat, index) => {
                        if (!mat.emissive) return;
                        const base = index === 0 ? 0.1 : 0.55;
                        const amp = index === 0 ? 0.12 : 0.55;
                        mat.emissiveIntensity = base + amp * pulse;
                    });
                }
            });
        }
    },
};

window.HallRoom = HallRoom;
