import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

if ( WEBGL.isWebGL2Available() ) {

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000 );
    document.body.appendChild( renderer.domElement );

    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 0, 0, 700 );

    // ---- Luces (necesarias para Lambert y Phong) ----
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.3 );
    scene.add( ambientLight );

    const pointLight = new THREE.PointLight( 0xffffff, 150000 );
    pointLight.position.set( 200, 300, 300 );
    scene.add( pointLight );

    // ---- Cubo rojo - MeshBasicMaterial (no necesita luz) ----
    const boxGeometry = new THREE.BoxGeometry( 100, 100, 100 );
    const boxMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const box = new THREE.Mesh( boxGeometry, boxMaterial );
    box.position.set( -200, 0, 0 );
    box.rotation.set( Math.PI / 5, Math.PI / 5, 0 );
    scene.add( box );

    // ---- Cilindro azul - MeshLambertMaterial (componentes ambiental y difusa) ----
    const cylinderGeometry = new THREE.CylinderGeometry( 50, 50, 100, 32 );
    const cylinderMaterial = new THREE.MeshLambertMaterial( { color: 0x0000ff } );
    const cylinder = new THREE.Mesh( cylinderGeometry, cylinderMaterial );
    cylinder.position.set( 0, 0, 0 );
    cylinder.rotation.x = Math.PI / 8; // Rotar ligeramente para ver la arista superior
    scene.add( cylinder );

    // ---- Esfera verde - MeshPhongMaterial (ambiental, difusa y especular) ----
    const sphereGeometry = new THREE.SphereGeometry( 70, 32, 32 );
    const sphereMaterial = new THREE.MeshPhongMaterial( { color: 0x00ff00, shininess: 100 } );
    const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
    sphere.position.set( 200, 0, 0 );
    scene.add( sphere );
    //
    const houseGeometry = new THREE.BufferGeometry();
    const outer = 80;
    const roofHeight = 100;
    const houseVertices = new Float32Array( [
        // Contorno exterior base
        -outer, -outer, 0,  // 0 - inf izq
         outer, -outer, 0,  // 1 - inf der
         outer,  outer, 0,  // 2 - sup der
        -outer,  outer, 0,  // 3 - sup izq

        // Ventana izquierda (cuadrado)
        -65,  30, 0,  // 4 - sup izq vent izq
        -35,  30, 0,  // 5 - sup der vent izq
        -35, -10, 0,  // 6 - inf der vent izq
        -65, -10, 0,  // 7 - inf izq vent izq

        // Ventana derecha (cuadrado)
         35,  30, 0,  // 8  - sup izq vent der
         65,  30, 0,  // 9  - sup der vent der
         65, -10, 0,  // 10 - inf der vent der
         35, -10, 0,  // 11 - inf izq vent der

        // Puerta (rectángulo más alto que ancho, centrado)
        -18, -10, 0,  // 12 - sup izq puerta
         18, -10, 0,  // 13 - sup der puerta
         18, -outer, 0,  // 14* reutilizamos inf der puerta = suelo
        -18, -outer, 0,  // 15* reutilizamos inf izq puerta = suelo

        // Tejado
        -outer,  outer, 0,  // 16 = mismo que 3 (repetido para claridad)
         outer,  outer, 0,  // 17 = mismo que 2
             0,  outer + roofHeight, 0  // 18 - pico
    ] );

    const houseIndices = [
        // Franja superior (entre techo y ventanas)
        3, 7, 4,    // sup izq sobre vent izq
        3, 4, 5,
        3, 5, 8,    // franja central superior
        3, 8, 9,
        3, 9, 2,    // sup der sobre vent der
        2, 9, 10,

        // Lateral izquierdo (entre borde izq y vent izq)
        3, 0, 7,
        0, 6, 7,

        // Lateral derecho (entre vent der y borde der)
        2, 10, 1,
        1, 10, 11,

        // Franja central (entre las dos ventanas, sobre la puerta)
        5, 6, 11,   // entre vents, fila baja
        5, 11, 8,   // entre vents, fila alta

        // Franja izquierda de puerta (entre vent izq y puerta)
        6, 0, 15,   // columna inf izq
        6, 15, 12,  // columna sup izq

        // Franja derecha de puerta (entre puerta y vent der)
        11, 13, 14,  // columna inf der (tri izq)
        11, 14, 1,   // columna inf der (tri der)
        11, 12, 13,  // columna sup der
        10, 11, 1,   // debajo vent der hasta suelo

        // Suelo (debajo de ventanas, a los lados de la puerta)
        0, 1, 15,   // tri izq suelo
        1, 14, 15,  // tri der suelo

        // Tejado
        3, 2, 18
    ];

    houseGeometry.setIndex( houseIndices );
    houseGeometry.setAttribute( 'position', new THREE.BufferAttribute( houseVertices, 3 ) );
    houseGeometry.computeVertexNormals();
    const houseMaterial = new THREE.MeshBasicMaterial( { color: 0xff6600, side: THREE.DoubleSide } );
    const house = new THREE.Mesh( houseGeometry, houseMaterial );
    house.position.set( 420, 0, 0 );
    scene.add( house );

    window.addEventListener( 'resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.render( scene, camera );
    } );

    renderer.render( scene, camera );

} else {
    const warning = WEBGL.getWebGL2ErrorMessage();
    document.body.appendChild( warning );
}
