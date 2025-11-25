import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

// Audio setup
let audioContext;
let audioSource;
let analyser;
let audioElement;
let freqData = null; // last frequency data array
const songs = [
    './sounds/014 - The Police - Every Breath You Take (Official Music Video).mp3',
    './sounds/015 - Come Out and Play.mp3',
    './sounds/015 - Van Morrison - Brown Eyed Girl (Official Audio).mp3',
    './sounds/016 - Beautiful South Perfect10.mp3',
    './sounds/016 - Maroon 5 - Sunday Morning.mp3',
    './sounds/017 - The Beatles Help.mp3',
    './sounds/017 - The Magic Key (Episode 3).mp3',
    './sounds/018 - Daft Punk - Digital Love (Official Audio).mp3',
    './sounds/019 - Jamiroquai - You Give Me Something.mp3',
    './sounds/019 - Suspicious Mind - Elvis Presley.mp3',
    './sounds/020 - Arctic Monkeys - Why\'d You Only Call Me When You\'re High？ (Official Video).mp3',
    './sounds/020 - Dany Brillant - Quand je vois tes yeux Paroles／Lyrics.mp3',
    './sounds/021 - Arctic Monkeys - R U Mine？.mp3',
    './sounds/021 - Iam - Petit Frère (Clip Officiel) [HD].mp3',
    './sounds/022 - Arctic Monkeys - Do I Wanna Know？ (Official Video).mp3',
    './sounds/023 - Guns N\' Roses - Sweet Child O\' Mine (Official Music Video).mp3',
    './sounds/023 - Radiohead creep (HQ Audio).mp3',
    './sounds/024 - #BoysLockerRoom song ／ Meiko Nakahara - Fantasy [Remix].mp3',
    './sounds/024 - Survivor - Eye Of The Tiger (Official HD Video).mp3',
    './sounds/025 - Megalith Agnus Dei x Somebody That I Used to Know.mp3',
    './sounds/025 - Whitney Houston - I Will Always Love You (Official 4K Video).mp3',
    './sounds/027 - Drake - Jimmy Cooks ft. 21 Savage.mp3',
    './sounds/027 - The Dandy Warhols - Bohemian Like You (Official Video).mp3',
    './sounds/028 - U2 - Beautiful Day (Official Music Video).mp3',
    './sounds/028 - Young Thug - Hot (feat. Gunna).mp3',
    './sounds/029 - Michael Bublé - Sway (Official Lyric Video).mp3',
    './sounds/029 - U2 - Pride (In The Name Of Love) (Official Music Video).mp3',
    './sounds/030 - Muse - Uprising [Official Video].mp3',
    './sounds/030 - Thundercat - Them Changes.mp3',
    './sounds/031 - Freeze Raël.mp3',
    './sounds/031 - Muse - Starlight [Official Music Video].mp3',
    './sounds/032 - Muse - Supermassive Black Hole [Official Music Video].mp3',
    './sounds/032 - PNL - Deux Frères [Clip Officiel].mp3',
    './sounds/033 - Juliette Armanet - Le dernier jour du disco (Clip Officiel).mp3',
    './sounds/033 - Muse - Time Is Running Out (video).mp3',
    './sounds/14 - Use This Gospel.mp3',
    './sounds/15 - Say You Will.mp3',
    './sounds/16 - All Of The Lights.mp3',
    './sounds/17 - Closed On Sunday.mp3',
    './sounds/18 - Street Lights.mp3',
    './sounds/19 - Love Lockdown.mp3',
    './sounds/Denon Reed - Let Him Go.mp3',
    './sounds/Kool & The Gang - Celebration.mp3'
];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Fetch the canvas element created in index.html, replace 'canvas' with the id of your canvas
const canvas = document.getElementById('cvs');

// Create a WebGLRenderer and set its width and height
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true, // enable canvas transparency
});
 
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
// make the background fully transparent
renderer.setClearColor(0x000000, 0);
// ensure the canvas element CSS stays transparent
renderer.domElement.style.background = 'transparent';

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

camera.position.z = 4;
const controls = new OrbitControls(camera, renderer.domElement);

