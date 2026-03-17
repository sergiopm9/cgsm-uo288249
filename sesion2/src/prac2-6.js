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
    camera.position.set(0, 0, 500); // Alejamos un poco la cámara para que se vea el sistema Tierra-Luna

    // Textures Loader
    const textureLoader = new THREE.TextureLoader();

    // 4. Crear la Tierra (Escala 1, radio 60)
    const earthRadius = 60;
    const geometry = new THREE.SphereGeometry(earthRadius, 32, 32);
    
    // Cargar textura Tierra
    const map = textureLoader.load(
        "textures/map.png",
        () => { renderer.render(scene, camera); }
    );

    const material = new THREE.MeshPhongMaterial({
        map: map,
        color: 0x156289,
        specular: 0x222222,
        shininess: 30,
        flatShading: false  
    });

    const sphere = new THREE.Mesh(geometry, material);
    
    // 4.5 Crear la atmósfera con MeshLambertMaterial
    const atmosGeometry = new THREE.SphereGeometry(earthRadius + 1, 32, 32); 
    const cloudMap = textureLoader.load(
        "textures/clouds.png",
        () => { renderer.render(scene, camera); }
    );

    const atmosMaterial = new THREE.MeshLambertMaterial({
        map: cloudMap,
        color: 0xffffff,
        transparent: true,
        opacity: 0.5 
    });
    
    const atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);

    // Grupo Tierra (Inclinación 23 grados)
    const earthGroup = new THREE.Object3D();
    earthGroup.add(sphere);
    earthGroup.add(atmosphere);
    earthGroup.rotation.z = 0.36; // 23 grados

    scene.add(earthGroup);

    // 5. Crear la Luna (Escala 0.27)
    const moonRadius = earthRadius * 0.27;
    const moonGeometry = new THREE.SphereGeometry(moonRadius, 32, 32);
    
    // Cargar textura Luna
    const moonMap = textureLoader.load(
        "textures/moon.png",
        () => { renderer.render(scene, camera); }
    );

    const moonMaterial = new THREE.MeshLambertMaterial({
        map: moonMap,
        color: 0x888888 
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    // Distancia Tierra-Luna (aprox 30 veces el diámetro de la Tierra, pero usaremos algo visible)
    const distance = 250; 
    
    // Move the Moon away from the coordinate origin (the Earth)
    moon.position.set( Math.sqrt( distance * distance / 2 ), 0, -Math.sqrt( distance * distance / 2 ) );

    // Rotate the Moon to face visible side to the Earth (tidal locking)
    moon.rotation.y = Math.PI;

    // Moon should rotate around the Earth: an Object3D is needed
    const moonGroup = new THREE.Object3D( );
    moonGroup.add( moon );

    // The Moon orbit is a bit tilted
    moonGroup.rotation.x = 0.089;

    scene.add(moonGroup);

    // 6. Crear la iluminación (Sol lateral)
    const pointLight = new THREE.PointLight(0xffffff, 1000000, 0); 
    pointLight.position.set(400, 0, 100); 
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 2); 
    scene.add(ambientLight);

    // Manejar redimensionamiento
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);

    // 7. Animación
    const clock = new THREE.Clock();

    function animate() {
        const delta = clock.getDelta(); // Tiempo transcurrido en segundos

        // 7.1 Actualizar la escena según el tiempo transcurrido
        // Una rotación completa cada 24 "unidades" de tiempo (ej. segundos en este caso o factor de escala)
        const rotation = (delta * Math.PI * 2) / 24;
        
        // Rotamos la malla de la tierra (sphere) y su atmósfera
        sphere.rotation.y += rotation;
        atmosphere.rotation.y += rotation * 0.95; // La atmósfera gira un poco más lento

        // Renderizar la escena
        renderer.render(scene, camera);

        // Solicitar al navegador el siguiente frame
        requestAnimationFrame(animate);
    }

    // Iniciar el bucle de animación
    animate();

} else {
    // WebGL is not available
    const warning = WEBGL.getWebGL2ErrorMessage();
    document.body.appendChild(warning);
    console.error('WebGL2 is not available');
}
