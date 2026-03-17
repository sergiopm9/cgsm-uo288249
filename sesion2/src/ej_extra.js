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

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(0, 1500, 4000); 
    camera.lookAt(0, 0, 0);

    const textureLoader = new THREE.TextureLoader();

    // --- 1. SOL (Centro) ---
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
    scene.add(sun);

    // --- 2. SISTEMA TIERRA (Orbitando Sol) ---
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
    earthGroup.rotation.z = 0.36; // Inclinación

    // Luna
    const moonRadius = earthRadius * 0.27;
    const moonGeometry = new THREE.SphereGeometry(moonRadius, 32, 32);
    const moonMap = textureLoader.load("textures/moon.png");
    const moonMaterial = new THREE.MeshLambertMaterial({ map: moonMap, color: 0x888888 });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    const moonDistance = 200;
    moon.position.set(moonDistance, 0, 0);

    const moonGroup = new THREE.Object3D();
    moonGroup.add(moon);

    const earthSystem = new THREE.Object3D();
    earthSystem.add(earthGroup);
    earthSystem.add(moonGroup);
    earthSystem.position.set(1500, 0, 0); // Distancia al Sol

    const earthOrbitGroup = new THREE.Object3D();
    earthOrbitGroup.add(earthSystem);
    scene.add(earthOrbitGroup);

    // --- 3. ISS (Orbitando Tierra) ---
    const modelUrl = "models/models/iss.dae";
    let iss;

    const loadingManager = new THREE.LoadingManager(() => {
        console.log('ISS loaded in solar system');
    });

    const loader = new ColladaLoader(loadingManager);
    loader.load(modelUrl, (collada) => {
        iss = collada.scene;
        iss.scale.set(0.15, 0.15, 0.15);
        iss.position.set(earthRadius + 30, 0, 0); // Orbita la Tierra de cerca
        earthSystem.add(iss);
    });

    // --- 4. ILUMINACIÓN ---
    const pointLight = new THREE.PointLight(0xffffff, 4000000, 0); // Doblada la intensidad
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 1.2); // Aumentada de 0.8 a 1.2
    scene.add(ambientLight);

    // --- 5. ANIMACIÓN ---
    const clock = new THREE.Clock();

    function animate() {
        const delta = clock.getDelta();
        
        // Sol
        uniforms["time"].value += 0.2 * delta;
        sun.rotation.y += 0.01 * delta;

        // Tierra rotación propia (Aumentada)
        const rotEarth = (delta * Math.PI * 2) / 6; // Ahora 4 veces más rápida
        earthGlobe.rotation.y += rotEarth;
        atmosphere.rotation.y += rotEarth * 0.95;

        // Luna órbita Tierra (Aumentada)
        moonGroup.rotation.y += rotEarth / 14; // El doble de rápido proporcionalmente

        // Tierra órbita Sol (Aumentada)
        earthOrbitGroup.rotation.y += rotEarth / 180; // El doble de rápido proporcionalmente

        // ISS órbita Tierra (rápida)
        if (iss) {
            iss.rotation.y += 0.5 * delta;
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
