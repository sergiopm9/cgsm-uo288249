import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

// Import shaders as strings using webpack-glsl-loader
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';

if (WEBGL.isWebGL2Available()) {
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(500, 400, 2200); // Ángulo ajustado para ver la Luna tras la Tierra
    camera.lookAt(600, 0, 0); // Apuntamos entre el Sol y la Tierra

    const textureLoader = new THREE.TextureLoader();

    // --- 1. CONFIGURACIÓN DEL SOL (ESFERA CON SHADER) ---
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
    
    // Sol en el centro
    const sunPosition = new THREE.Vector3(0, 0, 0); 
    sun.position.copy(sunPosition);
    scene.add(sun);

    // --- 2. SISTEMA TIERRA ---
    // Posicionamos la Tierra a una distancia donde se vea bien separada del Sol
    const earthSystemPos = new THREE.Vector3(1200, 0, 0); 

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
    
    // Contenedor para posicionar el sistema tierra-luna
    const earthContainer = new THREE.Object3D();
    earthContainer.position.copy(earthSystemPos);
    earthContainer.add(earthGroup);
    scene.add(earthContainer);

    // --- 3. LUNA ---
    const moonRadius = earthRadius * 0.27;
    const moonGeometry = new THREE.SphereGeometry(moonRadius, 32, 32);
    const moonMap = textureLoader.load("textures/moon.png");
    const moonMaterial = new THREE.MeshLambertMaterial({
        map: moonMap,
        color: 0x888888
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    
    const moonDistance = 200; 
    moon.position.set(Math.sqrt(moonDistance * moonDistance / 2), 0, -Math.sqrt(moonDistance * moonDistance / 2));
    moon.rotation.y = Math.PI;

    const moonGroup = new THREE.Object3D();
    moonGroup.add(moon);
    moonGroup.rotation.x = 0.089; 
    earthContainer.add(moonGroup); 

    // --- 4. ILUMINACIÓN ---
    const pointLight = new THREE.PointLight(0xffffff, 8000000, 0);
    pointLight.position.copy(sunPosition);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // --- 5. ANIMACIÓN ---
    const clock = new THREE.Clock();

    function animate() {
        const delta = clock.getDelta();
        const rotation = (delta * Math.PI * 2) / 24;

        // Animar Sol
        uniforms["time"].value += 0.2 * delta;
        sun.rotation.y += 0.01 * delta; // Rotación lenta y opcional del Sol

        // Animar Tierra
        earthGlobe.rotation.y += rotation;
        atmosphere.rotation.y += rotation * 0.95;

        // Animar Luna
        moonGroup.rotation.y += rotation / 28;

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