// --- ADDED: renderer color encoding so colors look correct ---
renderer.outputEncoding = THREE.sRGBEncoding;

// --- ADDED: basic lighting so MTL/Phong materials are visible ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// ----------------- ADDED: load .mtl then .obj -----------------
const manager = new THREE.LoadingManager();
manager.onLoad = function () {
    console.log('All resources loaded.');
};
manager.onError = function (url) {
    console.error('There was an error loading ' + url);
};

const mtlLoader = new MTLLoader(manager);
mtlLoader.setPath('./models/'); // dossier où placer model.mtl

//Ajout du corp principale
mtlLoader.load('ois-textured.mtl',
    (materials) => {
        materials.preload();

        const objLoader = new OBJLoader(manager);
        objLoader.setMaterials(materials);
        objLoader.setPath('./models/');
        objLoader.load('ois-textured.obj',
            (object) => {
                // ajustements simples : position, scale, rotation si nécessaire
                object.position.set(0, 0, 0);
                object.scale.set(0.01, 0.01, 0.01);
                object.rotation.x = -Math.PI/2;

                scene.add(object);
                console.log('OBJ chargé et ajouté à la scène (coloré en orange).');
            },
            (xhr) => {
                if (xhr && xhr.lengthComputable) {
                    const percent = (xhr.loaded / xhr.total) * 100;
                    console.log('OBJ ' + Math.round(percent) + '% chargé');
                }
            },
            (err) => {
                console.error('Erreur lors du chargement de l\'OBJ', err);
            }
        );
    },
    (xhr) => {
        if (xhr && xhr.lengthComputable) {
            const percent = (xhr.loaded / xhr.total) * 100;
            console.log('MTL ' + Math.round(percent) + '% chargé');
        }
    },
    (err) => {
        console.error('Erreur lors du chargement du MTL', err);
    }
);

// ----------------- Load keynote note model (template for spawning) -----------------
let noteTemplate = null;
const noteLoader = new MTLLoader(manager);
noteLoader.setPath('./models/');
noteLoader.load('keynote.mtl',
    (materials) => {
        materials.preload();

        const objLoader2 = new OBJLoader(manager);
        objLoader2.setMaterials(materials);
        objLoader2.setPath('./models/');
        objLoader2.load('keynote.obj',
            (object) => {
                // Keep template out of the scene. We'll clone it when spawning notes.
                noteTemplate = object;
                // Make template reasonably small (we'll scale clones)
                noteTemplate.scale.set(0.02, 0.02, 0.02);
                // Ensure geometry uses standard material so we can recolor; convert materials if needed later when cloning
                console.log('Keynote template chargé et prêt.');
            },
            undefined,
            (err) => {
                console.error('Erreur lors du chargement de keynote.obj', err);
            }
        );
    },
    undefined,
    (err) => {
        console.error('Erreur lors du chargement de keynote.mtl', err);
    }
);

//On ajoute nos 4 sphere à la scene 
const geometrySphere = new THREE.SphereGeometry( 0.15, 32, 32 );
const materialSphere = new THREE.MeshPhongMaterial({ 
    color: 0x202020,
    shininess: 100,
    specular: 0x444444
});
//const materialSphere = new THREE.MeshBasicMaterial( { color: 0x00FF00 } );
const sphere1 = new THREE.Mesh( geometrySphere, materialSphere );
const sphere2 = new THREE.Mesh( geometrySphere, materialSphere );
const sphere3 = new THREE.Mesh( geometrySphere, materialSphere );
const sphere4 = new THREE.Mesh( geometrySphere, materialSphere );
scene.add( sphere1 );
scene.add( sphere2 );
scene.add( sphere3 );
scene.add( sphere4 );
//On déplace les spheres aux bons endroits
sphere1.position.set(-1.6, 0.37, -0.3);
sphere2.position.set(1.6, 0.37, -0.3);
sphere3.position.set(-1.6, -0.42, -0.3);
sphere4.position.set(1.6, -0.42, -0.3);

