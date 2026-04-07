"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdatesesion3"]("prac3-2",{

/***/ "./src/prac3-2.js"
/*!************************!*\
  !*** ./src/prac3-2.js ***!
  \************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.core.js\");\n\r\n\r\nlet scene;\r\nlet renderer;\r\nlet camera;\r\nlet wall;\r\nlet video;\r\nlet image;\r\nlet imageContext;\r\nlet texture;\r\nconst clock = new three__WEBPACK_IMPORTED_MODULE_1__.Clock();\r\nlet reversePlaybackReady = false;\r\nconst reverseSpeed = 1.0;\r\nconst endFrameOffset = 0.001;\r\n\r\nconst startButton = document.getElementById('startButton');\r\nstartButton.addEventListener('click', () => init(), false);\r\n\r\nfunction init() {\r\n    const overlay = document.getElementById('overlay');\r\n    overlay.remove();\r\n\r\n    setupScene();\r\n    setupVideoTexture();\r\n    animate();\r\n}\r\n\r\nfunction setupScene() {\r\n    scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();\r\n\r\n    renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer({ antialias: true });\r\n    renderer.setPixelRatio(window.devicePixelRatio);\r\n    renderer.setSize(window.innerWidth, window.innerHeight);\r\n    renderer.setClearColor(0x111111);\r\n    document.body.appendChild(renderer.domElement);\r\n\r\n    camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);\r\n    camera.position.set(0, 0, 650);\r\n\r\n    window.addEventListener('resize', onWindowResize, false);\r\n}\r\n\r\nfunction setupVideoTexture() {\r\n    video = document.getElementById('video');\r\n    video.muted = true;\r\n\r\n    image = document.createElement('canvas');\r\n    image.width = 480;\r\n    image.height = 204;\r\n\r\n    imageContext = image.getContext('2d');\r\n    imageContext.fillStyle = '#000000';\r\n    imageContext.fillRect(0, 0, image.width - 1, image.height - 1);\r\n\r\n    texture = new three__WEBPACK_IMPORTED_MODULE_1__.Texture(image);\r\n    texture.colorSpace = three__WEBPACK_IMPORTED_MODULE_1__.SRGBColorSpace;\r\n    texture.minFilter = three__WEBPACK_IMPORTED_MODULE_1__.LinearFilter;\r\n    texture.magFilter = three__WEBPACK_IMPORTED_MODULE_1__.LinearFilter;\r\n    texture.wrapS = three__WEBPACK_IMPORTED_MODULE_1__.ClampToEdgeWrapping;\r\n    texture.wrapT = three__WEBPACK_IMPORTED_MODULE_1__.ClampToEdgeWrapping;\r\n    texture.generateMipmaps = false;\r\n\r\n    const material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ map: texture });\r\n    wall = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(image.width, image.height, 4, 4), material);\r\n\r\n    scene.add(wall);\r\n\r\n    video.addEventListener('loadedmetadata', () => {\r\n        reversePlaybackReady = false;\r\n        video.pause();\r\n        video.currentTime = Math.max(0, video.duration - endFrameOffset);\r\n    }, { once: true });\r\n\r\n    video.addEventListener('seeked', () => {\r\n        reversePlaybackReady = true;\r\n        texture.needsUpdate = true;\r\n    }, { once: true });\r\n\r\n    video.play().then(() => {\r\n        video.pause();\r\n    }).catch((error) => {\r\n        console.error('No se pudo preparar el vídeo tras el click:', error);\r\n    });\r\n}\r\n\r\nfunction onWindowResize() {\r\n    camera.aspect = window.innerWidth / window.innerHeight;\r\n    camera.updateProjectionMatrix();\r\n    renderer.setSize(window.innerWidth, window.innerHeight);\r\n}\r\n\r\nfunction animate() {\r\n    requestAnimationFrame(animate);\r\n\r\n    const delta = clock.getDelta();\r\n\r\n    if (reversePlaybackReady && !video.seeking) {\r\n        const nextTime = video.currentTime - (delta * reverseSpeed);\r\n\r\n        if (nextTime <= 0) {\r\n            video.currentTime = Math.max(0, video.duration - endFrameOffset);\r\n        } else {\r\n            video.currentTime = nextTime;\r\n        }\r\n    }\r\n\r\n    if (video.readyState >= video.HAVE_CURRENT_DATA) {\r\n        imageContext.drawImage(video, 0, 0);\r\n        texture.needsUpdate = true;\r\n    }\r\n\r\n    if (wall) {\r\n        wall.rotation.y += delta * 0.75;\r\n    }\r\n\r\n    renderer.render(scene, camera);\r\n}\r\n\n\n//# sourceURL=webpack://sesion3/./src/prac3-2.js?\n}");

/***/ }

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("dd7ce4ca9debd95cefe4")
/******/ })();
/******/ 
/******/ }
);