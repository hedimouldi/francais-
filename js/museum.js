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
        wallLight: 0x2a2a2e,       // Dark charcoal walls
        wallAccent: 0x222226,      // Deeper charcoal accent
        wallLower: 0x1e1e22,       // Dark wainscot panel
        ceiling: 0x1a1a1e,         // Dark ceiling
        doorFrame: 0x8b7355,       // Brushed bronze frame
        skyBlue: 0x334455,         // Muted blue skylights
        trim: 0xaa9060,            // Gold/bronze trim
        baseboard: 0x111114,       // Near-black baseboard
        crownMold: 0x555560,       // Steel gray crown
        floorMarble: 0x1a1a1a,     // Dark marble
        floorParquet: 0x2a1f14,    // Dark ebony parquet
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

    /**
     * Build the entire museum
     */
    build(scene) {
        const group = new THREE.Group();
        group.name = 'Museum';
        this.collisionWalls = [];

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
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0e, roughness: 1 });
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
        cCtx.fillStyle = '#1a1a1e'; cCtx.fillRect(0, 0, 512, 512);
        // Dark coffered panel grid
        const panelSize = 128;
        for (let px = 0; px < 4; px++) {
            for (let py = 0; py < 4; py++) {
                const x = px * panelSize + 4, y = py * panelSize + 4;
                const w = panelSize - 8, h = panelSize - 8;
                cCtx.fillStyle = '#1e1e22'; cCtx.fillRect(x, y, w, h);
                cCtx.strokeStyle = 'rgba(80,75,65,0.25)'; cCtx.lineWidth = 2;
                cCtx.strokeRect(x, y, w, h);
                cCtx.strokeStyle = 'rgba(60,55,50,0.15)'; cCtx.lineWidth = 1;
                cCtx.strokeRect(x+8, y+8, w-16, h-16);
            }
        }
        const ceilTex = new THREE.CanvasTexture(ceilCanvas);
        ceilTex.wrapS = THREE.RepeatWrapping; ceilTex.wrapT = THREE.RepeatWrapping;
        ceilTex.repeat.set(width/12, depth/12);
        const ceilMat = new THREE.MeshStandardMaterial({ map: ceilTex, color: this.colors.ceiling, roughness: 0.85, metalness: 0 });
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
                    color: '#555555',
                    scale: 0.012,
                });
                labelSprite.position.set(cx, height - 1, cz);
                parent.add(labelSprite);
            }
        }

        // ---- BASEBOARD TRIM ----
        this._addBaseboard(parent, cx, cz, width, depth);
    },

    /**
     * Build a wall with door openings  
     */
    _buildWall(parent, wx, wz, lenX, lenZ, height, faceAxis, doorPositions) {
        // Procedural wall texture — dark charcoal fabric
        const wCanvas = document.createElement('canvas');
        wCanvas.width = 256; wCanvas.height = 256;
        const wCtx = wCanvas.getContext('2d');
        wCtx.fillStyle = '#2a2a2e'; wCtx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 800; i++) {
            const v = 35 + Math.random()*15;
            wCtx.fillStyle = `rgba(${v},${v},${v+3},0.06)`;
            wCtx.fillRect(Math.random()*256, Math.random()*256, 1+Math.random()*3, 1+Math.random()*3);
        }
        const wTex = new THREE.CanvasTexture(wCanvas);
        wTex.wrapS = THREE.RepeatWrapping; wTex.wrapT = THREE.RepeatWrapping;
        wTex.repeat.set(Math.max(lenX, lenZ)/6, height/6);

        const wallMat = new THREE.MeshStandardMaterial({
            map: wTex,
            color: this.colors.wallLight,
            roughness: 0.92,
            metalness: 0,
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
            roughness: 0.35,
            metalness: 0.08,
        });
        const accentMat = new THREE.MeshStandardMaterial({
            color: 0x3a2010, roughness: 0.3, metalness: 0.1,
        });
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
            // Left/right wall — frame runs along Z
            // Left post
            const leftPost = new THREE.Mesh(new THREE.BoxGeometry(fd, dh, fw), frameMat);
            leftPost.position.set(fx, dh / 2, fz - dw / 2);
            parent.add(leftPost);
            // Right post
            const rightPost = new THREE.Mesh(new THREE.BoxGeometry(fd, dh, fw), frameMat);
            rightPost.position.set(fx, dh / 2, fz + dw / 2);
            parent.add(rightPost);
            // Top beam
            const topBeam = new THREE.Mesh(new THREE.BoxGeometry(fd, fw, dw + fw * 2), frameMat);
            topBeam.position.set(fx, dh, fz);
            parent.add(topBeam);
        } else {
            // Front/back wall — frame runs along X
            const leftPost = new THREE.Mesh(new THREE.BoxGeometry(fw, dh, fd), frameMat);
            leftPost.position.set(fx - dw / 2, dh / 2, fz);
            parent.add(leftPost);
            const rightPost = new THREE.Mesh(new THREE.BoxGeometry(fw, dh, fd), frameMat);
            rightPost.position.set(fx + dw / 2, dh / 2, fz);
            parent.add(rightPost);
            const topBeam = new THREE.Mesh(new THREE.BoxGeometry(dw + fw * 2, fw, fd), frameMat);
            topBeam.position.set(fx, dh, fz);
            parent.add(topBeam);
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

                // Pendant rod
                const rod = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8),
                    new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 })
                );
                rod.position.set(lx, height - 0.3, lz);
                parent.add(rod);

                // Fixture housing (elegant disc)
                const fixtureGeo = new THREE.CylinderGeometry(0.5, 0.4, 0.12, 24);
                const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.15, metalness: 0.9 });
                const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
                fixture.position.set(lx, height - 0.66, lz);
                parent.add(fixture);

                // Warm glow disc (emissive — bright against dark ceiling)
                const glowGeo = new THREE.CircleGeometry(0.38, 24);
                const glowMat = new THREE.MeshStandardMaterial({
                    color: 0xfff0cc,
                    emissive: 0xfff0cc,
                    emissiveIntensity: 2.0,
                });
                const glow = new THREE.Mesh(glowGeo, glowMat);
                glow.rotation.x = Math.PI / 2;
                glow.position.set(lx, height - 0.72, lz);
                parent.add(glow);

                // Strong warm point light
                const light = new THREE.PointLight(0xffeedd, 1.2, 18, 1.5);
                light.position.set(lx, height - 0.8, lz);
                parent.add(light);
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
            emissiveIntensity: 0.4,
            roughness: 0.1,
            metalness: 0.1,
        });

        const windowH = 1.2;
        const windowW = 2;
        const windowY = height - 0.8;
        const gap = 3;

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

        // Skylight frame strips (blue dividers)
        const frameMat = new THREE.MeshStandardMaterial({ color: 0x4488aa, roughness: 0.3, metalness: 0.5 });
        // Horizontal strip at bottom of skylights on back wall
        const stripGeo = new THREE.BoxGeometry(width, 0.08, 0.1);
        const strip1 = new THREE.Mesh(stripGeo, frameMat);
        strip1.position.set(cx, windowY - windowH / 2, cz + hd - 0.05);
        parent.add(strip1);
        const strip2 = new THREE.Mesh(stripGeo, frameMat);
        strip2.position.set(cx, windowY - windowH / 2, cz - hd + 0.05);
        parent.add(strip2);
    },

    /**
     * Add baseboard trim along the bottom of walls
     */
    _addBaseboard(parent, cx, cz, width, depth) {
        const baseH = 0.25;
        const baseD = 0.08;
        const baseMat = new THREE.MeshStandardMaterial({ color: this.colors.baseboard, roughness: 0.35, metalness: 0.05 });
        const crownH = 0.12;
        const crownD = 0.06;
        const crownMat = new THREE.MeshStandardMaterial({ color: this.colors.crownMold, roughness: 0.3, metalness: 0.05 });

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

        // Wainscoting chair rail (horizontal strip at 1.2m)
        const railH = 0.06;
        const railD = 0.04;
        const railMat = new THREE.MeshStandardMaterial({ color: this.colors.trim, roughness: 0.3, metalness: 0.1 });
        const railY = 1.2;
        const rFB = new THREE.Mesh(new THREE.BoxGeometry(width, railH, railD), railMat);
        rFB.position.set(cx, railY, cz - hd + railD/2); parent.add(rFB);
        const rBK = new THREE.Mesh(new THREE.BoxGeometry(width, railH, railD), railMat);
        rBK.position.set(cx, railY, cz + hd - railD/2); parent.add(rBK);
        const rLR = new THREE.Mesh(new THREE.BoxGeometry(railD, railH, depth), railMat);
        rLR.position.set(cx - hw + railD/2, railY, cz); parent.add(rLR);
        const rRT = new THREE.Mesh(new THREE.BoxGeometry(railD, railH, depth), railMat);
        rRT.position.set(cx + hw - railD/2, railY, cz); parent.add(rRT);
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

        const wallMat = new THREE.MeshStandardMaterial({ color: this.colors.wallLight, roughness: 0.85, metalness: 0 });

        // Floor
        const floorMat = this._createFloorMaterial('carpet', len, w);
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(len, w), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(midX, 0.02, z);
        parent.add(floor);

        // Ceiling
        const ceilMat = new THREE.MeshStandardMaterial({ color: this.colors.ceiling, roughness: 0.9 });
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

        // Corridor light
        const light = new THREE.PointLight(0xfff8e8, 0.4, 15);
        light.position.set(midX, h - 0.5, z);
        parent.add(light);

        // Light fixture
        const fixtureGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.06, 16);
        const fixtureMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7 });
        const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
        fixture.position.set(midX, h - 0.03, z);
        parent.add(fixture);
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

        const wallMat = new THREE.MeshStandardMaterial({ color: this.colors.wallLight, roughness: 0.85, metalness: 0 });

        // Floor
        const floorMat = this._createFloorMaterial('carpet', w, len);
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, len), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(x, 0.02, midZ);
        parent.add(floor);

        // Ceiling
        const ceil = new THREE.Mesh(new THREE.PlaneGeometry(w, len), new THREE.MeshStandardMaterial({ color: this.colors.ceiling, roughness: 0.9 }));
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

        // Light
        const light = new THREE.PointLight(0xfff8e8, 0.4, 15);
        light.position.set(x, h - 0.5, midZ);
        parent.add(light);
    },

    _buildLCorridor(parent, hallDoorX, hallZ, roomX, doorZ) {
        const w = this.corridorWidth;
        const h = this.roomHeight;
        const t = this.wallThickness;
        const hw = w / 2;
        const wallMat = new THREE.MeshStandardMaterial({ color: this.colors.wallLight, roughness: 0.85, metalness: 0 });

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

            const vCeil = new THREE.Mesh(new THREE.PlaneGeometry(w, vLen), new THREE.MeshStandardMaterial({ color: this.colors.ceiling, roughness: 0.9 }));
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

            const vLight = new THREE.PointLight(0xfff8e8, 0.3, 12);
            vLight.position.set(hallDoorX, h - 0.5, vMidZ);
            parent.add(vLight);
        }

        // 2. JUNCTION 1 (Square at hallDoorX, cornerZ)
        const jFloor = new THREE.Mesh(new THREE.PlaneGeometry(w, w), this._createFloorMaterial('carpet', w, w));
        jFloor.rotation.x = -Math.PI / 2;
        jFloor.position.set(hallDoorX, 0.02, cornerZ);
        parent.add(jFloor);
        
        const jCeil = new THREE.Mesh(new THREE.PlaneGeometry(w, w), new THREE.MeshStandardMaterial({ color: this.colors.ceiling, roughness: 0.9 }));
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

        // 3. JUNCTION 2 (Square at roomX, cornerZ)
        const j2Floor = new THREE.Mesh(new THREE.PlaneGeometry(w, w), this._createFloorMaterial('carpet', w, w));
        j2Floor.rotation.x = -Math.PI / 2;
        j2Floor.position.set(roomX, 0.02, cornerZ);
        parent.add(j2Floor);

        const j2Ceil = new THREE.Mesh(new THREE.PlaneGeometry(w, w), new THREE.MeshStandardMaterial({ color: this.colors.ceiling, roughness: 0.9 }));
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

            const hCeil = new THREE.Mesh(new THREE.PlaneGeometry(hLen, w), new THREE.MeshStandardMaterial({ color: this.colors.ceiling, roughness: 0.9 }));
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

            const hLight = new THREE.PointLight(0xfff8e8, 0.3, 12);
            hLight.position.set(hMidX, h - 0.5, cornerZ);
            parent.add(hLight);
        }

        // 5. SHORT CONNECTOR DOWN TO ROOM (Junction 2 to Door)
        const connZ1 = (doorZ > cornerZ) ? cornerZ + hw : cornerZ - hw;
        const connZ2 = doorZ;
        if (Math.abs(connZ1 - connZ2) > 0.1) {
            this._buildCorridorVertical(parent, roomX, connZ1, roomX, connZ2);
        }
    },

    _createFloorMaterial(type, width, depth) {
        const canvas = document.createElement('canvas');
        const size = 512;
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');

        if (type === 'carpet') {
            // Dark polished marble with gold veins
            ctx.fillStyle = '#1a1a1e'; ctx.fillRect(0, 0, size, size);
            // Subtle dark variation
            for (let i = 0; i < 800; i++) {
                const v = 20 + Math.random()*15;
                ctx.fillStyle = `rgba(${v},${v},${v+5},0.3)`;
                ctx.fillRect(Math.random()*size, Math.random()*size, 3+Math.random()*8, 3+Math.random()*8);
            }
            // Gold/bronze veins
            for (let i = 0; i < 25; i++) {
                ctx.strokeStyle = `rgba(${160+Math.random()*40},${120+Math.random()*30},${60+Math.random()*30},${0.06 + Math.random()*0.08})`;
                ctx.lineWidth = 0.5 + Math.random()*1.2;
                ctx.beginPath();
                let x = Math.random()*size, y = Math.random()*size;
                ctx.moveTo(x, y);
                for (let j = 0; j < 6; j++) {
                    x += (Math.random()-0.5)*140; y += (Math.random()-0.5)*140;
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            // Tile grid (subtle)
            ctx.strokeStyle = 'rgba(80,70,50,0.15)'; ctx.lineWidth = 1;
            for (let i = 1; i < 4; i++) {
                ctx.beginPath(); ctx.moveTo(i*size/4, 0); ctx.lineTo(i*size/4, size); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, i*size/4); ctx.lineTo(size, i*size/4); ctx.stroke();
            }
        } else {
            // Dark mahogany parquet planks
            ctx.fillStyle = '#1c1410'; ctx.fillRect(0, 0, size, size);
            const plankW = size/6, plankH = size/2;
            for (let row = 0; row < size/plankH + 1; row++) {
                const offset = (row % 2) * plankW / 2;
                for (let col = -1; col < size/plankW + 1; col++) {
                    const hue = 15 + Math.random()*12;
                    const sat = 35 + Math.random()*20;
                    const light = 18 + Math.random()*10;
                    ctx.fillStyle = `hsl(${hue}, ${sat}%, ${light}%)`;
                    const px = col * plankW + offset, py = row * plankH;
                    ctx.fillRect(px, py, plankW - 1, plankH - 1);
                    // Wood grain lines
                    ctx.strokeStyle = `rgba(${40+Math.random()*20},${25+Math.random()*15},${15+Math.random()*10},0.25)`;
                    ctx.lineWidth = 0.5;
                    for (let g = 0; g < 4; g++) {
                        const gy = py + 10 + Math.random()*(plankH-20);
                        ctx.beginPath(); ctx.moveTo(px+2, gy); ctx.lineTo(px+plankW-3, gy + (Math.random()-0.5)*8); ctx.stroke();
                    }
                }
            }
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(Math.max(1, width/12), Math.max(1, depth/12));

        return new THREE.MeshStandardMaterial({
            map: tex,
            roughness: type === 'carpet' ? 0.12 : 0.35,
            metalness: type === 'carpet' ? 0.15 : 0.05,
            color: 0xffffff,
        });
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