// Add a new clickable sphere
const clickableSphereGeometry = new THREE.SphereGeometry(0.20, 32, 32);
const clickableSphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true, opacity: 0 });
const clickableSphere = new THREE.Mesh(clickableSphereGeometry, clickableSphereMaterial);
clickableSphere.position.set(0.4, -0.45, 0.0);
scene.add(clickableSphere);

// Audio setup and sphere animation
const setupAudio = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 32;
    }
    
    if (!audioElement) {
        audioElement = new Audio();
        audioElement.crossOrigin = "anonymous";
        audioSource = audioContext.createMediaElementSource(audioElement);
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
    }
};

const playRandomSong = () => {
    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    audioElement.src = randomSong;
    audioElement.play();
};

const stopSong = () => {
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }
};

// ----------------- Notes spawning & button interaction -----------------
let activeNotes = [];
let spawnIntervalId = null;
const MAX_NOTES = 80;
let lastTime = performance.now();
// scale factor to reduce spawned note sizes (1 = same, 0.5 = half size)
const NOTE_SCALE_FACTOR = 0.5;

const spheresArray = [sphere1, sphere2, sphere3, sphere4];

// spawn a single note at a given position, with a velocity
const spawnNote = (position, emitterIndex) => {
    if (!noteTemplate) return;
    // clone the template deeply
    const note = noteTemplate.clone(true);

    // Ensure each mesh uses a fresh material so colors can be randomized
    note.traverse((child) => {
        if (child.isMesh) {
            // Create a standard material with random color
            const color = new THREE.Color(Math.random(), Math.random(), Math.random());
            child.material = new THREE.MeshStandardMaterial({
                color: color,
                emissive: color.clone().multiplyScalar(0.2),
                metalness: 0.2,
                roughness: 0.5,
                transparent: true,
                opacity: 1
            });
        }
    });

    // set initial transform
    note.position.copy(position);
    // random initial orientation
    note.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);

    // velocity: mostly away from center with some randomness
    const dir = new THREE.Vector3().copy(position).normalize();
    // If position near origin the dir might be zero, fallback to random
    if (dir.lengthSq() < 0.0001) dir.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    // Add jitter
    dir.add(new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8)).normalize();
    const speed = 0.6 + Math.random() * 1.4; // units per second
    const velocity = dir.multiplyScalar(speed);

    const life = 2.0 + Math.random() * 1.5; // seconds

    // growth parameters: start small, grow quickly to peak, then fade
    const initialScale = (0.005 + Math.random() * 0.006) * NOTE_SCALE_FACTOR; // very small at spawn
    const peakScale = (0.02 + Math.random() * 0.06) * NOTE_SCALE_FACTOR; // peak size after growth
    const growDuration = 0.12 + Math.random() * 0.28; // seconds to reach peak

    // angular velocity for rotation
    const angularVel = new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);

    note.scale.setScalar(initialScale);

    scene.add(note);
    activeNotes.push({ mesh: note, vel: velocity, life: life, initialLife: life, age: 0, initialScale, peakScale, growDuration, angularVel, emitterIndex });

    // limit number of active notes
    if (activeNotes.length > MAX_NOTES) {
        const removed = activeNotes.shift();
        scene.remove(removed.mesh);
    }
};

const spawnFromAllSpeakers = () => {
    spheresArray.forEach((sph, index) => {
        // spawn note slightly in front of sphere
        const pos = new THREE.Vector3().copy(sph.position);
        pos.z -= 0.2; // offset so it appears to come out
        spawnNote(pos, index);
    });
};

const startSpawning = () => {
    if (spawnIntervalId) return; // already spawning
    // immediate burst
    spawnFromAllSpeakers();
    // then repeat while pressed
    spawnIntervalId = setInterval(spawnFromAllSpeakers, 220);
};

const stopSpawning = () => {
    if (spawnIntervalId) {
        clearInterval(spawnIntervalId);
        spawnIntervalId = null;
    }
};

// Set up button interaction (mouse and touch)
const playButton = document.getElementById('playButton');
const onPressStart = (e) => {
    e.preventDefault();
    setupAudio();
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    playRandomSong();
    startSpawning();
};

const onPressEnd = (e) => {
    e && e.preventDefault();
    stopSong();
    stopSpawning();
};

