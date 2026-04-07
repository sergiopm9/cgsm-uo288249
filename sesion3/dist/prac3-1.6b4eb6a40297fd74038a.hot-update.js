"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdatesesion3"]("prac3-1",{

/***/ "./src/prac3-1.js"
/*!************************!*\
  !*** ./src/prac3-1.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.core.js\");\n/* harmony import */ var three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls.js */ \"./node_modules/three/examples/jsm/controls/OrbitControls.js\");\n/* harmony import */ var three_examples_jsm_libs_lil_gui_module_min_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three/examples/jsm/libs/lil-gui.module.min.js */ \"./node_modules/three/examples/jsm/libs/lil-gui.module.min.js\");\n\r\n\r\n\r\n\r\nconst scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();\r\nscene.background = new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x2f2f2f);\r\n\r\nconst renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer({ antialias: true });\r\nrenderer.setPixelRatio(window.devicePixelRatio);\r\nrenderer.setSize(window.innerWidth, window.innerHeight);\r\ndocument.body.appendChild(renderer.domElement);\r\n\r\nconst camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);\r\ncamera.position.set(0, 60, 320);\r\n\r\nconst controls = new three_examples_jsm_controls_OrbitControls_js__WEBPACK_IMPORTED_MODULE_2__.OrbitControls(camera, renderer.domElement);\r\ncontrols.enableDamping = true;\r\ncontrols.target.set(0, 0, 0);\r\n\r\nconst geometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(100, 100, 100);\r\n\r\nconst textureLoader = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader();\r\nconst brickTexture = textureLoader.load('textures/brick.jpg');\r\nconst bumpTexture = textureLoader.load('textures/brick-map.jpg');\r\n\r\nbrickTexture.colorSpace = three__WEBPACK_IMPORTED_MODULE_1__.SRGBColorSpace;\r\n\r\nconst basicMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({\r\n    map: brickTexture,\r\n    specular: 0x222222,\r\n    shininess: 10\r\n});\r\n\r\nconst bumpMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({\r\n    map: brickTexture,\r\n    bumpMap: bumpTexture,\r\n    bumpScale: 3.0,\r\n    specular: 0xaaaaaa,\r\n    shininess: 90\r\n});\r\n\r\nconst leftCube = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, basicMaterial);\r\nleftCube.position.x = -80;\r\n\r\nconst rightCube = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, bumpMaterial);\r\nrightCube.position.x = 80;\r\n\r\nscene.add(leftCube);\r\nscene.add(rightCube);\r\n\r\nconst ambientLight = new three__WEBPACK_IMPORTED_MODULE_1__.AmbientLight(0xffffff, 0.12);\r\nscene.add(ambientLight);\r\n\r\nconst keyLight = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff, 1.6);\r\nkeyLight.position.set(260, 35, 75);\r\nscene.add(keyLight);\r\n\r\nconst fillLight = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff, 0.35);\r\nfillLight.position.set(-180, 140, -200);\r\nscene.add(fillLight);\r\n\r\nconst gui = new three_examples_jsm_libs_lil_gui_module_min_js__WEBPACK_IMPORTED_MODULE_3__.GUI({ title: 'Controles' });\r\ngui.add(bumpMaterial, 'bumpScale', -2, 8, 0.01).name('bumpScale');\r\n\r\nconst clock = new three__WEBPACK_IMPORTED_MODULE_1__.Clock();\r\n\r\nfunction animate() {\r\n    requestAnimationFrame(animate);\r\n\r\n    const delta = clock.getDelta();\r\n    const rotationSpeed = delta * 0.8;\r\n\r\n    leftCube.rotation.y += rotationSpeed;\r\n    rightCube.rotation.y += rotationSpeed;\r\n\r\n    controls.update();\r\n    renderer.render(scene, camera);\r\n}\r\n\r\nwindow.addEventListener('resize', () => {\r\n    camera.aspect = window.innerWidth / window.innerHeight;\r\n    camera.updateProjectionMatrix();\r\n    renderer.setSize(window.innerWidth, window.innerHeight);\r\n}, false);\r\n\r\nleftCube.rotation.set(Math.PI / 6, Math.PI / 5, 0);\r\nrightCube.rotation.set(Math.PI / 6, Math.PI / 5, 0);\r\n\r\nanimate();\n\n//# sourceURL=webpack://sesion3/./src/prac3-1.js?\n}");

/***/ }

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("da1496171456273dcfb3")
/******/ })();
/******/ 
/******/ }
);