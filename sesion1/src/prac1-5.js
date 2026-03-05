import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
 
if (WEBGL.isWebGL2Available()) {
    // WebGL is available
    console.log('WebGL2 is available');
    
    // Crear la escena
    const scene = new THREE.Scene();
    
    // Crear el renderizador
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // Crear la cámara (más alejada para ver todos los objetos)
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(0, 0, 700);
    
    // Crear un cubo
    const boxGeometry = new THREE.BoxGeometry(100, 100, 100);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(-200, 0, 0);
    box.rotation.set(Math.PI / 5, Math.PI / 5, 0);
    scene.add(box);
    
    // Crear un cilindro
    const cylinderGeometry = new THREE.CylinderGeometry(50, 50, 100, 32);
    const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(0, 0, 0);
    cylinder.rotation.set(Math.PI / 5, Math.PI / 5, 0);
    scene.add(cylinder);
    
    // Crear una esfera
    const sphereGeometry = new THREE.SphereGeometry(50, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(200, 0, 0);
    scene.add(sphere);
    
    // Crear geometría personalizada en forma de casa
    const houseGeometry = new THREE.BufferGeometry();
    
    const inner = 40;
    const outer = 80;
    const roofHeight = 100;
    
    const vertices = new Float32Array([
        // Vértices del cuerpo de la casa (cuadrado)
        -outer, -outer, 0,  // 0: esquina inferior izquierda
        outer, -outer, 0,   // 1: esquina inferior derecha
        outer, outer, 0,    // 2: esquina superior derecha
        -outer, outer, 0,   // 3: esquina superior izquierda
        
        // Vértice del tejado (triángulo)
        0, outer + roofHeight, 0  // 4: punta del tejado
    ]);
    
    // Caras (triángulos)
    const indices = [
        // Cuerpo de la casa (cuadrado dividido en 2 triángulos)
        0, 1, 2,
        0, 2, 3,
        
        // Tejado (triángulo)
        3, 2, 4
    ];
    
    houseGeometry.setIndex(indices);
    houseGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    const houseMaterial = new THREE.MeshBasicMaterial({ color: 0xff6600, side: THREE.DoubleSide });
    const house = new THREE.Mesh(houseGeometry, houseMaterial);
    house.position.set(400, 0, 0);
    scene.add(house);
    
    // Renderizar la escena
    renderer.render(scene, camera);
    
} else {
    // WebGL is not available
    const warning = WEBGL.getWebGL2ErrorMessage();
    document.body.appendChild(warning);
    console.error('WebGL2 is not available');
}