playButton.addEventListener('mousedown', onPressStart);
playButton.addEventListener('mouseup', onPressEnd);
playButton.addEventListener('mouseleave', onPressEnd);
playButton.addEventListener('touchstart', onPressStart, { passive: false });
playButton.addEventListener('touchend', onPressEnd);

// Function to update sphere sizes based on audio
const updateSpheres = () => {
    if (!analyser || !audioContext || audioContext.state !== 'running') return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    // expose for notes to use
    freqData = dataArray;

    // Use different frequency bands for each sphere
    const spheres = [sphere1, sphere2, sphere3, sphere4];
    spheres.forEach((sphere, index) => {
        const value = dataArray[index * 2] / 255.0; // Normalize to 0-1
        const scale = 1 + value * 0.3; // Scale between 1x and 2.5x
        sphere.scale.set(scale, scale, scale);
    });
};

// responsive canvas: update on window resize
const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', onWindowResize, { passive: true });

// ----------------- Raycasting for clickable sphere -----------------
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isSpherePressed = false;

function onMouseDown(event) {
    // Check if the click is on the canvas
    if (event.target !== renderer.domElement) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.parent === clickableSphere || intersects[i].object === clickableSphere) {
            isSpherePressed = true;
            onPressStart(event);
            break;
        }
    }
}

function onMouseUp(event) {
    if (isSpherePressed) {
        onPressEnd(event);
        isSpherePressed = false;
    }
}

window.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('mouseup', onMouseUp, false);
// Also handle touch events for mobile
window.addEventListener('touchstart', onMouseDown, false);
window.addEventListener('touchend', onMouseUp, false);


// ---------------------------------------------------------------

const animate = () => {
    // Call animate recursively
    requestAnimationFrame(animate);

    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    // Update the controls
    controls.update();

    // Update sphere animations
    updateSpheres();

    // Update active spawned notes: movement, life, fading
    for (let i = activeNotes.length - 1; i >= 0; i--) {
        const n = activeNotes[i];
        // move according to velocity
        n.mesh.position.x += n.vel.x * delta;
        n.mesh.position.y += n.vel.y * delta;
        n.mesh.position.z += n.vel.z * delta;

        // rotate according to angular velocity
        if (n.angularVel) {
            n.mesh.rotation.x += n.angularVel.x * delta;
            n.mesh.rotation.y += n.angularVel.y * delta;
            n.mesh.rotation.z += n.angularVel.z * delta;
        }

        // update age and life
        n.age = (n.age || 0) + delta;
        n.life -= delta;

        // compute scale: grow from initialScale -> peakScale during growDuration, then slowly shrink while fading
        let scaleVal = n.peakScale;
        if (n.age < n.growDuration) {
            const gT = n.age / n.growDuration;
            scaleVal = n.initialScale + (n.peakScale - n.initialScale) * gT;
        } else {
            const decayT = Math.max(0, n.life / n.initialLife);
            // after growth, shrink to ~30% of peak by end of life
            scaleVal = n.peakScale * (0.3 + 0.7 * decayT);
        }

        // Modulate scale by audio if available. Use the emitterIndex to pick a band similar to spheres
        if (freqData && typeof n.emitterIndex === 'number') {
            const bandIndex = Math.min(freqData.length - 1, n.emitterIndex * 2);
            const audioVal = freqData[bandIndex] / 255.0; // 0..1
            // audio effect multiplier (tweak 0.0..1.0)
            const audioInfluence = 0.9; // how strongly audio affects note size
            scaleVal *= 1 + audioVal * audioInfluence;
        }

        n.mesh.scale.setScalar(scaleVal);

        // fade opacity as life decreases
        const opacity = Math.max(0, Math.min(1, n.life / n.initialLife));
        n.mesh.traverse((child) => {
            if (child.isMesh && child.material) {
                if (!child.material.transparent) child.material.transparent = true;
                child.material.opacity = opacity;
            }
        });

        if (n.life <= 0) {
            scene.remove(n.mesh);
            activeNotes.splice(i, 1);
        }
    }

    // Render the scene
    renderer.render(scene, camera);
}

// Call animate for the first time
animate();
