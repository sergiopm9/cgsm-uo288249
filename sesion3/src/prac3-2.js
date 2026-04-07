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
let reversePlaybackReady = false;
const reverseSpeed = 1.0;
const endFrameOffset = 0.001;
let seekPending = false;
let reverseAccumulator = 0;
const reverseStep = 1 / 30;

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => init(), false);

function init() {
    const overlay = document.getElementById('overlay');
    overlay.remove();

    setupScene();
    setupVideoTexture();
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

function setupVideoTexture() {
    video = document.getElementById('video');
    video.muted = true;

    image = document.createElement('canvas');
    image.width = 480;
    image.height = 204;

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

    const moveToVideoEnd = () => {
        reversePlaybackReady = false;
        video.pause();
        video.currentTime = Math.max(0, video.duration - endFrameOffset);
    };

    const drawCurrentFrame = () => {
        if (video.readyState >= video.HAVE_CURRENT_DATA) {
            imageContext.drawImage(video, 0, 0);
            texture.needsUpdate = true;
        }
    };

    video.addEventListener('seeked', () => {
        seekPending = false;
        reversePlaybackReady = true;
        drawCurrentFrame();
    });

    if (video.readyState >= video.HAVE_METADATA) {
        moveToVideoEnd();
    } else {
        video.addEventListener('loadedmetadata', moveToVideoEnd, { once: true });
    }

    video.play().then(() => {
        video.pause();
    }).catch((error) => {
        console.error('No se pudo preparar el vídeo tras el click:', error);
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

    if (reversePlaybackReady && !controlData.pause) {
        reverseAccumulator += delta * reverseSpeed;

        if (!seekPending && !video.seeking && reverseAccumulator >= reverseStep) {
            const nextTime = video.currentTime - reverseAccumulator;
            reverseAccumulator = 0;
            seekPending = true;

            if (nextTime <= 0) {
                video.currentTime = Math.max(0, video.duration - endFrameOffset);
            } else {
                video.currentTime = nextTime;
            }
        }
    }

    if (wall) {
        wall.rotation.y += delta * 0.75;
    }

    stats.update();
    renderer.render(scene, camera);
}
