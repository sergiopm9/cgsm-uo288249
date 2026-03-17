import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

if (WEBGL.isWebGL2Available()) {
    // WebGL is available
    console.log('WebGL2 is available');

    // 1. Crear la escena
    const scene = new THREE.Scene();

    // 2. Crear el renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 3. Crear la cámara
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(0, 0, 300);

    // 4. Crear la esfera con MeshPhongMaterial
    const geometry = new THREE.SphereGeometry(60, 32, 32); // Radio, widthSegments, heightSegments
    
    // Cargar textura
    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load(
        "textures/map.png",
        () => { renderer.render(scene, camera); } // Render when loaded
    );

    // MeshPhongMaterial reacciona a la luz y le añadimos el mapa
    const material = new THREE.MeshPhongMaterial({
        map: map,
        color: 0x156289,    // Color base difuso (opcional si hay mapa, se multiplicará)
        emissive: 0x000000, 
        specular: 0x222222, // Reflejo especular
        shininess: 30,      // Brillo
        flatShading: false  
    });

    const sphere = new THREE.Mesh(geometry, material);
    
    // 4.5 Crear la atmósfera con MeshLambertMaterial (sin reflejos especulares de la luz solar)
    const atmosGeometry = new THREE.SphereGeometry(61, 32, 32); // Un poco más grande que el planeta
    
    // Cargar textura de nubes
    const cloudTextureLoader = new THREE.TextureLoader();
    const cloudMap = cloudTextureLoader.load(
        "textures/clouds.png",
        () => { renderer.render(scene, camera); } // Render when loaded
    );

    const atmosMaterial = new THREE.MeshLambertMaterial({
        map: cloudMap,
        color: 0xffffff,
        transparent: true,
        opacity: 0.5 // Semitransparente para ver el planeta
    });
    
    const atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);

    // 4.8 Crear grupo para rotar ambos (Tierra y Atmósfera) juntos
    const earthGroup = new THREE.Object3D();
    earthGroup.add(sphere);
    earthGroup.add(atmosphere);

    // Inclinación axial de la Tierra de ~23 grados (0.36 radianes) sobre el eje Z
    // El plano de órbita será Z=0 (plano XY) pero para que el "norte" se incline respecto a ese plano de giro, rotamos en Z:
    earthGroup.rotation.z = 0.36; 

    scene.add(earthGroup);

    // 5. Crear la iluminación (PointLight simulando un sol lateral)
    // En las versiones recientes de Three.js (PBR pipeline por defecto incluso para Phong), 
    // la intensidad debe ser superior y distance=0 hace que decaiga físicamente sin límite abrupto
    const pointLight = new THREE.PointLight(0xffffff, 500000, 0); // Mayor intensidad 
    // Posicionada lateralmente y un poco hacia el frente
    pointLight.position.set(200, 0, 100); 
    scene.add(pointLight);

    // Además añadimos una luz ambiental sutil para que no esté 100% oscura la parte con sombra
    const ambientLight = new THREE.AmbientLight(0x404040, 5); // Tono gris oscuro
    scene.add(ambientLight);

    // Manejar redimensionamiento
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);

    // 6. Renderizar escena
    renderer.render(scene, camera);

} else {
    // WebGL is not available
    const warning = WEBGL.getWebGL2ErrorMessage();
    document.body.appendChild(warning);
    console.error('WebGL2 is not available');
}
