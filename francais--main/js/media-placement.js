/* ============================================
   ÉcoTech 3D — Media Placement
   Places all room images on walls and videos near room doors
   ============================================ */

const MediaPlacement = {
    _videoElements: [],

    build(scene) {
        if (!scene || !window.THREE || !window.Museum) return;

        const rooms = [
            {
                key: 'hall',
                center: Museum.roomPositions.hall,
                width: Museum.hallWidth,
                depth: Museum.hallDepth,
                height: Museum.hallHeight,
                imageFiles: ['images/hall_centrale.jpg', 'images/hall_centrale1.jpg'],
                videoFile: 'images/hall_centraleV1.mp4',
                doorWall: 'left',
                doorPos: 0,
            },
            {
                key: 'climate',
                center: Museum.roomPositions.climate,
                width: Museum.roomWidth,
                depth: Museum.roomDepth,
                height: Museum.roomHeight,
                imageFiles: ['images/salle1_climat.png', 'images/salle1_climat1.jpg', 'images/salle1_climat2.jpg'],
                videoFile: 'images/salle1_climatV.mp4',
                doorWall: 'right',
                doorPos: 0,
            },
            {
                key: 'energy',
                center: Museum.roomPositions.energy,
                width: Museum.roomWidth,
                depth: Museum.roomDepth,
                height: Museum.roomHeight,
                imageFiles: [
                    'images/salle2_energies.png',
                    'images/salle2_energies1.png',
                    'images/salle2_energies2.png',
                    'images/salle2_energies3.jpg',
                ],
                videoFile: 'images/salle2_energiesV1.mp4',
                doorWall: 'left',
                doorPos: 0,
            },
            {
                key: 'cities',
                center: Museum.roomPositions.cities,
                width: Museum.roomWidth,
                depth: Museum.roomDepth,
                height: Museum.roomHeight,
                imageFiles: ['images/salle3_villes.png', 'images/salle3_villes1.jpg', 'images/salle3_villes2.jpg'],
                videoFile: null,
                doorWall: 'front',
                doorPos: 0,
            },
            {
                key: 'biodiversity',
                center: Museum.roomPositions.biodiversity,
                width: Museum.roomWidth,
                depth: Museum.roomDepth,
                height: Museum.roomHeight,
                imageFiles: ['images/salle4_biodiversite.png', 'images/salle4_biodiversite1.jpg'],
                videoFile: 'images/salle4_biodiversiteV1.mp4',
                doorWall: 'back',
                doorPos: 0,
            },
            {
                key: 'recycling',
                center: Museum.roomPositions.recycling,
                width: Museum.roomWidth,
                depth: Museum.roomDepth,
                height: Museum.roomHeight,
                imageFiles: ['images/salle5_recyclage.png', 'images/salle5_recyclage1.avif'],
                videoFile: 'images/salle5_recyclageV1.mp4',
                doorWall: 'back',
                doorPos: 0,
            },
        ];

        rooms.forEach(room => {
            this._placeRoomImages(scene, room);
            this._placeRoomVideoNearDoor(scene, room);
        });
    },

    _placeRoomImages(scene, room) {
        if (!room.imageFiles || room.imageFiles.length === 0) return;

        const walls = ['left', 'right', 'front', 'back'];
        const targetWalls = walls.filter(w => w !== room.doorWall);
        const hw = room.width / 2;
        const hd = room.depth / 2;
        const frameWidth = 5.4;
        const frameHeight = 3.1;
        const y = 3.2;
        const inset = 0.4;

        room.imageFiles.forEach((imagePath, index) => {
            const wall = targetWalls[index % targetWalls.length];
            const lane = Math.floor(index / targetWalls.length);
            const laneOffset = lane === 0 ? 0 : (lane % 2 === 0 ? 5.5 : -5.5);

            const painting = this._createImagePainting(frameWidth, frameHeight, imagePath);
            const pos = this._wallAnchor(room.center.x, room.center.z, hw, hd, wall, laneOffset, inset);
            painting.position.set(pos.x, y, pos.z);
            painting.rotation.y = pos.rotY;

            painting.userData = {
                interactive: true,
                mediaType: 'image',
                mediaSrc: imagePath,
                title: 'Image — ' + room.key,
            };
            Controls.addInteractable(painting);
            scene.add(painting);
        });
    },

    _placeRoomVideoNearDoor(scene, room) {
        if (!room.videoFile) return;

        const fallbackImage = room.imageFiles && room.imageFiles.length ? room.imageFiles[0] : null;
        const videoPlane = this._createVideoPanel(4.8, 2.8, room.videoFile, fallbackImage);
        const hw = room.width / 2;
        const hd = room.depth / 2;
        const y = 3.0;
        const lateralShift = 4.2;
        const inset = 0.45;

        const pos = this._wallAnchor(
            room.center.x,
            room.center.z,
            hw,
            hd,
            room.doorWall,
            (room.doorPos || 0) + lateralShift,
            inset
        );

        videoPlane.position.set(pos.x, y, pos.z);
        videoPlane.rotation.y = pos.rotY;

        videoPlane.userData = {
            interactive: true,
            mediaType: 'video',
            mediaSrc: room.videoFile,
            title: 'Vidéo — ' + room.key,
        };
        Controls.addInteractable(videoPlane);
        scene.add(videoPlane);
    },

    _wallAnchor(cx, cz, hw, hd, wall, offset, inset) {
        if (wall === 'left') {
            return { x: cx - hw + inset, z: cz + offset, rotY: Math.PI / 2 };
        }
        if (wall === 'right') {
            return { x: cx + hw - inset, z: cz + offset, rotY: -Math.PI / 2 };
        }
        if (wall === 'front') {
            return { x: cx + offset, z: cz - hd + inset, rotY: 0 };
        }
        return { x: cx + offset, z: cz + hd - inset, rotY: Math.PI };
    },

    _createImagePainting(width, height, imagePath) {
        const group = new THREE.Group();

        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(width + 0.28, height + 0.28, 0.12),
            new THREE.MeshStandardMaterial({
                color: 0x202c4a,
                emissive: 0x2b6bff,
                emissiveIntensity: 0.18,
                roughness: 0.38,
                metalness: 0.45,
            })
        );
        frame.position.z = -0.03;
        group.add(frame);

        // Use a canvas texture — works on both file:// and http://
        const cvs = document.createElement('canvas');
        cvs.width = 1024;
        cvs.height = 768;
        const cCtx = cvs.getContext('2d');
        cCtx.fillStyle = '#0d1428';
        cCtx.fillRect(0, 0, cvs.width, cvs.height);
        cCtx.fillStyle = 'rgba(255,255,255,0.08)';
        cCtx.font = 'bold 28px sans-serif';
        cCtx.textAlign = 'center';
        cCtx.fillText('⏳ Chargement…', cvs.width / 2, cvs.height / 2);

        const canvasTex = new THREE.CanvasTexture(cvs);
        canvasTex.anisotropy = 8;

        const img = new Image();
        img.onload = () => {
            cCtx.clearRect(0, 0, cvs.width, cvs.height);
            cCtx.drawImage(img, 0, 0, cvs.width, cvs.height);
            canvasTex.needsUpdate = true;
        };
        img.onerror = () => {
            cCtx.fillStyle = '#1a0a1a';
            cCtx.fillRect(0, 0, cvs.width, cvs.height);
            cCtx.fillStyle = '#ff6677';
            cCtx.font = 'bold 24px sans-serif';
            cCtx.textAlign = 'center';
            cCtx.fillText('Image introuvable', cvs.width / 2, cvs.height / 2);
            canvasTex.needsUpdate = true;
        };
        img.src = imagePath;

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshStandardMaterial({
                map: canvasTex,
                emissive: 0x1a223a,
                emissiveIntensity: 0.22,
                roughness: 0.35,
                metalness: 0.05,
            })
        );
        plane.position.z = 0.035;
        group.add(plane);

        return group;
    },

    _createVideoPanel(width, height, videoPath, fallbackImagePath = null) {
        const cvs = document.createElement('canvas');
        cvs.width = 960;
        cvs.height = 540;
        const cCtx = cvs.getContext('2d');
        cCtx.fillStyle = '#05090f';
        cCtx.fillRect(0, 0, cvs.width, cvs.height);
        cCtx.fillStyle = 'rgba(255,255,255,0.15)';
        cCtx.font = 'bold 32px sans-serif';
        cCtx.textAlign = 'center';
        cCtx.fillText('▶ Vidéo', cvs.width / 2, cvs.height / 2);

        const canvasTex = new THREE.CanvasTexture(cvs);
        canvasTex.minFilter = THREE.LinearFilter;
        canvasTex.magFilter = THREE.LinearFilter;
        canvasTex.anisotropy = 8;

        const video = document.createElement('video');
        video.src = videoPath;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.setAttribute('webkit-playsinline', 'true');
        this._videoElements.push(video);

        // Use VideoTexture — updates canvas fallback on error
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;

        const screenMat = new THREE.MeshStandardMaterial({
            map: videoTexture,
            emissive: 0x2a2a2a,
            emissiveIntensity: 0.45,
            roughness: 0.28,
            metalness: 0.1,
        });

        // On error: show fallback image via canvas
        const applyFallback = (imgPath) => {
            if (!imgPath) {
                cCtx.fillStyle = '#050915';
                cCtx.fillRect(0, 0, cvs.width, cvs.height);
                cCtx.fillStyle = '#ff6677';
                cCtx.font = 'bold 24px sans-serif';
                cCtx.fillText('Vidéo non disponible', cvs.width / 2, cvs.height / 2);
                canvasTex.needsUpdate = true;
                screenMat.map = canvasTex;
                screenMat.needsUpdate = true;
                return;
            }
            const img = new Image();
            img.onload = () => {
                cCtx.clearRect(0, 0, cvs.width, cvs.height);
                cCtx.drawImage(img, 0, 0, cvs.width, cvs.height);
                canvasTex.needsUpdate = true;
                screenMat.map = canvasTex;
                screenMat.needsUpdate = true;
            };
            img.src = imgPath;
        };

        video.addEventListener('error', () => applyFallback(fallbackImagePath));
        video.play().catch(() => applyFallback(fallbackImagePath));

        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(width + 0.26, height + 0.26, 0.1),
            new THREE.MeshStandardMaterial({
                color: 0x172846,
                emissive: 0xff2bd6,
                emissiveIntensity: 0.22,
                roughness: 0.32,
                metalness: 0.62,
            })
        );

        const screen = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            screenMat
        );
        screen.position.z = 0.03;

        const panel = new THREE.Group();
        panel.add(frame);
        panel.add(screen);
        return panel;
    },
};

window.MediaPlacement = MediaPlacement;
