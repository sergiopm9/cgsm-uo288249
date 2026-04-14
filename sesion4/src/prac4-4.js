import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2b2b2b);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
camera.position.set(0, 90, 260);

// Set up AudioListener
const listener = new THREE.AudioListener();
camera.add(listener);

const controls = new FirstPersonControls(camera, renderer.domElement);
controls.movementSpeed = 70;
controls.lookSpeed = 0.05;
controls.noFly = false;
controls.lookVertical = true;

const helper = new THREE.GridHelper(800, 40, 0x444444, 0x444444);
helper.position.y = 0.1;
scene.add(helper);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(0, 0.5, 100);
scene.add(directionalLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xf0f0f0, 0.6);
hemiLight.position.set(0, 500, 0);
scene.add(hemiLight);

const textureLoader = new THREE.TextureLoader();

const regularTexture = textureLoader.load('textures/brick.jpg');
const regularBump = textureLoader.load('textures/brick-map.jpg');
const specialBump = textureLoader.load('textures/brick-map-with-button.png');

const textura_on = textureLoader.load('textures/textura_on.png');
const textura_off = textureLoader.load('textures/textura_off.png');

regularTexture.colorSpace = THREE.SRGBColorSpace;
textura_on.colorSpace = THREE.SRGBColorSpace;
textura_off.colorSpace = THREE.SRGBColorSpace;

const regularFaceMaterial = new THREE.MeshPhongMaterial({
    map: regularTexture,
    bumpMap: regularBump,
    bumpScale: 2,
    specular: 0x333333,
    shininess: 35
});

const leftSpecialFaceMaterial = new THREE.MeshPhongMaterial({
    map: textura_on,
    bumpMap: specialBump,
    bumpScale: 2,
    specular: 0x555555,
    shininess: 50
});

const rightSpecialFaceMaterial = new THREE.MeshPhongMaterial({
    map: textura_on,
    bumpMap: specialBump,
    bumpScale: 2,
    specular: 0x555555,
    shininess: 50
});

const leftCubeMaterials = [
    leftSpecialFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial
];

const rightCubeMaterials = [
    regularFaceMaterial,
    rightSpecialFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial,
    regularFaceMaterial
];

const cubeGeometry = new THREE.BoxGeometry(50, 50, 50);

const leftCube = new THREE.Mesh(cubeGeometry, leftCubeMaterials);
leftCube.name = 'Caja Izquierda';
leftCube.position.set(-220, 25, 0);

const rightCube = new THREE.Mesh(cubeGeometry, rightCubeMaterials);
rightCube.name = 'Caja Derecha';
rightCube.position.set(220, 25, 0);

scene.add(leftCube);
scene.add(rightCube);

// Add Audio to left cube
const audioLoader = new THREE.AudioLoader();
const sound1 = new THREE.PositionalAudio(listener);
audioLoader.load('sounds/audio 1.mp3', (buffer) => {
    sound1.setBuffer(buffer);
    sound1.setRefDistance(20);
    sound1.setLoop(true);
    sound1.setRolloffFactor(1);
    sound1.play(); 
});
leftCube.add(sound1);

// Add Audio to right cube
const sound2 = new THREE.PositionalAudio(listener);
audioLoader.load('sounds/audio 2.mp3', (buffer) => {
    sound2.setBuffer(buffer);
    sound2.setRefDistance(20);
    sound2.setLoop(true);
    sound2.setRolloffFactor(1);
    sound2.play(); 
});
rightCube.add(sound2);

// User interaction to resume audio context
document.body.addEventListener('click', () => {
    if (listener.context.state === 'suspended') {
        listener.context.resume();
    }
});

const rayCaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let intersectedObject = null;

document.body.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}, false);

document.body.addEventListener('keydown', (event) => {
    const spaceKeyCode = "Space";
    if (event.code == spaceKeyCode && intersectedObject) {
        const sound = intersectedObject.children.find(c => c.type === 'Audio' || c.type === 'PositionalAudio');
        if (sound) {
            const isLeft = intersectedObject.name === 'Caja Izquierda';
            const faceIndex = isLeft ? 0 : 1;
            
            if (sound.isPlaying === true) {
                sound.pause();
                intersectedObject.material[faceIndex].map = textura_off;
            } else {
                sound.play();
                intersectedObject.material[faceIndex].map = textura_on;
            }
            intersectedObject.material[faceIndex].needsUpdate = true;
        }
    }
}, false);

const movements = [
    new THREE.Vector3(0, 0, 1).normalize(),   // Forward
    new THREE.Vector3(1, 0, 1).normalize(),   // Forward-left
    new THREE.Vector3(1, 0, 0).normalize(),   // Left
    new THREE.Vector3(1, 0, -1).normalize(),  // Backward-left
    new THREE.Vector3(0, 0, -1).normalize(),  // Backward
    new THREE.Vector3(-1, 0, -1).normalize(), // Backward-right
    new THREE.Vector3(-1, 0, 0).normalize(),  // Right
    new THREE.Vector3(-1, 0, 1).normalize()   // Forward-right
];

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    controls.update(delta);

    let hasCollision = false;
    const distance = 20;

    for (let i = 0; i < movements.length; i++) {
        rayCaster.set(camera.position, movements[i]);
        let collisions = rayCaster.intersectObjects(scene.children);
        if (collisions.length > 0 && collisions[0].distance <= distance) {
            hasCollision = true;
            break;
        }
    }

    if (hasCollision) {
        controls.update(-delta);
    }

    rayCaster.setFromCamera(mouse, camera);

    // Look for all the intersected objects
    const intersects = rayCaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        // Sorted by Z (close to the camera)
        if (intersectedObject != intersects[0].object) {
            intersectedObject = intersects[0].object;
            console.log('New intersected object: ' + intersectedObject.name);
        }
    } else {
        intersectedObject = null;
    }

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
}, false);

animate();
