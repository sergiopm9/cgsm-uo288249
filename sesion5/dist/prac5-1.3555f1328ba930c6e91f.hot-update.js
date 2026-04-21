/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdatesesion4"]("prac5-1",{

/***/ "./src/prac5-1.js"
/*!************************!*\
  !*** ./src/prac5-1.js ***!
  \************************/
() {

eval("{const query = new URLSearchParams(window.location.search);\r\nconst url = query.get('mpd') || 'http://localhost:60080/Ejercicio/sintel.mpd';\r\nconst playerElement = document.querySelector('#player');\r\n\r\nif (!window.dashjs) {\r\n    console.error('dash.js no está cargado.');\r\n} else {\r\n    const player = window.dashjs.MediaPlayer().create();\r\n    player.updateSettings({\r\n        streaming: {\r\n            abr: {\r\n                autoSwitchBitrate: {\r\n                    video: true,\r\n                    audio: true\r\n                }\r\n            }\r\n        }\r\n    });\r\n\r\n    // Código requerido por el guion de prácticas:\r\n    // const url = \"url_al_manifiesto\";\r\n    // const player = dashjs.MediaPlayer().create();\r\n    // player.initialize(document.querySelector(\"#player\"), url, true);\r\n    player.initialize(playerElement, url, true);\r\n\r\n    console.log(`Reproduciendo manifiesto DASH: ${url}`);\r\n}\r\n\n\n//# sourceURL=webpack://sesion4/./src/prac5-1.js?\n}");

/***/ }

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("5e61ce50427788504137")
/******/ })();
/******/ 
/******/ }
);