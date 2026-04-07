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
const specialTexture = textureLoader.load('textures/brick-with-button.png');
const specialBump = textureLoader.load('textures/brick-map-with-button.png');

regularTexture.colorSpace = THREE.SRGBColorSpace;
specialTexture.colorSpace = THREE.SRGBColorSpace;

const regularFaceMaterial = new THREE.MeshPhongMaterial({
    map: regularTexture,
    bumpMap: regularBump,
    bumpScale: 2,
    specular: 0x333333,
    shininess: 35
});

const leftSpecialFaceMaterial = new THREE.MeshPhongMaterial({
    map: specialTexture,
    bumpMap: specialBump,
    bumpScale: 2,
    specular: 0x555555,
    shininess: 50
});

const rightSpecialFaceMaterial = new THREE.MeshPhongMaterial({
    map: specialTexture,
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
leftCube.position.set(-220, 25, 0);

const rightCube = new THREE.Mesh(cubeGeometry, rightCubeMaterials);
rightCube.position.set(220, 25, 0);

scene.add(leftCube);
scene.add(rightCube);

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    controls.update(delta);

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
}, false);

animate();
