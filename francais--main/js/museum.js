/* ============================================
   ÉcoTech 3D — Museum Geometry Builder
   Bright, realistic museum style
   ============================================ */

const Museum = {
    // Dimensions
    roomWidth: 36,
    roomDepth: 36,
    roomHeight: 10,
    hallWidth: 40,
    hallDepth: 40,
    hallHeight: 12,
    corridorWidth: 8,
    wallThickness: 0.35,
    doorWidth: 5,
    doorHeight: 5.5,
    doorFrameWidth: 0.2,
    doorFrameDepth: 0.5,

    // Colors — Dark Luxury Gallery
    colors: {
        wallLight: 0x131a30,
        wallAccent: 0x101629,
        wallLower: 0x0d1224,
        ceiling: 0x0c1122,
        doorFrame: 0x1b2742,
        skyBlue: 0x1c2f55,
        trim: 0x2b5fff,
        baseboard: 0x0a0f1d,
        crownMold: 0x192a4f,
        floorMarble: 0x090d18,
        floorParquet: 0x0a1226,
        neonCyan: 0x2dfdff,
        neonBlue: 0x2b6bff,
        neonMagenta: 0xff2bd6,
    },

    // Room positions (center of each room)
    roomPositions: {
        hall:         { x: 0, z: 0 },
        climate:      { x: -60, z: 0 },
        energy:       { x: 60, z: 0 },
        cities:       { x: 0, z: 60 },
        biodiversity: { x: -36, z: -56 },
        recycling:    { x: 36, z: -56 },
    },

    // Collision walls
    collisionWalls: [],
    pulseMaterials: [],
    pulseLights: [],

    /**
     * Build the entire museum
     */
    build(scene) {
        const group = new THREE.Group();
        group.name = 'Museum';
        this.collisionWalls = [];
        this.pulseMaterials = [];
        this.pulseLights = [];

        // ===== CENTRAL HALL =====
        this._buildRoom(group, 0, 0, this.hallWidth, this.hallDepth, this.hallHeight, {
            floorType: 'carpet',
            doors: [
                { wall: 'left', pos: 0, label: '🌿 Salle 1 - Climat' },
                { wall: 'right', pos: 0, label: '⚡ Salle 2 - Énergies' },
                { wall: 'back', pos: 0, label: '🏙️ Salle 3 - Villes' },
                { wall: 'front', pos: -10, label: '🌳 Salle 4 - Biodiversité' },
                { wall: 'front', pos: 10, label: '♻️ Salle 5 - Recyclage' },
            ],
            skylights: true,
            ceilingLights: 6,
            label: 'Hall Central',
        });

        // ===== ROOMS =====
        const roomConfigs = [
            { name: 'climate', x: -60, z: 0, door: 'right', doorPos: 0 },
            { name: 'energy', x: 60, z: 0, door: 'left', doorPos: 0 },
            { name: 'cities', x: 0, z: 60, door: 'front', doorPos: 0 },
            { name: 'biodiversity', x: -36, z: -56, door: 'back', doorPos: 0 },
            { name: 'recycling', x: 36, z: -56, door: 'back', doorPos: 0 },
        ];

        const roomLabels = {
            climate: 'Salle 1 - Climat',
            energy: 'Salle 2 - Énergies',
            cities: 'Salle 3 - Villes Durables',
            biodiversity: 'Salle 4 - Biodiversité',
            recycling: 'Salle 5 - Recyclage',
        };

        roomConfigs.forEach(r => {
            this._buildRoom(group, r.x, r.z, this.roomWidth, this.roomDepth, this.roomHeight, {
                floorType: 'wood',
                doors: [{ wall: r.door, pos: r.doorPos }],
                skylights: true,
                ceilingLights: 4,
                label: roomLabels[r.name],
            });
        });

        // ===== CORRIDORS =====
        // Hall to Climate (left)
        this._buildCorridor(group, -this.hallWidth / 2, 0, this.roomPositions.climate.x + this.roomWidth / 2, 0);
        // Hall to Energy (right)
        this._buildCorridor(group, this.hallWidth / 2, 0, this.roomPositions.energy.x - this.roomWidth / 2, 0);
        // Hall to Cities (back)
        this._buildCorridorVertical(group, 0, this.hallDepth / 2, 0, this.roomPositions.cities.z - this.roomDepth / 2);
        // Hall to Biodiversity (front-left, L-shaped)
        this._buildLCorridor(group, -10, -this.hallDepth / 2, -36, -56 + this.roomDepth / 2);
        // Hall to Recycling (front-right, L-shaped)
        this._buildLCorridor(group, 10, -this.hallDepth / 2, 36, -56 + this.roomDepth / 2);

        // Ground plane
        const groundGeo = new THREE.PlaneGeometry(300, 300);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x05070f,
            emissive: 0x09112a,
            emissiveIntensity: 0.25,
            roughness: 0.96,
            metalness: 0,
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.02;
        group.add(ground);

        scene.add(group);
        return group;
    },

    /**
     * Build a room with bright museum aesthetics
     */
    _buildRoom(parent, cx, cz, width, depth, height, options = {}) {
        const t = this.wallThickness;
        const hw = width / 2;
        const hd = depth / 2;
        const doors = options.doors || [];

        // ---- FLOOR ----
        const floorMat = this._createFloorMaterial(options.floorType || 'carpet', width, depth);
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(cx, 0.01, cz);
        parent.add(floor);

        // ---- CEILING ----
        const ceilCanvas = document.createElement('canvas');
        ceilCanvas.width = 512; ceilCanvas.height = 512;
        const cCtx = ceilCanvas.getContext('2d');
        cCtx.fillStyle = '#060a18';
        cCtx.fillRect(0, 0, 512, 512);

        cCtx.strokeStyle = 'rgba(45,253,255,0.22)';
        cCtx.lineWidth = 2;
        for (let i = 0; i <= 8; i++) {
            const p = i * 64;
            cCtx.beginPath();
            cCtx.moveTo(p, 0);
            cCtx.lineTo(p, 512);
            cCtx.stroke();

            cCtx.beginPath();
            cCtx.moveTo(0, p);
            cCtx.lineTo(512, p);
            cCtx.stroke();
        }

        cCtx.strokeStyle = 'rgba(255,43,214,0.18)';
        cCtx.lineWidth = 1.2;
        for (let i = -8; i <= 8; i++) {
            cCtx.beginPath();
            cCtx.moveTo(0, 256 + i * 28);
            cCtx.lineTo(512, 220 + i * 28);
            cCtx.stroke();
        }

        const ceilTex = new THREE.CanvasTexture(ceilCanvas);
        ceilTex.wrapS = THREE.RepeatWrapping; ceilTex.wrapT = THREE.RepeatWrapping;
        ceilTex.repeat.set(width / 10, depth / 10);
        const ceilMat = new THREE.MeshStandardMaterial({
            map: ceilTex,
            color: this.colors.ceiling,
            emissive: this.colors.neonBlue,
            emissiveIntensity: 0.18,
            roughness: 0.35,
            metalness: 0.45,
        });
        this._registerPulseMaterial(ceilMat, {
            min: 0.1,
            max: 0.42,
            speed: 0.45 + Math.random() * 0.25,
            phase: Math.random() * Math.PI * 2,
            hueShift: 0.04,
        });
        const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), ceilMat);
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.set(cx, height, cz);
        parent.add(ceiling);

        // ---- WALLS with door openings ----
        const leftDoors = doors.filter(d => d.wall === 'left').map(d => d.pos);
        const rightDoors = doors.filter(d => d.wall === 'right').map(d => d.pos);
        const frontDoors = doors.filter(d => d.wall === 'front').map(d => d.pos);
        const backDoors = doors.filter(d => d.wall === 'back').map(d => d.pos);

        this._buildWall(parent, cx - hw, cz, t, depth, height, 'x', leftDoors);
        this._buildWall(parent, cx + hw, cz, t, depth, height, 'x', rightDoors);
        this._buildWall(parent, cx, cz - hd, width, t, height, 'z', frontDoors);
        this._buildWall(parent, cx, cz + hd, width, t, height, 'z', backDoors);

        // ---- DOOR FRAMES ----
        doors.forEach(d => {
            this._buildDoorFrame(parent, cx, cz, hw, hd, height, d);
        });

        // ---- CEILING LIGHTS (recessed spotlights) ----
        if (options.ceilingLights) {
            this._addCeilingLights(parent, cx, cz, width, depth, height, options.ceilingLights);
        }

        // ---- SKYLIGHTS (clerestory windows) ----
        if (options.skylights) {
            this._addSkylights(parent, cx, cz, width, depth, height);
        }

        // ---- ROOM LABEL ----
        if (options.label) {
            // Put label near a door entrance  
            const firstDoor = doors[0];
            if (firstDoor) {
                const labelSprite = EcoUtils.createTextSprite(options.label, {
                    fontSize: 36,
                    fontWeight: '600',
                    color: '#8fdfff',
                    scale: 0.012,
                });
                labelSprite.position.set(cx, height - 1, cz);
                parent.add(labelSprite);
            }
        }

        // ---- BASEBOARD TRIM ----
        this._addBaseboard(parent, cx, cz, width, depth);
        this._addNeoRoomAccents(parent, cx, cz, width, depth, height);
    },

    /**
     * Build a wall with door openings  
     */
    _buildWall(parent, wx, wz, lenX, lenZ, height, faceAxis, doorPositions) {
        // Procedural wall texture — dark charcoal fabric
        const wCanvas = document.createElement('canvas');
        wCanvas.width = 256; wCanvas.height = 256;
        const wCtx = wCanvas.getContext('2d');
        wCtx.fillStyle = '#101a33'; wCtx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 800; i++) {
            const v = 20 + Math.random() * 18;
            wCtx.fillStyle = `rgba(${v},${v + 10},${v + 35},0.11)`;
            wCtx.fillRect(Math.random()*256, Math.random()*256, 1+Math.random()*3, 1+Math.random()*3);
        }
        wCtx.strokeStyle = 'rgba(43,107,255,0.2)';
        wCtx.lineWidth = 1;
        for (let i = 0; i <= 8; i++) {
            const y = i * 32;
            wCtx.beginPath();
            wCtx.moveTo(0, y);
            wCtx.lineTo(256, y);
            wCtx.stroke();
        }
        const wTex = new THREE.CanvasTexture(wCanvas);
        wTex.wrapS = THREE.RepeatWrapping; wTex.wrapT = THREE.RepeatWrapping;
        wTex.repeat.set(Math.max(lenX, lenZ)/6, height/5);

        const wallMat = new THREE.MeshStandardMaterial({
            map: wTex,
            color: this.colors.wallLight,
            emissive: this.colors.neonBlue,
            emissiveIntensity: 0.12,
            roughness: 0.5,
            metalness: 0.35,
        });
        this._registerPulseMaterial(wallMat, {
            min: 0.06,
            max: 0.24,
            speed: 0.35 + Math.random() * 0.35,
            phase: Math.random() * Math.PI * 2,
            hueShift: 0.05,
        });

        const dw = this.doorWidth;
        const dh = this.doorHeight;

        if (!doorPositions || doorPositions.length === 0) {
            const geo = new THREE.BoxGeometry(lenX, height, lenZ);
            const mesh = new THREE.Mesh(geo, wallMat);
            mesh.position.set(wx, height / 2, wz);
            parent.add(mesh);
            this.collisionWalls.push(mesh);
            return;
        }

        const wallLength = faceAxis === 'z' ? lenX : lenZ;
        const wallThick = faceAxis === 'z' ? lenZ : lenX;
        const sorted = [...doorPositions].sort((a, b) => a - b);

        let currentPos = -wallLength / 2;
        const segments = [];

        for (const doorCenter of sorted) {
            const doorStart = doorCenter - dw / 2;
            const doorEnd = doorCenter + dw / 2;

            if (currentPos < doorStart) {
                segments.push({ center: currentPos + (doorStart - currentPos) / 2, length: doorStart - currentPos, height, yOff: 0 });
            }
            const lintelH = height - dh;
            if (lintelH > 0.1) {
                segments.push({ center: doorCenter, length: dw, height: lintelH, yOff: dh });
            }
            currentPos = doorEnd;
        }

        if (currentPos < wallLength / 2) {
            const segLen = wallLength / 2 - currentPos;
            segments.push({ center: currentPos + segLen / 2, length: segLen, height, yOff: 0 });
        }

        for (const seg of segments) {
            let geo, mesh;
            if (faceAxis === 'z') {
                geo = new THREE.BoxGeometry(seg.length, seg.height, wallThick);
                mesh = new THREE.Mesh(geo, wallMat);
                mesh.position.set(wx + seg.center, seg.yOff + seg.height / 2, wz);
            } else {
                geo = new THREE.BoxGeometry(wallThick, seg.height, seg.length);
                mesh = new THREE.Mesh(geo, wallMat);
                mesh.position.set(wx, seg.yOff + seg.height / 2, wz + seg.center);
            }
            parent.add(mesh);
            if (seg.yOff === 0) this.collisionWalls.push(mesh);
        }
    },

    /**
     * Build a wooden door frame
     */
    _buildDoorFrame(parent, cx, cz, hw, hd, roomHeight, door) {
        const frameMat = new THREE.MeshStandardMaterial({
            color: this.colors.doorFrame,
            emissive: this.colors.neonBlue,
            emissiveIntensity: 0.12,
            roughness: 0.28,
            metalness: 0.65,
        });
        this._registerPulseMaterial(frameMat, {
            min: 0.06,
            max: 0.24,
            speed: 0.8,
            phase: Math.random() * Math.PI * 2,
            hueShift: 0.03,
        });
        const cyanNeonMat = this._createNeonMaterial(this.colors.neonCyan, { speed: 1.2, max: 1.35 });
        const magentaNeonMat = this._createNeonMaterial(this.colors.neonMagenta, { speed: 1.55, max: 1.25 });
        const fw = this.doorFrameWidth * 1.3;
        const fd = this.doorFrameDepth * 1.2;
        const dw = this.doorWidth;
        const dh = this.doorHeight;

        let fx, fz, isXWall;

        switch (door.wall) {
            case 'left':
                fx = cx - hw; fz = cz + door.pos; isXWall = true; break;
            case 'right':
                fx = cx + hw; fz = cz + door.pos; isXWall = true; break;
            case 'front':
                fx = cx + door.pos; fz = cz - hd; isXWall = false; break;
            case 'back':
                fx = cx + door.pos; fz = cz + hd; isXWall = false; break;
        }

        if (isXWall) {
            const sideSign = door.wall === 'left' ? 1 : -1;
            const xOffset = sideSign * (fd / 2 + 0.03);
            // Left/right wall — frame runs along Z
            // Left post
            const leftPost = new THREE.Mesh(new THREE.BoxGeometry(fd, dh, fw), frameMat);
            leftPost.position.set(fx, dh / 2, fz - dw / 2);
            parent.add(leftPost);
            const leftEdgeGlow = new THREE.Mesh(new THREE.BoxGeometry(0.035, dh, 0.035), cyanNeonMat);
            leftEdgeGlow.position.set(fx + xOffset, dh / 2, fz - dw / 2);
            parent.add(leftEdgeGlow);
            // Right post
            const rightPost = new THREE.Mesh(new THREE.BoxGeometry(fd, dh, fw), frameMat);
            rightPost.position.set(fx, dh / 2, fz + dw / 2);
            parent.add(rightPost);
            const rightEdgeGlow = new THREE.Mesh(new THREE.BoxGeometry(0.035, dh, 0.035), magentaNeonMat);
            rightEdgeGlow.position.set(fx + xOffset, dh / 2, fz + dw / 2);
            parent.add(rightEdgeGlow);
            // Top beam
            const topBeam = new THREE.Mesh(new THREE.BoxGeometry(fd, fw, dw + fw * 2), frameMat);
            topBeam.position.set(fx, dh, fz);
            parent.add(topBeam);
            const topGlow = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, dw + fw * 2), cyanNeonMat);
            topGlow.position.set(fx + xOffset, dh + fw * 0.5, fz);
            parent.add(topGlow);
        } else {
            const sideSign = door.wall === 'front' ? -1 : 1;
            const zOffset = sideSign * (fd / 2 + 0.03);
            // Front/back wall — frame runs along X
            const leftPost = new THREE.Mesh(new THREE.BoxGeometry(fw, dh, fd), frameMat);
            leftPost.position.set(fx - dw / 2, dh / 2, fz);
            parent.add(leftPost);
            const leftEdgeGlow = new THREE.Mesh(new THREE.BoxGeometry(0.035, dh, 0.035), cyanNeonMat);
            leftEdgeGlow.position.set(fx - dw / 2, dh / 2, fz + zOffset);
            parent.add(leftEdgeGlow);
            const rightPost = new THREE.Mesh(new THREE.BoxGeometry(fw, dh, fd), frameMat);
            rightPost.position.set(fx + dw / 2, dh / 2, fz);
            parent.add(rightPost);
            const rightEdgeGlow = new THREE.Mesh(new THREE.BoxGeometry(0.035, dh, 0.035), magentaNeonMat);
            rightEdgeGlow.position.set(fx + dw / 2, dh / 2, fz + zOffset);
            parent.add(rightEdgeGlow);
            const topBeam = new THREE.Mesh(new THREE.BoxGeometry(dw + fw * 2, fw, fd), frameMat);
            topBeam.position.set(fx, dh, fz);
            parent.add(topBeam);
            const topGlow = new THREE.Mesh(new THREE.BoxGeometry(dw + fw * 2, 0.035, 0.035), cyanNeonMat);
            topGlow.position.set(fx, dh + fw * 0.5, fz + zOffset);
            parent.add(topGlow);
        }
    },

    /**
     * Add recessed ceiling lights
     */
    _addCeilingLights(parent, cx, cz, width, depth, height, count) {
        const gridSize = Math.ceil(Math.sqrt(count));
        const spacingX = width / (gridSize + 1);
        const spacingZ = depth / (gridSize + 1);

        for (let i = 1; i <= gridSize; i++) {
            for (let j = 1; j <= gridSize; j++) {
                if ((i - 1) * gridSize + j > count) break;

                const lx = cx - width / 2 + i * spacingX;
                const lz = cz - depth / 2 + j * spacingZ;

                const frame = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.45, 0.45, 0.08, 20),
                    new THREE.MeshStandardMaterial({ color: 0x151c2f, roughness: 0.3, metalness: 0.82 })
                );
                frame.position.set(lx, height - 0.06, lz);
                parent.add(frame);

                const glowMat = (i + j) % 2 === 0
                    ? this._createNeonMaterial(this.colors.neonCyan, { speed: 1.35, max: 1.7 })
                    : this._createNeonMaterial(this.colors.neonMagenta, { speed: 1.55, max: 1.65 });

                // Warm glow disc (emissive — bright against dark ceiling)
                const glow = new THREE.Mesh(new THREE.CircleGeometry(0.34, 24), glowMat);
                glow.rotation.x = Math.PI / 2;
                glow.position.set(lx, height - 0.11, lz);
                parent.add(glow);

                const beam = new THREE.Mesh(
                    new THREE.BoxGeometry(0.06, 0.06, Math.min(2.8, spacingZ * 0.75)),
                    this._createNeonMaterial(this.colors.neonBlue, { speed: 0.9, max: 1.2 })
                );
                beam.position.set(lx, height - 0.14, lz);
                parent.add(beam);

                const lightColor = (i + j) % 2 === 0 ? this.colors.neonCyan : this.colors.neonMagenta;
                const light = new THREE.PointLight(lightColor, 1.2, 20, 1.8);
                light.position.set(lx, height - 0.45, lz);
                parent.add(light);
                this._registerPulseLight(light, {
                    min: 0.65,
                    max: 1.45,
                    speed: 1 + Math.random() * 0.8,
                    phase: Math.random() * Math.PI * 2,
                });
            }
        }
    },

    /**
     * Add clerestory skylights near the top of walls
     */
    _addSkylights(parent, cx, cz, width, depth, height) {
        const skyGeo = new THREE.PlaneGeometry(1, 1);
        const skyMat = new THREE.MeshStandardMaterial({
            color: this.colors.skyBlue,
            emissive: this.colors.skyBlue,
            emissiveIntensity: 1.1,
            roughness: 0.18,
            metalness: 0.45,
            transparent: true,
            opacity: 0.88,
        });
        this._registerPulseMaterial(skyMat, {
            min: 0.6,
            max: 1.45,
            speed: 1.15,
            phase: Math.random() * Math.PI * 2,
            hueShift: 0.12,
        });

        const windowH = 1.35;
        const windowW = 1.8;
        const windowY = height - 0.85;
        const gap = 2.6;

        const hw = width / 2;
        const hd = depth / 2;

        // Back wall skylights
        const countX = Math.floor(width / (windowW + gap));
        for (let i = 0; i < countX; i++) {
            const wx = cx - (countX - 1) * (windowW + gap) / 2 + i * (windowW + gap);

            // Back wall
            const win1 = new THREE.Mesh(new THREE.PlaneGeometry(windowW, windowH), skyMat);
            win1.position.set(wx, windowY, cz + hd - 0.1);
            win1.rotation.y = Math.PI;
            parent.add(win1);

            // Front wall
            const win2 = new THREE.Mesh(new THREE.PlaneGeometry(windowW, windowH), skyMat);
            win2.position.set(wx, windowY, cz - hd + 0.1);
            parent.add(win2);
        }

        // Side wall skylights
        const countZ = Math.floor(depth / (windowW + gap));
        for (let i = 0; i < countZ; i++) {
            const wz = cz - (countZ - 1) * (windowW + gap) / 2 + i * (windowW + gap);

            // Left wall
            const win3 = new THREE.Mesh(new THREE.PlaneGeometry(windowW, windowH), skyMat);
            win3.position.set(cx - hw + 0.1, windowY, wz);
            win3.rotation.y = Math.PI / 2;
            parent.add(win3);

            // Right wall
            const win4 = new THREE.Mesh(new THREE.PlaneGeometry(windowW, windowH), skyMat);
            win4.position.set(cx + hw - 0.1, windowY, wz);
            win4.rotation.y = -Math.PI / 2;
            parent.add(win4);
        }

        // Skylight frame strips
        const frameMat = this._createNeonMaterial(this.colors.neonBlue, { speed: 1.4, max: 1.1 });
        const stripGeo = new THREE.BoxGeometry(width, 0.08, 0.1);
        const strip1 = new THREE.Mesh(stripGeo, frameMat);
        strip1.position.set(cx, windowY - windowH / 2, cz + hd - 0.05);
        parent.add(strip1);
        const strip2 = new THREE.Mesh(stripGeo, frameMat);
        strip2.position.set(cx, windowY - windowH / 2, cz - hd + 0.05);
        parent.add(strip2);

        const stripGeoZ = new THREE.BoxGeometry(0.1, 0.08, depth);
        const strip3 = new THREE.Mesh(stripGeoZ, frameMat);
        strip3.position.set(cx - hw + 0.05, windowY - windowH / 2, cz);
        parent.add(strip3);
        const strip4 = new THREE.Mesh(stripGeoZ, frameMat);
        strip4.position.set(cx + hw - 0.05, windowY - windowH / 2, cz);
        parent.add(strip4);
    },

    /**
     * Add baseboard trim along the bottom of walls
     */
    _addBaseboard(parent, cx, cz, width, depth) {
        const baseH = 0.2;
        const baseD = 0.06;
        const baseMat = new THREE.MeshStandardMaterial({
            color: this.colors.baseboard,
            emissive: this.colors.neonBlue,
            emissiveIntensity: 0.08,
            roughness: 0.4,
            metalness: 0.45,
        });
        this._registerPulseMaterial(baseMat, {
            min: 0.04,
            max: 0.2,
            speed: 0.75,
            phase: Math.random() * Math.PI * 2,
            hueShift: 0.03,
        });

        const crownH = 0.12;
        const crownD = 0.06;
        const crownMat = new THREE.MeshStandardMaterial({
            color: this.colors.crownMold,
            emissive: this.colors.neonBlue,
            emissiveIntensity: 0.1,
            roughness: 0.25,
            metalness: 0.65,
        });
        this._registerPulseMaterial(crownMat, {
            min: 0.06,
            max: 0.24,
            speed: 0.95,
            phase: Math.random() * Math.PI * 2,
            hueShift: 0.05,
        });

        const hw = width / 2;
        const hd = depth / 2;
        const h = this.roomHeight || 10;

        // Baseboards
        const fbGeo = new THREE.BoxGeometry(width, baseH, baseD);
        const front = new THREE.Mesh(fbGeo, baseMat);
        front.position.set(cx, baseH / 2, cz - hd + baseD / 2);
        parent.add(front);
        const back = new THREE.Mesh(fbGeo, baseMat);
        back.position.set(cx, baseH / 2, cz + hd - baseD / 2);
        parent.add(back);
        const lrGeo = new THREE.BoxGeometry(baseD, baseH, depth);
        const left = new THREE.Mesh(lrGeo, baseMat);
        left.position.set(cx - hw + baseD / 2, baseH / 2, cz);
        parent.add(left);
        const right = new THREE.Mesh(lrGeo, baseMat);
        right.position.set(cx + hw - baseD / 2, baseH / 2, cz);
        parent.add(right);

        // Crown molding at ceiling
        const cmFBGeo = new THREE.BoxGeometry(width, crownH, crownD);
        const cmFront = new THREE.Mesh(cmFBGeo, crownMat);
        cmFront.position.set(cx, h - crownH/2, cz - hd + crownD/2);
        parent.add(cmFront);
        const cmBack = new THREE.Mesh(cmFBGeo, crownMat);
        cmBack.position.set(cx, h - crownH/2, cz + hd - crownD/2);
        parent.add(cmBack);
        const cmLRGeo = new THREE.BoxGeometry(crownD, crownH, depth);
        const cmLeft = new THREE.Mesh(cmLRGeo, crownMat);
        cmLeft.position.set(cx - hw + crownD/2, h - crownH/2, cz);
        parent.add(cmLeft);
        const cmRight = new THREE.Mesh(cmLRGeo, crownMat);
        cmRight.position.set(cx + hw - crownD/2, h - crownH/2, cz);
        parent.add(cmRight);

        const railH = 0.035;
        const railD = 0.035;
        const railY = 1.25;
        const railMat = this._createNeonMaterial(this.colors.neonMagenta, { speed: 1.35, max: 1.05 });
        const rFB = new THREE.Mesh(new THREE.BoxGeometry(width, railH, railD), railMat);
        rFB.position.set(cx, railY, cz - hd + railD / 2); parent.add(rFB);
        const rBK = new THREE.Mesh(new THREE.BoxGeometry(width, railH, railD), railMat);
        rBK.position.set(cx, railY, cz + hd - railD / 2); parent.add(rBK);
        const rLR = new THREE.Mesh(new THREE.BoxGeometry(railD, railH, depth), railMat);
        rLR.position.set(cx - hw + railD / 2, railY, cz); parent.add(rLR);
        const rRT = new THREE.Mesh(new THREE.BoxGeometry(railD, railH, depth), railMat);
        rRT.position.set(cx + hw - railD / 2, railY, cz); parent.add(rRT);
    },

    /**
     * Build horizontal corridor
     */
    _buildCorridor(parent, x1, z, x2, zIgnored) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const len = maxX - minX;
        const midX = (minX + maxX) / 2;
        const w = this.corridorWidth;
        const hw = w / 2;
        const h = this.roomHeight;
        const t = this.wallThickness;

        const wallMat = new THREE.MeshStandardMaterial({
            color: this.colors.wallLight,
            emissive: this.colors.neonBlue,
            emissiveIntensity: 0.1,
            roughness: 0.45,
            metalness: 0.4,
        });
        this._registerPulseMaterial(wallMat, {
            min: 0.05,
            max: 0.22,
            speed: 0.8,
            phase: Math.random() * Math.PI * 2,
            hueShift: 0.04,
        });

        // Floor
        const floorMat = this._createFloorMaterial('carpet', len, w);
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(len, w), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(midX, 0.02, z);
        parent.add(floor);

        // Ceiling
        const ceilMat = new THREE.MeshStandardMaterial({
            color: this.colors.ceiling,
            emissive: this.colors.neonBlue,
            emissiveIntensity: 0.1,
            roughness: 0.35,
            metalness: 0.55,
        });
        this._registerPulseMaterial(ceilMat, {
            min: 0.04,
            max: 0.18,
            speed: 0.9,
            phase: Math.random() * Math.PI * 2,
            hueShift: 0.02,
        });
        const ceil = new THREE.Mesh(new THREE.PlaneGeometry(len, w), ceilMat);
        ceil.rotation.x = Math.PI / 2;
        ceil.position.set(midX, h, z);
        parent.add(ceil);

        // Side walls
        const topWall = new THREE.Mesh(new THREE.BoxGeometry(len, h, t), wallMat);
        topWall.position.set(midX, h / 2, z + hw);
        parent.add(topWall);
        this.collisionWalls.push(topWall);

        const botWall = new THREE.Mesh(new THREE.BoxGeometry(len, h, t), wallMat);
        botWall.position.set(midX, h / 2, z - hw);
        parent.add(botWall);
        this.collisionWalls.push(botWall);

        const light = new THREE.PointLight(this.colors.neonCyan, 0.85, 18, 1.9);
        light.position.set(midX, h - 0.65, z);
        parent.add(light);
        this._registerPulseLight(light, {
            min: 0.55,
            max: 1.1,
            speed: 1.5,
            phase: Math.random() * Math.PI * 2,
        });

        const rail1 = new THREE.Mesh(
            new THREE.BoxGeometry(len, 0.035, 0.035),
            this._createNeonMaterial(this.colors.neonCyan, { speed: 1.2, max: 1.25 })
        );
        rail1.position.set(midX, 0.12, z - hw + 0.06);
        parent.add(rail1);
        const rail2 = new THREE.Mesh(
            new THREE.BoxGeometry(len, 0.035, 0.035),
            this._createNeonMaterial(this.colors.neonMagenta, { speed: 1.35, max: 1.2 })
        );
        rail2.position.set(midX, 0.12, z + hw - 0.06);
        parent.add(rail2);

        this._addNeoCorridorAccents(parent, midX, z, len, w, h, 'x');
    },

    /**
     * Build vertical corridor (along Z)
     */
    _buildCorridorVertical(parent, x, z1, xIgnored, z2) {
        const minZ = Math.min(z1, z2);
        const maxZ = Math.max(z1, z2);
        const len = maxZ - minZ;
        const midZ = (minZ + maxZ) / 2;
        const w = this.corridorWidth;
        const hw = w / 2;
        const h = this.roomHeight;
        const t = this.wallThickness;

        const wallMat = new THREE.MeshStandardMaterial({
            color: this.colors.wallLight,
            emissive: this.colors.neonBlue,
            emissiveIntensity: 0.1,
            roughness: 0.45,
            metalness: 0.4,
        });
        this._registerPulseMaterial(wallMat, {
            min: 0.05,
            max: 0.22,
            speed: 0.78,
            phase: Math.random() * Math.PI * 2,
            hueShift: 0.04,
        });

        // Floor
        const floorMat = this._createFloorMaterial('carpet', w, len);
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, len), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(x, 0.02, midZ);
        parent.add(floor);

        // Ceiling
        const ceilMat = new THREE.MeshStandardMaterial({
            color: this.colors.ceiling,
            emissive: this.colors.neonBlue,
            emissiveIntensity: 0.1,
            roughness: 0.35,
            metalness: 0.55,
        });
        this._registerPulseMaterial(ceilMat, {
            min: 0.04,
            max: 0.18,
            speed: 0.88,
            phase: Math.random() * Math.PI * 2,
            hueShift: 0.02,
        });
        const ceil = new THREE.Mesh(new THREE.PlaneGeometry(w, len), ceilMat);
        ceil.rotation.x = Math.PI / 2;
        ceil.position.set(x, h, midZ);
        parent.add(ceil);

        // Side walls
        const leftWall = new THREE.Mesh(new THREE.BoxGeometry(t, h, len), wallMat);
        leftWall.position.set(x - hw, h / 2, midZ);
        parent.add(leftWall);
        this.collisionWalls.push(leftWall);

        const rightWall = new THREE.Mesh(new THREE.BoxGeometry(t, h, len), wallMat);
        rightWall.position.set(x + hw, h / 2, midZ);
        parent.add(rightWall);
        this.collisionWalls.push(rightWall);

        const light = new THREE.PointLight(this.colors.neonMagenta, 0.85, 18, 1.9);
        light.position.set(x, h - 0.65, midZ);
        parent.add(light);
        this._registerPulseLight(light, {
            min: 0.55,
            max: 1.1,
            speed: 1.45,
            phase: Math.random() * Math.PI * 2,
        });

        const rail1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.035, 0.035, len),
            this._createNeonMaterial(this.colors.neonCyan, { speed: 1.2, max: 1.25 })
        );
        rail1.position.set(x - hw + 0.06, 0.12, midZ);
        parent.add(rail1);
        const rail2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.035, 0.035, len),
            this._createNeonMaterial(this.colors.neonMagenta, { speed: 1.35, max: 1.2 })
        );
        rail2.position.set(x + hw - 0.06, 0.12, midZ);
        parent.add(rail2);

        this._addNeoCorridorAccents(parent, x, midZ, len, w, h, 'z');
    },

    _buildLCorridor(parent, hallDoorX, hallZ, roomX, doorZ) {
        const w = this.corridorWidth;
        const h = this.roomHeight;
        const t = this.wallThickness;
        const hw = w / 2;
        const wallMat = new THREE.MeshStandardMaterial({
            color: this.colors.wallLight,
            emissive: this.colors.neonBlue,
            emissiveIntensity: 0.1,
            roughness: 0.45,
            metalness: 0.4,
        });
        this._registerPulseMaterial(wallMat, {
            min: 0.05,
            max: 0.22,
            speed: 0.82,
            phase: Math.random() * Math.PI * 2,
            hueShift: 0.04,
        });

        // Place the horizontal corridor slightly in front of the door
        const cornerZ = (hallZ > doorZ) ? doorZ + 4 : doorZ - 4; 

        // 1. VERTICAL SEGMENT (Hall to Junction 1)
        const vZ1 = hallZ;
        const vZ2 = (hallZ > cornerZ) ? cornerZ + hw : cornerZ - hw;
        const vMinZ = Math.min(vZ1, vZ2);
        const vMaxZ = Math.max(vZ1, vZ2);
        const vLen = vMaxZ - vMinZ;
        const vMidZ = (vMinZ + vMaxZ) / 2;

        if (vLen > 0.1) {
            const vFloor = new THREE.Mesh(new THREE.PlaneGeometry(w, vLen), this._createFloorMaterial('carpet', w, vLen));
            vFloor.rotation.x = -Math.PI / 2;
            vFloor.position.set(hallDoorX, 0.02, vMidZ);
            parent.add(vFloor);

            const vCeil = new THREE.Mesh(new THREE.PlaneGeometry(w, vLen), this._createCorridorCeilingMaterial());
            vCeil.rotation.x = Math.PI / 2;
            vCeil.position.set(hallDoorX, h, vMidZ);
            parent.add(vCeil);

            const vl = new THREE.Mesh(new THREE.BoxGeometry(t, h, vLen), wallMat);
            vl.position.set(hallDoorX - hw, h / 2, vMidZ);
            parent.add(vl);
            this.collisionWalls.push(vl);

            const vr = new THREE.Mesh(new THREE.BoxGeometry(t, h, vLen), wallMat);
            vr.position.set(hallDoorX + hw, h / 2, vMidZ);
            parent.add(vr);
            this.collisionWalls.push(vr);

            const vLight = new THREE.PointLight(this.colors.neonCyan, 0.8, 14, 1.8);
            vLight.position.set(hallDoorX, h - 0.6, vMidZ);
            parent.add(vLight);
            this._registerPulseLight(vLight, {
                min: 0.5,
                max: 1.05,
                speed: 1.45,
                phase: Math.random() * Math.PI * 2,
            });
            this._addNeoCorridorAccents(parent, hallDoorX, vMidZ, vLen, w, h, 'z');
        }

        // 2. JUNCTION 1 (Square at hallDoorX, cornerZ)
        const jFloor = new THREE.Mesh(new THREE.PlaneGeometry(w, w), this._createFloorMaterial('carpet', w, w));
        jFloor.rotation.x = -Math.PI / 2;
        jFloor.position.set(hallDoorX, 0.02, cornerZ);
        parent.add(jFloor);
        
        const jCeil = new THREE.Mesh(new THREE.PlaneGeometry(w, w), this._createCorridorCeilingMaterial());
        jCeil.rotation.x = Math.PI / 2;
        jCeil.position.set(hallDoorX, h, cornerZ);
        parent.add(jCeil);
        
        const jWallOuter = new THREE.Mesh(new THREE.BoxGeometry(t, h, w), wallMat);
        jWallOuter.position.set((roomX < hallDoorX) ? hallDoorX + hw : hallDoorX - hw, h / 2, cornerZ);
        parent.add(jWallOuter);
        this.collisionWalls.push(jWallOuter);
        
        const jWallEnd = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), wallMat);
        jWallEnd.position.set(hallDoorX, h / 2, (hallZ > cornerZ) ? cornerZ - hw : cornerZ + hw);
        parent.add(jWallEnd);
        this.collisionWalls.push(jWallEnd);
        this._addNeoCorridorAccents(parent, hallDoorX, cornerZ, w, w, h, 'x');

        // 3. JUNCTION 2 (Square at roomX, cornerZ)
        const j2Floor = new THREE.Mesh(new THREE.PlaneGeometry(w, w), this._createFloorMaterial('carpet', w, w));
        j2Floor.rotation.x = -Math.PI / 2;
        j2Floor.position.set(roomX, 0.02, cornerZ);
        parent.add(j2Floor);

        const j2Ceil = new THREE.Mesh(new THREE.PlaneGeometry(w, w), this._createCorridorCeilingMaterial());
        j2Ceil.rotation.x = Math.PI / 2;
        j2Ceil.position.set(roomX, h, cornerZ);
        parent.add(j2Ceil);
        
        const j2WallOuter = new THREE.Mesh(new THREE.BoxGeometry(t, h, w), wallMat);
        j2WallOuter.position.set((roomX < hallDoorX) ? roomX - hw : roomX + hw, h / 2, cornerZ);
        parent.add(j2WallOuter);
        this.collisionWalls.push(j2WallOuter);
        
        const j2WallEnd = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), wallMat);
        j2WallEnd.position.set(roomX, h / 2, (doorZ > cornerZ) ? cornerZ - hw : cornerZ + hw);
        parent.add(j2WallEnd);
        this.collisionWalls.push(j2WallEnd);
        this._addNeoCorridorAccents(parent, roomX, cornerZ, w, w, h, 'x');

        // 4. HORIZONTAL SEGMENT (Between Junction 1 and Junction 2)
        const hX1 = (roomX < hallDoorX) ? hallDoorX - hw : hallDoorX + hw;
        const hX2 = (roomX < hallDoorX) ? roomX + hw : roomX - hw;
        const hMinX = Math.min(hX1, hX2);
        const hMaxX = Math.max(hX1, hX2);
        const hLen = hMaxX - hMinX;
        const hMidX = (hMinX + hMaxX) / 2;

        if (hLen > 0.1) {
            const hFloor = new THREE.Mesh(new THREE.PlaneGeometry(hLen, w), this._createFloorMaterial('carpet', hLen, w));
            hFloor.rotation.x = -Math.PI / 2;
            hFloor.position.set(hMidX, 0.02, cornerZ);
            parent.add(hFloor);

            const hCeil = new THREE.Mesh(new THREE.PlaneGeometry(hLen, w), this._createCorridorCeilingMaterial());
            hCeil.rotation.x = Math.PI / 2;
            hCeil.position.set(hMidX, h, cornerZ);
            parent.add(hCeil);

            const ht = new THREE.Mesh(new THREE.BoxGeometry(hLen, h, t), wallMat);
            ht.position.set(hMidX, h / 2, cornerZ + hw);
            parent.add(ht);
            this.collisionWalls.push(ht);

            const hb = new THREE.Mesh(new THREE.BoxGeometry(hLen, h, t), wallMat);
            hb.position.set(hMidX, h / 2, cornerZ - hw);
            parent.add(hb);
            this.collisionWalls.push(hb);

            const hLight = new THREE.PointLight(this.colors.neonMagenta, 0.8, 14, 1.8);
            hLight.position.set(hMidX, h - 0.6, cornerZ);
            parent.add(hLight);
            this._registerPulseLight(hLight, {
                min: 0.5,
                max: 1.05,
                speed: 1.35,
                phase: Math.random() * Math.PI * 2,
            });
            this._addNeoCorridorAccents(parent, hMidX, cornerZ, hLen, w, h, 'x');
        }

        // 5. SHORT CONNECTOR DOWN TO ROOM (Junction 2 to Door)
        const connZ1 = (doorZ > cornerZ) ? cornerZ + hw : cornerZ - hw;
        const connZ2 = doorZ;
        if (Math.abs(connZ1 - connZ2) > 0.1) {
            this._buildCorridorVertical(parent, roomX, connZ1, roomX, connZ2);
        }
    },

    _createNeonMaterial(colorHex, pulseOptions = {}) {
        const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(colorHex).multiplyScalar(0.85),
            emissive: colorHex,
            emissiveIntensity: pulseOptions.base || 0.85,
            roughness: 0.2,
            metalness: 0.65,
        });
        this._registerPulseMaterial(mat, {
            min: pulseOptions.min ?? 0.45,
            max: pulseOptions.max ?? 1.2,
            speed: pulseOptions.speed ?? 1.2,
            phase: pulseOptions.phase ?? Math.random() * Math.PI * 2,
            hueShift: pulseOptions.hueShift ?? 0.06,
        });
        return mat;
    },

    _registerPulseMaterial(material, options = {}) {
        if (!material) return;

        const emissive = material.emissive ? material.emissive.clone() : new THREE.Color(0xffffff);
        const hsl = { h: 0, s: 0, l: 0 };
        emissive.getHSL(hsl);

        this.pulseMaterials.push({
            material,
            min: options.min ?? 0.1,
            max: options.max ?? 0.35,
            speed: options.speed ?? 0.8,
            phase: options.phase ?? 0,
            hueShift: options.hueShift ?? 0,
            baseHue: hsl.h,
            sat: hsl.s,
            light: hsl.l,
        });
    },

    _registerPulseLight(light, options = {}) {
        if (!light) return;
        this.pulseLights.push({
            light,
            min: options.min ?? 0.4,
            max: options.max ?? 1.0,
            speed: options.speed ?? 1.0,
            phase: options.phase ?? 0,
        });
    },

    _createCorridorCeilingMaterial() {
        const ceilMat = new THREE.MeshStandardMaterial({
            color: this.colors.ceiling,
            emissive: this.colors.neonBlue,
            emissiveIntensity: 0.1,
            roughness: 0.35,
            metalness: 0.55,
        });
        this._registerPulseMaterial(ceilMat, {
            min: 0.04,
            max: 0.18,
            speed: 0.9,
            phase: Math.random() * Math.PI * 2,
            hueShift: 0.02,
        });
        return ceilMat;
    },

    _addNeoRoomAccents(parent, cx, cz, width, depth, height) {
        const hw = width / 2;
        const hd = depth / 2;
        const floorY = 0.08;
        const ceilY = height - 0.12;
        const edge = 0.1;

        const cyan = this._createNeonMaterial(this.colors.neonCyan, { speed: 1.1, max: 1.18 });
        const magenta = this._createNeonMaterial(this.colors.neonMagenta, { speed: 1.35, max: 1.16 });
        const blue = this._createNeonMaterial(this.colors.neonBlue, { speed: 0.9, max: 1.1 });

        const floorFront = new THREE.Mesh(new THREE.BoxGeometry(width, 0.03, 0.03), cyan);
        floorFront.position.set(cx, floorY, cz - hd + edge);
        parent.add(floorFront);
        const floorBack = new THREE.Mesh(new THREE.BoxGeometry(width, 0.03, 0.03), magenta);
        floorBack.position.set(cx, floorY, cz + hd - edge);
        parent.add(floorBack);
        const floorLeft = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, depth), blue);
        floorLeft.position.set(cx - hw + edge, floorY, cz);
        parent.add(floorLeft);
        const floorRight = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, depth), cyan);
        floorRight.position.set(cx + hw - edge, floorY, cz);
        parent.add(floorRight);

        const ceilFront = new THREE.Mesh(new THREE.BoxGeometry(width, 0.03, 0.03), blue);
        ceilFront.position.set(cx, ceilY, cz - hd + edge);
        parent.add(ceilFront);
        const ceilBack = new THREE.Mesh(new THREE.BoxGeometry(width, 0.03, 0.03), cyan);
        ceilBack.position.set(cx, ceilY, cz + hd - edge);
        parent.add(ceilBack);
        const ceilLeft = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, depth), magenta);
        ceilLeft.position.set(cx - hw + edge, ceilY, cz);
        parent.add(ceilLeft);
        const ceilRight = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, depth), blue);
        ceilRight.position.set(cx + hw - edge, ceilY, cz);
        parent.add(ceilRight);

        const centerLight = new THREE.PointLight(this.colors.neonBlue, 0.8, Math.max(width, depth) * 0.55, 1.9);
        centerLight.position.set(cx, height - 1.2, cz);
        parent.add(centerLight);
        this._registerPulseLight(centerLight, {
            min: 0.5,
            max: 1.15,
            speed: 1.25,
            phase: Math.random() * Math.PI * 2,
        });
    },

    _addNeoCorridorAccents(parent, cx, cz, length, width, height, axis) {
        const floorY = 0.08;
        const ceilY = height - 0.14;
        const half = width / 2;
        const centerMat = this._createNeonMaterial(this.colors.neonBlue, { speed: 1.1, max: 1.25 });
        const sideMat = this._createNeonMaterial(this.colors.neonMagenta, { speed: 1.3, max: 1.2 });

        if (axis === 'x') {
            const centerLane = new THREE.Mesh(new THREE.BoxGeometry(length, 0.03, 0.03), centerMat);
            centerLane.position.set(cx, floorY, cz);
            parent.add(centerLane);

            const ceilLane = new THREE.Mesh(new THREE.BoxGeometry(length, 0.03, 0.03), sideMat);
            ceilLane.position.set(cx, ceilY, cz);
            parent.add(ceilLane);

            const leftLane = new THREE.Mesh(new THREE.BoxGeometry(length, 0.028, 0.028), sideMat);
            leftLane.position.set(cx, floorY, cz - half + 0.08);
            parent.add(leftLane);

            const rightLane = new THREE.Mesh(new THREE.BoxGeometry(length, 0.028, 0.028), centerMat);
            rightLane.position.set(cx, floorY, cz + half - 0.08);
            parent.add(rightLane);
        } else {
            const centerLane = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, length), centerMat);
            centerLane.position.set(cx, floorY, cz);
            parent.add(centerLane);

            const ceilLane = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, length), sideMat);
            ceilLane.position.set(cx, ceilY, cz);
            parent.add(ceilLane);

            const leftLane = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.028, length), sideMat);
            leftLane.position.set(cx - half + 0.08, floorY, cz);
            parent.add(leftLane);

            const rightLane = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.028, length), centerMat);
            rightLane.position.set(cx + half - 0.08, floorY, cz);
            parent.add(rightLane);
        }
    },

    _createFloorMaterial(type, width, depth) {
        const canvas = document.createElement('canvas');
        const size = 512;
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (type === 'carpet') {
            ctx.fillStyle = '#060b16';
            ctx.fillRect(0, 0, size, size);

            for (let i = 0; i < 1200; i++) {
                const b = 10 + Math.random() * 18;
                ctx.fillStyle = `rgba(${b},${b + 8},${b + 22},0.24)`;
                ctx.fillRect(Math.random() * size, Math.random() * size, 1 + Math.random() * 4, 1 + Math.random() * 4);
            }

            ctx.strokeStyle = 'rgba(45,253,255,0.24)';
            ctx.lineWidth = 2;
            for (let i = 0; i <= 8; i++) {
                const p = i * (size / 8);
                ctx.beginPath();
                ctx.moveTo(p, 0);
                ctx.lineTo(p, size);
                ctx.stroke();
            }

            ctx.strokeStyle = 'rgba(255,43,214,0.2)';
            for (let i = 0; i <= 8; i++) {
                const p = i * (size / 8);
                ctx.beginPath();
                ctx.moveTo(0, p);
                ctx.lineTo(size, p);
                ctx.stroke();
            }

            ctx.strokeStyle = 'rgba(43,107,255,0.35)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, size * 0.5);
            ctx.lineTo(size, size * 0.5);
            ctx.stroke();
        } else {
            ctx.fillStyle = '#070f20';
            ctx.fillRect(0, 0, size, size);

            const cell = 64;
            for (let y = 0; y < size; y += cell) {
                for (let x = 0; x < size; x += cell) {
                    const tint = ((x + y) / cell) % 2 === 0 ? '#0b1831' : '#091428';
                    ctx.fillStyle = tint;
                    ctx.fillRect(x, y, cell - 1, cell - 1);
                }
            }

            ctx.strokeStyle = 'rgba(45,253,255,0.22)';
            ctx.lineWidth = 1.5;
            for (let i = 0; i <= 8; i++) {
                const p = i * (size / 8);
                ctx.beginPath();
                ctx.moveTo(p, 0);
                ctx.lineTo(p, size);
                ctx.stroke();
            }

            ctx.strokeStyle = 'rgba(255,43,214,0.18)';
            for (let i = 0; i <= 8; i++) {
                const p = i * (size / 8);
                ctx.beginPath();
                ctx.moveTo(0, p);
                ctx.lineTo(size, p);
                ctx.stroke();
            }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(Math.max(1, width / 8), Math.max(1, depth / 8));

        const material = new THREE.MeshStandardMaterial({
            map: tex,
            emissive: this.colors.neonBlue,
            emissiveIntensity: type === 'carpet' ? 0.14 : 0.1,
            roughness: type === 'carpet' ? 0.22 : 0.28,
            metalness: type === 'carpet' ? 0.42 : 0.35,
            color: 0xffffff,
        });
        this._registerPulseMaterial(material, {
            min: type === 'carpet' ? 0.08 : 0.06,
            max: type === 'carpet' ? 0.3 : 0.22,
            speed: type === 'carpet' ? 1.15 : 0.9,
            phase: Math.random() * Math.PI * 2,
            hueShift: 0.04,
        });
        return material;
    },

    update(time) {
        const t = time || 0;
        for (const pulse of this.pulseMaterials) {
            if (!pulse.material) continue;
            const wave = 0.5 + 0.5 * Math.sin(t * pulse.speed + pulse.phase);
            pulse.material.emissiveIntensity = pulse.min + (pulse.max - pulse.min) * wave;

            if (pulse.hueShift > 0 && pulse.material.emissive) {
                const h = (pulse.baseHue + pulse.hueShift * Math.sin(t * pulse.speed * 0.6 + pulse.phase)) % 1;
                pulse.material.emissive.setHSL((h + 1) % 1, pulse.sat, pulse.light);
            }
        }

        for (const pulse of this.pulseLights) {
            if (!pulse.light) continue;
            const wave = 0.5 + 0.5 * Math.sin(t * pulse.speed + pulse.phase);
            pulse.light.intensity = pulse.min + (pulse.max - pulse.min) * wave;
        }
    },

    /**
     * Get room display name
     */
    _getRoomDisplayName(name) {
        const names = {
            hall: 'Hall Central',
            climate: '🌿 Climat & Réchauffement',
            energy: '⚡ Énergies Renouvelables',
            cities: '🏙️ Villes Durables',
            biodiversity: '🌳 Biodiversité',
            recycling: '♻️ Recyclage',
        };
        return names[name] || name;
    },

    /**
     * Determine which room the player is in
     */
    getPlayerRoom(playerX, playerZ) {
        for (const [name, pos] of Object.entries(this.roomPositions)) {
            const halfW = name === 'hall' ? this.hallWidth / 2 : this.roomWidth / 2;
            const halfD = name === 'hall' ? this.hallDepth / 2 : this.roomDepth / 2;
            if (playerX >= pos.x - halfW - 2 && playerX <= pos.x + halfW + 2 &&
                playerZ >= pos.z - halfD - 2 && playerZ <= pos.z + halfD + 2) {
                return name;
            }
        }
        return 'corridor';
    },
};

window.Museum = Museum;
