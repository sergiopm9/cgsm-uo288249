import adapter from 'webrtc-adapter';
import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

let scene;
let renderer;
let camera;
let wall;
let video;
let image;
let imageContext;
let texture;
let stats;
let controlData;
const clock = new THREE.Clock();

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => init(), false);

function init() {
    const overlay = document.getElementById('overlay');
    overlay.remove();

    setupScene();
    setupWebcamTexture();
    animate();
}

function setupScene() {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x111111);
    document.body.appendChild(renderer.domElement);

    stats = new Stats();
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '0px';
    document.body.appendChild(stats.dom);

    controlData = {
        pause: false
    };

    const gui = new GUI({ title: 'Controles' });
    gui.add(controlData, 'pause').name('Pause');

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(0, 0, 650);

    window.addEventListener('resize', onWindowResize, false);
}

function setupWebcamTexture() {
    video = document.getElementById('video');
    video.muted = true;

    image = document.createElement('canvas');
    image.width = 480;
    image.height = 270;

    imageContext = image.getContext('2d');
    imageContext.fillStyle = '#000000';
    imageContext.fillRect(0, 0, image.width - 1, image.height - 1);

    texture = new THREE.Texture(image);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = false;

    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    wall = new THREE.Mesh(new THREE.PlaneGeometry(image.width, image.height, 4, 4), material);
    scene.add(wall);

    const constraints = {
        audio: false,
        video: true
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((error) => {
            console.error('Error in getUserMedia: ' + error.name, error);
        });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (video && video.readyState >= video.HAVE_CURRENT_DATA) {
        imageContext.drawImage(video, 0, 0, image.width, image.height);
        texture.needsUpdate = true;
    }

    if (!controlData.pause && wall) {
        wall.rotation.y += delta * 0.75;
    }

    stats.update();
    renderer.render(scene, camera);
}

void adapter;
