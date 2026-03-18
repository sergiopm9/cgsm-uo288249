import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

// Shaders
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';

if (WEBGL.isWebGL2Available()) {
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    // Posición para ver la ISS de cerca y los planetas al fondo
    camera.position.set(0, 20, 200);

    const textureLoader = new THREE.TextureLoader();

    // --- 1. SOL (Fondo lejano) ---
    const sunRadius = 400;
    const sunGeometry = new THREE.SphereGeometry(sunRadius, 64, 64);
    const NOISEMAP = 'textures/texture1.png';
    const SUNMAP = 'textures/texture2.png';

    const uniforms = {
        "fogDensity": { value: 0 },
        "fogColor": { value: new THREE.Vector3(0, 0, 0) },
        "time": { value: 1.0 },
        "uvScale": { value: new THREE.Vector2(3.0, 1.0) },
        "texture1": { value: textureLoader.load(NOISEMAP) },
        "texture2": { value: textureLoader.load(SUNMAP) }
    };

    uniforms["texture1"].value.wrapS = uniforms["texture1"].value.wrapT = THREE.RepeatWrapping;
    uniforms["texture2"].value.wrapS = uniforms["texture2"].value.wrapT = THREE.RepeatWrapping;

    const sunMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    // El Sol un poco más cerca para composición
    sun.position.set(-1500, 400, -2500);
    scene.add(sun);

    // --- 2. SISTEMA TIERRA (Fondo) ---
    const earthRadius = 60;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 32, 32);
    const earthMap = textureLoader.load("textures/map.png");
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthMap,
        color: 0x156289,
        specular: 0x222222,
        shininess: 30
    });
    const earthGlobe = new THREE.Mesh(earthGeometry, earthMaterial);

    const atmosGeometry = new THREE.SphereGeometry(earthRadius + 1, 32, 32);
    const cloudMap = textureLoader.load("textures/clouds.png");
    const atmosMaterial = new THREE.MeshLambertMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.5
    });
    const atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);

    const earthGroup = new THREE.Object3D();
    earthGroup.add(earthGlobe);
    earthGroup.add(atmosphere);
    earthGroup.rotation.z = 0.36;

    const moonRadius = earthRadius * 0.27;
    const moonGeometry = new THREE.SphereGeometry(moonRadius, 32, 32);
    const moonMap = textureLoader.load("textures/moon.png");
    const moonMaterial = new THREE.MeshLambertMaterial({ map: moonMap, color: 0x888888 });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    const moonDistance = 200;
    moon.position.set(Math.sqrt(moonDistance * moonDistance / 2), 0, -Math.sqrt(moonDistance * moonDistance / 2));
    moon.rotation.y = Math.PI;

    const moonGroup = new THREE.Object3D();
    moonGroup.add(moon);
    moonGroup.rotation.x = 0.089;

    const earthContainer = new THREE.Object3D();
    // Traemos la Tierra mucho más cerca para que la ISS parezca su satélite
    earthContainer.position.set(250, -50, -500); 
    earthContainer.add(earthGroup);
    earthContainer.add(moonGroup);
    scene.add(earthContainer);

    // --- 3. ISS (Primer plano) ---
    const modelUrl = "models/models/iss.dae";
    let iss;

    const loadingManager = new THREE.LoadingManager(() => {
        scene.add(iss);
        console.log('Model loaded');
    });

    const loader = new ColladaLoader(loadingManager);
    loader.load(modelUrl, (collada) => {
        iss = collada.scene;
        iss.scale.x = iss.scale.y = iss.scale.z = 0.5; // Un poco más grande para el primer plano
        iss.position.set(0, 0, 0); // En el centro/primer plano
        iss.rotation.set(Math.PI / 8, Math.PI / 4, 0);
        iss.updateMatrix();
    });

    // --- 4. ILUMINACIÓN ---
    // Luz que emana del Sol (posicionada igual que el Sol)
    const pointLight = new THREE.PointLight(0xffffff, 40000000, 0); // Doblada intensidad
    pointLight.position.copy(sun.position);
    scene.add(pointLight);

    // Luz frontal para la ISS
    const frontalLight = new THREE.DirectionalLight(0xffffff, 2.5); // Aumentada de 1.5 a 2.5
    frontalLight.position.set(0, 100, 500);
    scene.add(frontalLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 1.2); // Aumentada de 0.8 a 1.2
    scene.add(ambientLight);

    // --- 5. ANIMACIÓN ---
    const clock = new THREE.Clock();

    function animate() {
        const delta = clock.getDelta();
        const rotationFactor = (delta * Math.PI * 2) / 24;

        // Animar Sol
        uniforms["time"].value += 0.2 * delta;
        sun.rotation.y += 0.01 * delta;

        // Animar Tierra
        earthGlobe.rotation.y += rotationFactor;
        atmosphere.rotation.y += rotationFactor * 0.95;
        moonGroup.rotation.y += rotationFactor / 28;

        // Animar ISS
        if (iss) {
            iss.rotation.y += 0.1 * delta;
            iss.rotation.z += 0.05 * delta;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    animate();

} else {
    document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
}
