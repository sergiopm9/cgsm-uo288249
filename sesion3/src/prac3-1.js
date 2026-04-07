import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2f2f2f);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
camera.position.set(0, 60, 320);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

const geometry = new THREE.BoxGeometry(100, 100, 100);

const textureLoader = new THREE.TextureLoader();
const brickTexture = textureLoader.load('textures/brick.jpg');
const bumpTexture = textureLoader.load('textures/brick-map.jpg');

brickTexture.colorSpace = THREE.SRGBColorSpace;

const basicMaterial = new THREE.MeshPhongMaterial({
    map: brickTexture,
    specular: 0x222222,
    shininess: 10
});

const bumpMaterial = new THREE.MeshPhongMaterial({
    map: brickTexture,
    bumpMap: bumpTexture,
    bumpScale: 3.0,
    specular: 0xaaaaaa,
    shininess: 90
});

const leftCube = new THREE.Mesh(geometry, basicMaterial);
leftCube.position.x = -80;

const rightCube = new THREE.Mesh(geometry, bumpMaterial);
rightCube.position.x = 80;

scene.add(leftCube);
scene.add(rightCube);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
keyLight.position.set(260, 35, 75);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
fillLight.position.set(-180, 140, -200);
scene.add(fillLight);

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const rotationSpeed = delta * 0.8;

    leftCube.rotation.y += rotationSpeed;
    rightCube.rotation.y += rotationSpeed;

    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

leftCube.rotation.set(Math.PI / 6, Math.PI / 5, 0);
rightCube.rotation.set(Math.PI / 6, Math.PI / 5, 0);

animate();