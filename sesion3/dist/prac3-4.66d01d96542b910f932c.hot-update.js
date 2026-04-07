"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdatesesion3"]("prac3-4",{

/***/ "./src/prac3-4.js"
/*!************************!*\
  !*** ./src/prac3-4.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.core.js\");\n/* harmony import */ var three_examples_jsm_controls_FirstPersonControls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/controls/FirstPersonControls.js */ \"./node_modules/three/examples/jsm/controls/FirstPersonControls.js\");\n\r\n\r\n\r\nconst scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();\r\nscene.background = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x2b2b2b);\r\n\r\nconst renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer({ antialias: true });\r\nrenderer.setPixelRatio(window.devicePixelRatio);\r\nrenderer.setSize(window.innerWidth, window.innerHeight);\r\ndocument.body.appendChild(renderer.domElement);\r\n\r\nconst camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);\r\ncamera.position.set(0, 90, 260);\r\n\r\nconst controls = new three_examples_jsm_controls_FirstPersonControls_js__WEBPACK_IMPORTED_MODULE_2__.FirstPersonControls(camera, renderer.domElement);\r\ncontrols.movementSpeed = 70;\r\ncontrols.lookSpeed = 0.05;\r\ncontrols.noFly = false;\r\ncontrols.lookVertical = true;\r\n\r\nconst helper = new three__WEBPACK_IMPORTED_MODULE_1__.GridHelper(800, 40, 0x444444, 0x444444);\r\nhelper.position.y = 0.1;\r\nscene.add(helper);\r\n\r\nconst directionalLight = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff, 0.8);\r\ndirectionalLight.position.set(0, 0.5, 100);\r\nscene.add(directionalLight);\r\n\r\nconst hemiLight = new three__WEBPACK_IMPORTED_MODULE_1__.HemisphereLight(0xffffff, 0xf0f0f0, 0.6);\r\nhemiLight.position.set(0, 500, 0);\r\nscene.add(hemiLight);\r\n\r\nconst textureLoader = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader();\r\n\r\nconst regularTexture = textureLoader.load('textures/brick.jpg');\r\nconst regularBump = textureLoader.load('textures/brick-map.jpg');\r\nconst specialTexture = textureLoader.load('textures/brick-with-button.png');\r\nconst specialBump = textureLoader.load('textures/brick-map-with-button.png');\r\n\r\nregularTexture.colorSpace = three__WEBPACK_IMPORTED_MODULE_1__.SRGBColorSpace;\r\nspecialTexture.colorSpace = three__WEBPACK_IMPORTED_MODULE_1__.SRGBColorSpace;\r\n\r\nconst regularFaceMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({\r\n    map: regularTexture,\r\n    bumpMap: regularBump,\r\n    bumpScale: 2,\r\n    specular: 0x333333,\r\n    shininess: 35\r\n});\r\n\r\nconst leftSpecialFaceMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({\r\n    map: specialTexture,\r\n    bumpMap: specialBump,\r\n    bumpScale: 2,\r\n    specular: 0x555555,\r\n    shininess: 50\r\n});\r\n\r\nconst rightSpecialFaceMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({\r\n    map: specialTexture,\r\n    bumpMap: specialBump,\r\n    bumpScale: 2,\r\n    specular: 0x555555,\r\n    shininess: 50\r\n});\r\n\r\nconst leftCubeMaterials = [\r\n    leftSpecialFaceMaterial,\r\n    regularFaceMaterial,\r\n    regularFaceMaterial,\r\n    regularFaceMaterial,\r\n    regularFaceMaterial,\r\n    regularFaceMaterial\r\n];\r\n\r\nconst rightCubeMaterials = [\r\n    regularFaceMaterial,\r\n    rightSpecialFaceMaterial,\r\n    regularFaceMaterial,\r\n    regularFaceMaterial,\r\n    regularFaceMaterial,\r\n    regularFaceMaterial\r\n];\r\n\r\nconst cubeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(50, 50, 50);\r\n\r\nconst leftCube = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(cubeGeometry, leftCubeMaterials);\r\nleftCube.position.set(-220, 25, 0);\r\n\r\nconst rightCube = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(cubeGeometry, rightCubeMaterials);\r\nrightCube.position.set(220, 25, 0);\r\n\r\nscene.add(leftCube);\r\nscene.add(rightCube);\r\n\r\nconst clock = new three__WEBPACK_IMPORTED_MODULE_1__.Clock();\r\n\r\nfunction animate() {\r\n    requestAnimationFrame(animate);\r\n\r\n    const delta = clock.getDelta();\r\n    controls.update(delta);\r\n\r\n    renderer.render(scene, camera);\r\n}\r\n\r\nwindow.addEventListener('resize', () => {\r\n    camera.aspect = window.innerWidth / window.innerHeight;\r\n    camera.updateProjectionMatrix();\r\n    renderer.setSize(window.innerWidth, window.innerHeight);\r\n    controls.handleResize();\r\n}, false);\r\n\r\nanimate();\r\n\n\n//# sourceURL=webpack://sesion3/./src/prac3-4.js?\n}");

/***/ }

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("768e46808a6bda7d387a")
/******/ })();
/******/ 
/******/ }
);