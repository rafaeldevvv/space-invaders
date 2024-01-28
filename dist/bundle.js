/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/components/View/styles/buttons.css":
/*!********************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/components/View/styles/buttons.css ***!
  \********************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ \"./node_modules/css-loader/dist/runtime/noSourceMaps.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);\n// Imports\n\n\nvar ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, `button {\r\n   background: none;\r\n   cursor: pointer;\r\n   font-family: inherit;\r\n}\r\n\r\n.btn-container {\r\n   position: fixed;\r\n   inset: auto auto 2.5% 50%;\r\n   transform: translate(-50%);\r\n   display: grid;\r\n   gap: .8rem;\r\n}\r\n\r\n.btn-container--state-start {\r\n   grid-template-areas: \"start\";\r\n}\r\n\r\n.btn-container--state-running {\r\n   grid-template-areas:\r\n      'fire left right'\r\n      'pause pause pause';\r\n}\r\n\r\n.btn-container--state-lost {\r\n   grid-template-areas: \"restart\";\r\n}\r\n\r\n.btn-container__btn {\r\n   --shadow-color: ;\r\n   --bg: ;\r\n   --area: ;\r\n\r\n   font-size: 1.7rem;\r\n   color: black;\r\n   -webkit-user-select: none;\r\n      -moz-user-select: none;\r\n           user-select: none;\r\n\r\n   border: 2px solid var(--shadow-color);\r\n   padding: .5rem 1rem;\r\n\r\n   position: relative;\r\n   z-index: 0;\r\n   transform: translateY(-7px);\r\n\r\n   box-shadow: 0 7px var(--shadow-color);\r\n   background-color: var(--bg);\r\n   \r\n   grid-area: var(--area);\r\n}\r\n\r\n.btn-container__btn.active,\r\n.btn-container__btn:active {\r\n   transform: translateY(0px);\r\n   box-shadow: 0 0px var(--shadow-color);\r\n}\r\n\r\n.fire-btn {\r\n   --area: fire;\r\n   --bg: hsl(0 100% 70%);\r\n   --shadow-color: hsl(0 100% 25%);\r\n}\r\n\r\n.move-right-btn {\r\n   --area: right;\r\n}\r\n\r\n.move-left-btn {\r\n   --area: left;\r\n}\r\n\r\n.move-right-btn,\r\n.move-left-btn {\r\n   --bg: hsl(120 100% 70%);\r\n   --shadow-color: hsl(120 100% 20%);\r\n}\r\n\r\n.pause-btn {\r\n   --area: pause;\r\n   --bg: hsl(240 100% 70%);\r\n   --shadow-color: hsl(240 100% 25%);\r\n}\r\n\r\n.start-btn {\r\n   --area: start;\r\n}\r\n\r\n.restart-btn {\r\n   --area: restart;\r\n}\r\n\r\n.start-btn,\r\n.restart-btn {\r\n   --bg: hsl(60 100% 55%);\r\n   --shadow-color: hsl(60 100% 15%);\r\n}\r\n\r\n@media (pointer: fine) {\r\n   .btn-container {\r\n      display: none;\r\n   }\r\n}`, \"\"]);\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/styles/buttons.css?./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

eval("\n\n/*\n  MIT License http://www.opensource.org/licenses/mit-license.php\n  Author Tobias Koppers @sokra\n*/\nmodule.exports = function (cssWithMappingToString) {\n  var list = [];\n\n  // return the list of modules as css string\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = \"\";\n      var needLayer = typeof item[5] !== \"undefined\";\n      if (item[4]) {\n        content += \"@supports (\".concat(item[4], \") {\");\n      }\n      if (item[2]) {\n        content += \"@media \".concat(item[2], \" {\");\n      }\n      if (needLayer) {\n        content += \"@layer\".concat(item[5].length > 0 ? \" \".concat(item[5]) : \"\", \" {\");\n      }\n      content += cssWithMappingToString(item);\n      if (needLayer) {\n        content += \"}\";\n      }\n      if (item[2]) {\n        content += \"}\";\n      }\n      if (item[4]) {\n        content += \"}\";\n      }\n      return content;\n    }).join(\"\");\n  };\n\n  // import a list of modules into the list\n  list.i = function i(modules, media, dedupe, supports, layer) {\n    if (typeof modules === \"string\") {\n      modules = [[null, modules, undefined]];\n    }\n    var alreadyImportedModules = {};\n    if (dedupe) {\n      for (var k = 0; k < this.length; k++) {\n        var id = this[k][0];\n        if (id != null) {\n          alreadyImportedModules[id] = true;\n        }\n      }\n    }\n    for (var _k = 0; _k < modules.length; _k++) {\n      var item = [].concat(modules[_k]);\n      if (dedupe && alreadyImportedModules[item[0]]) {\n        continue;\n      }\n      if (typeof layer !== \"undefined\") {\n        if (typeof item[5] === \"undefined\") {\n          item[5] = layer;\n        } else {\n          item[1] = \"@layer\".concat(item[5].length > 0 ? \" \".concat(item[5]) : \"\", \" {\").concat(item[1], \"}\");\n          item[5] = layer;\n        }\n      }\n      if (media) {\n        if (!item[2]) {\n          item[2] = media;\n        } else {\n          item[1] = \"@media \".concat(item[2], \" {\").concat(item[1], \"}\");\n          item[2] = media;\n        }\n      }\n      if (supports) {\n        if (!item[4]) {\n          item[4] = \"\".concat(supports);\n        } else {\n          item[1] = \"@supports (\".concat(item[4], \") {\").concat(item[1], \"}\");\n          item[4] = supports;\n        }\n      }\n      list.push(item);\n    }\n  };\n  return list;\n};\n\n//# sourceURL=webpack://space-invaders/./node_modules/css-loader/dist/runtime/api.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/noSourceMaps.js":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/noSourceMaps.js ***!
  \**************************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = function (i) {\n  return i[1];\n};\n\n//# sourceURL=webpack://space-invaders/./node_modules/css-loader/dist/runtime/noSourceMaps.js?");

/***/ }),

/***/ "./src/components/View/styles/buttons.css":
/*!************************************************!*\
  !*** ./src/components/View/styles/buttons.css ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ \"./node_modules/style-loader/dist/runtime/styleDomAPI.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ \"./node_modules/style-loader/dist/runtime/insertBySelector.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ \"./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ \"./node_modules/style-loader/dist/runtime/insertStyleElement.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ \"./node_modules/style-loader/dist/runtime/styleTagTransform.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_buttons_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../../node_modules/css-loader/dist/cjs.js!../../../../node_modules/postcss-loader/dist/cjs.js!./buttons.css */ \"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/components/View/styles/buttons.css\");\n\n      \n      \n      \n      \n      \n      \n      \n      \n      \n\nvar options = {};\n\noptions.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());\noptions.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());\n\n      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, \"head\");\n    \noptions.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());\noptions.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());\n\nvar update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_buttons_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"], options);\n\n\n\n\n       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_buttons_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"] && _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_buttons_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_buttons_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals : undefined);\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/styles/buttons.css?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

eval("\n\nvar stylesInDOM = [];\nfunction getIndexByIdentifier(identifier) {\n  var result = -1;\n  for (var i = 0; i < stylesInDOM.length; i++) {\n    if (stylesInDOM[i].identifier === identifier) {\n      result = i;\n      break;\n    }\n  }\n  return result;\n}\nfunction modulesToDom(list, options) {\n  var idCountMap = {};\n  var identifiers = [];\n  for (var i = 0; i < list.length; i++) {\n    var item = list[i];\n    var id = options.base ? item[0] + options.base : item[0];\n    var count = idCountMap[id] || 0;\n    var identifier = \"\".concat(id, \" \").concat(count);\n    idCountMap[id] = count + 1;\n    var indexByIdentifier = getIndexByIdentifier(identifier);\n    var obj = {\n      css: item[1],\n      media: item[2],\n      sourceMap: item[3],\n      supports: item[4],\n      layer: item[5]\n    };\n    if (indexByIdentifier !== -1) {\n      stylesInDOM[indexByIdentifier].references++;\n      stylesInDOM[indexByIdentifier].updater(obj);\n    } else {\n      var updater = addElementStyle(obj, options);\n      options.byIndex = i;\n      stylesInDOM.splice(i, 0, {\n        identifier: identifier,\n        updater: updater,\n        references: 1\n      });\n    }\n    identifiers.push(identifier);\n  }\n  return identifiers;\n}\nfunction addElementStyle(obj, options) {\n  var api = options.domAPI(options);\n  api.update(obj);\n  var updater = function updater(newObj) {\n    if (newObj) {\n      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {\n        return;\n      }\n      api.update(obj = newObj);\n    } else {\n      api.remove();\n    }\n  };\n  return updater;\n}\nmodule.exports = function (list, options) {\n  options = options || {};\n  list = list || [];\n  var lastIdentifiers = modulesToDom(list, options);\n  return function update(newList) {\n    newList = newList || [];\n    for (var i = 0; i < lastIdentifiers.length; i++) {\n      var identifier = lastIdentifiers[i];\n      var index = getIndexByIdentifier(identifier);\n      stylesInDOM[index].references--;\n    }\n    var newLastIdentifiers = modulesToDom(newList, options);\n    for (var _i = 0; _i < lastIdentifiers.length; _i++) {\n      var _identifier = lastIdentifiers[_i];\n      var _index = getIndexByIdentifier(_identifier);\n      if (stylesInDOM[_index].references === 0) {\n        stylesInDOM[_index].updater();\n        stylesInDOM.splice(_index, 1);\n      }\n    }\n    lastIdentifiers = newLastIdentifiers;\n  };\n};\n\n//# sourceURL=webpack://space-invaders/./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

eval("\n\nvar memo = {};\n\n/* istanbul ignore next  */\nfunction getTarget(target) {\n  if (typeof memo[target] === \"undefined\") {\n    var styleTarget = document.querySelector(target);\n\n    // Special case to return head of iframe instead of iframe itself\n    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {\n      try {\n        // This will throw an exception if access to iframe is blocked\n        // due to cross-origin restrictions\n        styleTarget = styleTarget.contentDocument.head;\n      } catch (e) {\n        // istanbul ignore next\n        styleTarget = null;\n      }\n    }\n    memo[target] = styleTarget;\n  }\n  return memo[target];\n}\n\n/* istanbul ignore next  */\nfunction insertBySelector(insert, style) {\n  var target = getTarget(insert);\n  if (!target) {\n    throw new Error(\"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.\");\n  }\n  target.appendChild(style);\n}\nmodule.exports = insertBySelector;\n\n//# sourceURL=webpack://space-invaders/./node_modules/style-loader/dist/runtime/insertBySelector.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction insertStyleElement(options) {\n  var element = document.createElement(\"style\");\n  options.setAttributes(element, options.attributes);\n  options.insert(element, options.options);\n  return element;\n}\nmodule.exports = insertStyleElement;\n\n//# sourceURL=webpack://space-invaders/./node_modules/style-loader/dist/runtime/insertStyleElement.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\n/* istanbul ignore next  */\nfunction setAttributesWithoutAttributes(styleElement) {\n  var nonce =  true ? __webpack_require__.nc : 0;\n  if (nonce) {\n    styleElement.setAttribute(\"nonce\", nonce);\n  }\n}\nmodule.exports = setAttributesWithoutAttributes;\n\n//# sourceURL=webpack://space-invaders/./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction apply(styleElement, options, obj) {\n  var css = \"\";\n  if (obj.supports) {\n    css += \"@supports (\".concat(obj.supports, \") {\");\n  }\n  if (obj.media) {\n    css += \"@media \".concat(obj.media, \" {\");\n  }\n  var needLayer = typeof obj.layer !== \"undefined\";\n  if (needLayer) {\n    css += \"@layer\".concat(obj.layer.length > 0 ? \" \".concat(obj.layer) : \"\", \" {\");\n  }\n  css += obj.css;\n  if (needLayer) {\n    css += \"}\";\n  }\n  if (obj.media) {\n    css += \"}\";\n  }\n  if (obj.supports) {\n    css += \"}\";\n  }\n  var sourceMap = obj.sourceMap;\n  if (sourceMap && typeof btoa !== \"undefined\") {\n    css += \"\\n/*# sourceMappingURL=data:application/json;base64,\".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), \" */\");\n  }\n\n  // For old IE\n  /* istanbul ignore if  */\n  options.styleTagTransform(css, styleElement, options.options);\n}\nfunction removeStyleElement(styleElement) {\n  // istanbul ignore if\n  if (styleElement.parentNode === null) {\n    return false;\n  }\n  styleElement.parentNode.removeChild(styleElement);\n}\n\n/* istanbul ignore next  */\nfunction domAPI(options) {\n  if (typeof document === \"undefined\") {\n    return {\n      update: function update() {},\n      remove: function remove() {}\n    };\n  }\n  var styleElement = options.insertStyleElement(options);\n  return {\n    update: function update(obj) {\n      apply(styleElement, options, obj);\n    },\n    remove: function remove() {\n      removeStyleElement(styleElement);\n    }\n  };\n}\nmodule.exports = domAPI;\n\n//# sourceURL=webpack://space-invaders/./node_modules/style-loader/dist/runtime/styleDomAPI.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction styleTagTransform(css, styleElement) {\n  if (styleElement.styleSheet) {\n    styleElement.styleSheet.cssText = css;\n  } else {\n    while (styleElement.firstChild) {\n      styleElement.removeChild(styleElement.firstChild);\n    }\n    styleElement.appendChild(document.createTextNode(css));\n  }\n}\nmodule.exports = styleTagTransform;\n\n//# sourceURL=webpack://space-invaders/./node_modules/style-loader/dist/runtime/styleTagTransform.js?");

/***/ }),

/***/ "./src/audios/index.ts":
/*!*****************************!*\
  !*** ./src/audios/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst explosion_mp3_1 = __importDefault(__webpack_require__(/*! ./explosion.mp3 */ \"./src/audios/explosion.mp3\"));\nconst fastinvader1_mp3_1 = __importDefault(__webpack_require__(/*! ./fastinvader1.mp3 */ \"./src/audios/fastinvader1.mp3\"));\nconst fastinvader2_mp3_1 = __importDefault(__webpack_require__(/*! ./fastinvader2.mp3 */ \"./src/audios/fastinvader2.mp3\"));\nconst fastinvader3_mp3_1 = __importDefault(__webpack_require__(/*! ./fastinvader3.mp3 */ \"./src/audios/fastinvader3.mp3\"));\nconst fastinvader4_mp3_1 = __importDefault(__webpack_require__(/*! ./fastinvader4.mp3 */ \"./src/audios/fastinvader4.mp3\"));\nconst invaderkilled_mp3_1 = __importDefault(__webpack_require__(/*! ./invaderkilled.mp3 */ \"./src/audios/invaderkilled.mp3\"));\nconst shoot_mp3_1 = __importDefault(__webpack_require__(/*! ./shoot.mp3 */ \"./src/audios/shoot.mp3\"));\nconst ufo_highpitch_mp3_1 = __importDefault(__webpack_require__(/*! ./ufo_highpitch.mp3 */ \"./src/audios/ufo_highpitch.mp3\"));\nconst ufo_lowpitch_mp3_1 = __importDefault(__webpack_require__(/*! ./ufo_lowpitch.mp3 */ \"./src/audios/ufo_lowpitch.mp3\"));\nconst explosion = new Audio(explosion_mp3_1.default), fastInvader1 = new Audio(fastinvader1_mp3_1.default), fastInvader2 = new Audio(fastinvader2_mp3_1.default), fastInvader3 = new Audio(fastinvader3_mp3_1.default), fastInvader4 = new Audio(fastinvader4_mp3_1.default), alienKilled = new Audio(invaderkilled_mp3_1.default), shoot = new Audio(shoot_mp3_1.default), boss_highpitch = new Audio(ufo_highpitch_mp3_1.default), boss_lowpitch = new Audio(ufo_lowpitch_mp3_1.default);\nfunction checkAndPlay(media) {\n    if (media.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {\n        media.currentTime = 0;\n        media.play();\n    }\n}\nfunction repeat(media) {\n    checkAndPlay(media);\n    const onEnd = () => {\n        media.currentTime = 0;\n        media.play();\n    };\n    media.addEventListener(\"ended\", onEnd);\n    return () => {\n        media.currentTime = 0;\n        media.pause();\n        media.removeEventListener(\"ended\", onEnd);\n    };\n}\nconst audios = {\n    explosion() {\n        checkAndPlay(explosion);\n    },\n    fastInvader(number) {\n        switch (number) {\n            case 1: {\n                checkAndPlay(fastInvader1);\n                break;\n            }\n            case 2: {\n                checkAndPlay(fastInvader2);\n                break;\n            }\n            case 3: {\n                checkAndPlay(fastInvader3);\n                break;\n            }\n            case 4: {\n                checkAndPlay(fastInvader4);\n                break;\n            }\n        }\n    },\n    alienKilled() {\n        checkAndPlay(alienKilled);\n    },\n    shoot() {\n        checkAndPlay(shoot);\n    },\n    boss_highpitch() {\n        return repeat(boss_highpitch);\n    },\n    boss_lowpitch() {\n        return repeat(boss_lowpitch);\n    },\n};\nexports[\"default\"] = audios;\n\n\n//# sourceURL=webpack://space-invaders/./src/audios/index.ts?");

/***/ }),

/***/ "./src/components/AlienSet/config.ts":
/*!*******************************************!*\
  !*** ./src/components/AlienSet/config.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.baseYPos = exports.stepsToReachPlayer = exports.entranceSpeed = exports.timeDecreaseFactor = exports.stepToEdgeAdjustment = void 0;\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nexports.stepToEdgeAdjustment = 1.33;\nexports.timeDecreaseFactor = 0.96;\nexports.entranceSpeed = 30;\nexports.stepsToReachPlayer = 11;\nexports.baseYPos = game_config_1.LAYOUT.padding.ver + 12;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/AlienSet/config.ts?");

/***/ }),

/***/ "./src/components/AlienSet/index.ts":
/*!******************************************!*\
  !*** ./src/components/AlienSet/index.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Vector_1 = __importDefault(__webpack_require__(/*! @/utils/common/Vector */ \"./src/utils/common/Vector.ts\"));\nconst config_1 = __webpack_require__(/*! ../Alien/config */ \"./src/components/Alien/config.ts\");\nconst Alien_1 = __importDefault(__webpack_require__(/*! ../Alien */ \"./src/components/Alien/index.ts\"));\nconst enums_1 = __webpack_require__(/*! @/ts/enums */ \"./src/ts/enums.ts\");\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst config_2 = __webpack_require__(/*! ./config */ \"./src/components/AlienSet/config.ts\");\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/components/AlienSet/utils.ts\");\nconst audios_1 = __importDefault(__webpack_require__(/*! @/audios */ \"./src/audios/index.ts\"));\nconst numbers_1 = __webpack_require__(/*! @/utils/common/numbers */ \"./src/utils/common/numbers.ts\");\nclass AlienSet {\n    constructor(plan) {\n        this.aliensStage = 0;\n        this.timeToUpdate = 1;\n        this.direction = 1;\n        this.entering = true;\n        this.timeStepSum = 0;\n        if (!config_1.alienTypesRegExp.test(plan)) {\n            throw new Error(`Invalid character(s) in plan ${plan}. Consider using only valid characters (${config_1.alienTypes.join(\",\")})`);\n        }\n        AlienSet.instancesCreated++;\n        const rows = plan\n            .trim()\n            .split(\"\\n\")\n            .map((l) => [...l]);\n        this.numColumns = rows[0].length;\n        this.numRows = rows.length;\n        this.alive = this.numColumns * this.numRows;\n        const w = this.numColumns * game_config_1.DIMENSIONS.alien.w +\n            (this.numColumns - 1) * game_config_1.DIMENSIONS.alienSetGap.w;\n        const h = this.numRows * game_config_1.DIMENSIONS.alien.h +\n            (this.numRows - 1) * game_config_1.DIMENSIONS.alienSetGap.h;\n        this.size = { w, h };\n        this.pos = new Vector_1.default(50 - w / 2, -h * 1.5);\n        this.xStep = (100 - game_config_1.LAYOUT.padding.hor * 2 - w) / 15;\n        this.yStep =\n            (game_config_1.LAYOUT.playerYPos - (config_2.baseYPos + this.size.h)) / config_2.stepsToReachPlayer +\n                0.01;\n        this.initialYPos =\n            config_2.baseYPos + ((AlienSet.instancesCreated - 1) % 9) * (this.yStep);\n        this.aliens = rows.map((row, y) => {\n            return row.map((ch, x) => {\n                return Alien_1.default.create(ch, { x, y });\n            });\n        });\n    }\n    update(timeStep) {\n        if (this.entering) {\n            this.pos = this.pos.plus(new Vector_1.default(0, config_2.entranceSpeed * timeStep));\n            if (this.pos.y >= this.initialYPos) {\n                this.entering = false;\n                this.pos.y = this.initialYPos;\n            }\n            else\n                return;\n        }\n        this.timeStepSum += timeStep;\n        const movedY = this.moveVertically();\n        const movedX = this.moveHorizontally(movedY);\n        if (this.timeStepSum >= this.timeToUpdate) {\n            this.timeStepSum = 0;\n        }\n        if (movedY !== 0 || movedX !== 0) {\n            audios_1.default.fastInvader(Math.ceil((0, numbers_1.randomNum)(0, 4)));\n            this.removeDeadAliens();\n            this.aliensStage = this.aliensStage === 1 ? 0 : 1;\n        }\n        this.pos = this.pos.plus(new Vector_1.default(movedX, movedY));\n        for (const { alien } of this) {\n            if (alien instanceof Alien_1.default)\n                alien.gun.update(timeStep);\n        }\n    }\n    moveVertically() {\n        let movedY = 0;\n        if (this.pos.x + this.size.w >= 100 - game_config_1.LAYOUT.padding.hor &&\n            this.timeStepSum >= this.timeToUpdate &&\n            this.direction === enums_1.HorizontalDirection.Right) {\n            movedY = this.yStep;\n            this.direction = enums_1.HorizontalDirection.Left;\n        }\n        else if (this.pos.x <= game_config_1.LAYOUT.padding.hor &&\n            this.timeStepSum >= this.timeToUpdate &&\n            this.direction === enums_1.HorizontalDirection.Left) {\n            movedY = this.yStep;\n            this.direction = enums_1.HorizontalDirection.Right;\n        }\n        return movedY;\n    }\n    moveHorizontally(movedY) {\n        let movedX = 0;\n        if (this.timeStepSum >= this.timeToUpdate && movedY === 0) {\n            if (this.direction === enums_1.HorizontalDirection.Right) {\n                const rightDistance = 100 - this.pos.x - game_config_1.LAYOUT.padding.hor - this.size.w;\n                if (rightDistance < this.xStep * config_2.stepToEdgeAdjustment) {\n                    movedX = rightDistance;\n                }\n                else {\n                    movedX = this.xStep;\n                }\n            }\n            else {\n                const leftDistance = this.pos.x - game_config_1.LAYOUT.padding.hor;\n                if (leftDistance < this.xStep * config_2.stepToEdgeAdjustment) {\n                    movedX = leftDistance;\n                }\n                else {\n                    movedX = this.xStep;\n                }\n            }\n            movedX *= this.direction;\n        }\n        return movedX;\n    }\n    adapt() {\n        (0, utils_1.adaptPos)(this);\n        (0, utils_1.adaptSize)(this);\n        (0, utils_1.removeDeadRowsAndColumns)(this);\n    }\n    getAlienPos({ x, y }) {\n        return new Vector_1.default(this.pos.x + x * game_config_1.DIMENSIONS.alien.w + x * game_config_1.DIMENSIONS.alienSetGap.w, this.pos.y + y * game_config_1.DIMENSIONS.alien.h + y * game_config_1.DIMENSIONS.alienSetGap.h);\n    }\n    removeAlien(alien) {\n        this.aliens[alien.gridPos.y][alien.gridPos.x] = \"exploding\";\n        this.alive--;\n        this.timeToUpdate *= config_2.timeDecreaseFactor;\n        audios_1.default.alienKilled();\n    }\n    removeDeadAliens() {\n        for (const { alien, row, column } of this) {\n            if (alien === \"exploding\") {\n                this.aliens[row][column] = null;\n            }\n        }\n    }\n    *[Symbol.iterator]() {\n        for (let y = 0; y < this.numRows; y++) {\n            for (let x = 0; x < this.numColumns; x++) {\n                yield { alien: this.aliens[y][x], column: x, row: y };\n            }\n        }\n    }\n}\nAlienSet.instancesCreated = 0;\nexports[\"default\"] = AlienSet;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/AlienSet/index.ts?");

/***/ }),

/***/ "./src/components/AlienSet/utils.ts":
/*!******************************************!*\
  !*** ./src/components/AlienSet/utils.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.isAlien = exports.adaptPos = exports.adaptSize = exports.syncNumOfColsAndRows = exports.syncAliensGridPos = exports.removeDeadRowsAndColumns = exports.getFirstOrLastRowIfDead = exports.getFirstOrLastColumnIfDead = exports.isRowDead = exports.isColumnDead = void 0;\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nfunction isColumnDead(rows, column) {\n    return rows.every((row) => row[column] === null || row[column] === \"exploding\");\n}\nexports.isColumnDead = isColumnDead;\nfunction isRowDead(row) {\n    return row.every((alien) => alien === null || alien === \"exploding\");\n}\nexports.isRowDead = isRowDead;\nfunction getFirstOrLastColumnIfDead(rows) {\n    const isFirstColumnDead = isColumnDead(rows, 0);\n    const isLastColumnDead = isColumnDead(rows, rows[0].length - 1);\n    if (isFirstColumnDead)\n        return 0;\n    if (isLastColumnDead)\n        return rows[0].length - 1;\n    else\n        return null;\n}\nexports.getFirstOrLastColumnIfDead = getFirstOrLastColumnIfDead;\nfunction getFirstOrLastRowIfDead(rows) {\n    const isFirstRowDead = isRowDead(rows[0]);\n    const isLastRowDead = isRowDead(rows[rows.length - 1]);\n    if (isFirstRowDead)\n        return 0;\n    if (isLastRowDead)\n        return rows.length - 1;\n    else\n        return null;\n}\nexports.getFirstOrLastRowIfDead = getFirstOrLastRowIfDead;\nfunction removeDeadRowsAndColumns(alienSet) {\n    let columnToRemove;\n    while ((columnToRemove = getFirstOrLastColumnIfDead(alienSet.aliens)) !== null) {\n        alienSet.aliens = alienSet.aliens.map((row) => {\n            return row.filter((_, x) => x !== columnToRemove);\n        });\n        syncAliensGridPos(alienSet);\n    }\n    let rowToRemove;\n    while (alienSet.aliens.length !== 0 &&\n        (rowToRemove = getFirstOrLastRowIfDead(alienSet.aliens)) !== null) {\n        alienSet.aliens = alienSet.aliens.filter((_, y) => y !== rowToRemove);\n        syncAliensGridPos(alienSet);\n    }\n    syncNumOfColsAndRows(alienSet);\n}\nexports.removeDeadRowsAndColumns = removeDeadRowsAndColumns;\nfunction syncAliensGridPos(alienSet) {\n    alienSet.aliens.forEach((row, y) => {\n        row.forEach((alien, x) => {\n            if (alien !== null && alien !== \"exploding\")\n                alien.gridPos = { x, y };\n        });\n    });\n}\nexports.syncAliensGridPos = syncAliensGridPos;\nfunction syncNumOfColsAndRows(alienSet) {\n    alienSet.numRows = alienSet.aliens.length;\n    alienSet.numColumns = alienSet.numRows === 0 ? 0 : alienSet.aliens[0].length;\n}\nexports.syncNumOfColsAndRows = syncNumOfColsAndRows;\nfunction adaptSize(alienSet) {\n    let firstLivingAlienRow = null, lastLivingAlienRow = null, firstLivingAlienColumn = null, lastLivingAlienColumn = null;\n    for (const { alien } of alienSet) {\n        if (alien === \"exploding\" || alien === null)\n            continue;\n        const { x: column, y: row } = alien.gridPos;\n        if (firstLivingAlienRow === null) {\n            firstLivingAlienRow = row;\n        }\n        lastLivingAlienRow = row;\n        if (firstLivingAlienColumn === null || column < firstLivingAlienColumn) {\n            firstLivingAlienColumn = column;\n        }\n        if (lastLivingAlienColumn === null || column > lastLivingAlienColumn) {\n            lastLivingAlienColumn = column;\n        }\n    }\n    if (firstLivingAlienRow !== null) {\n        const newH = (lastLivingAlienRow - firstLivingAlienRow + 1) * game_config_1.DIMENSIONS.alien.h +\n            (lastLivingAlienRow - firstLivingAlienRow) * game_config_1.DIMENSIONS.alienSetGap.h;\n        const newW = (lastLivingAlienColumn - firstLivingAlienColumn + 1) *\n            game_config_1.DIMENSIONS.alien.w +\n            (lastLivingAlienColumn - firstLivingAlienColumn) *\n                game_config_1.DIMENSIONS.alienSetGap.w;\n        alienSet.size = {\n            w: newW,\n            h: newH,\n        };\n    }\n}\nexports.adaptSize = adaptSize;\nfunction adaptPos(alienSet) {\n    let firstLivingAlienColumn = null;\n    let firstLivingAlienRow = null;\n    for (const { alien } of alienSet) {\n        if (!isAlien(alien))\n            continue;\n        const { x, y } = alien.gridPos;\n        if (firstLivingAlienColumn === null || x < firstLivingAlienColumn) {\n            firstLivingAlienColumn = x;\n        }\n        if (firstLivingAlienRow === null) {\n            firstLivingAlienRow = y;\n        }\n    }\n    if (firstLivingAlienColumn !== null && firstLivingAlienRow !== null) {\n        alienSet.pos = alienSet.getAlienPos({\n            x: firstLivingAlienColumn,\n            y: firstLivingAlienRow,\n        });\n    }\n}\nexports.adaptPos = adaptPos;\nfunction isAlien(alien) {\n    return alien !== null && alien !== \"exploding\";\n}\nexports.isAlien = isAlien;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/AlienSet/utils.ts?");

/***/ }),

/***/ "./src/components/Alien/config.ts":
/*!****************************************!*\
  !*** ./src/components/Alien/config.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.alienTypesConfig = exports.alienTypesRegExp = exports.alienTypes = void 0;\nexports.alienTypes = [\"X\", \"Y\", \"Z\"];\nexports.alienTypesRegExp = new RegExp(`(\\\\w*(${exports.alienTypes.join(\"|\")})*\\\\w*)+`);\nexports.alienTypesConfig = {\n    X: {\n        score: 10,\n        gunConfig: [40, { w: 0.5, h: 3 }, 20000],\n    },\n    Y: {\n        score: 20,\n        gunConfig: [60, { w: 1, h: 3 }, 30000],\n    },\n    Z: {\n        score: 30,\n        gunConfig: [80, { w: 1.5, h: 3 }, 40000, true],\n    },\n};\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Alien/config.ts?");

/***/ }),

/***/ "./src/components/Alien/index.ts":
/*!***************************************!*\
  !*** ./src/components/Alien/index.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst Vector_1 = __importDefault(__webpack_require__(/*! @/utils/common/Vector */ \"./src/utils/common/Vector.ts\"));\nconst config_1 = __webpack_require__(/*! ./config */ \"./src/components/Alien/config.ts\");\nconst Gun_1 = __importDefault(__webpack_require__(/*! @/components/Gun */ \"./src/components/Gun/index.ts\"));\nclass Alien {\n    constructor(gridPos, score, gun, alienType) {\n        this.gridPos = gridPos;\n        this.score = score;\n        this.gun = gun;\n        this.alienType = alienType;\n        this.actorType = \"alien\";\n    }\n    fire(alienPos) {\n        const bulletX = alienPos.x + game_config_1.DIMENSIONS.alien.w / 2 - this.gun.bulletSize.w / 2;\n        return this.gun.fire(new Vector_1.default(bulletX, alienPos.y), \"down\");\n    }\n    static create(ch, gridPos) {\n        if (ch === \".\") {\n            return null;\n        }\n        else {\n            const { score, gunConfig } = config_1.alienTypesConfig[ch];\n            return new Alien(gridPos, score, new Gun_1.default(\"alien\", ...gunConfig), ch);\n        }\n    }\n}\nexports[\"default\"] = Alien;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Alien/index.ts?");

/***/ }),

/***/ "./src/components/Boss/config.ts":
/*!***************************************!*\
  !*** ./src/components/Boss/config.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.baseAppearanceInterval = exports.speedX = exports.bossExplodingTime = void 0;\nexports.bossExplodingTime = 1;\nexports.speedX = 13;\nexports.baseAppearanceInterval = 25;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Boss/config.ts?");

/***/ }),

/***/ "./src/components/Boss/index.ts":
/*!**************************************!*\
  !*** ./src/components/Boss/index.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Vector_1 = __importDefault(__webpack_require__(/*! @/utils/common/Vector */ \"./src/utils/common/Vector.ts\"));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst enums_1 = __webpack_require__(/*! @/ts/enums */ \"./src/ts/enums.ts\");\nconst config_1 = __webpack_require__(/*! ./config */ \"./src/components/Boss/config.ts\");\nconst audios_1 = __importDefault(__webpack_require__(/*! @/audios */ \"./src/audios/index.ts\"));\nclass Boss {\n    constructor(state) {\n        this.timeSinceDeath = 0;\n        this.status = \"alive\";\n        this.direction = Math.random() > 0.5 ? enums_1.HorizontalDirection.Right : enums_1.HorizontalDirection.Left;\n        this.numOfPlayerFires = state.numOfPlayerFires;\n        if (this.direction === enums_1.HorizontalDirection.Left) {\n            this.pos = new Vector_1.default(100, game_config_1.LAYOUT.bossYPos);\n        }\n        else {\n            this.pos = new Vector_1.default(-game_config_1.DIMENSIONS.boss.w, game_config_1.LAYOUT.bossYPos);\n        }\n        this.stopPitch = this.startPitch();\n    }\n    startPitch() {\n        return audios_1.default.boss_lowpitch();\n    }\n    get score() {\n        if (this.numOfPlayerFires === 23 ||\n            (this.numOfPlayerFires - 23) % 15 === 0) {\n            return 300;\n        }\n        const hundredPercent = this.numOfPlayerFires < 23 ? 23 : 15;\n        const progress = (this.numOfPlayerFires % hundredPercent) / hundredPercent;\n        return Math.round((progress * 200) / 10) * 10;\n    }\n    update(state, timeStep) {\n        if (state.numOfPlayerFires !== this.numOfPlayerFires) {\n            this.numOfPlayerFires = state.numOfPlayerFires;\n        }\n        if (this.status === \"exploding\") {\n            this.timeSinceDeath += timeStep;\n            if (this.timeSinceDeath >= config_1.bossExplodingTime) {\n                this.status = \"dead\";\n            }\n            return;\n        }\n        this.pos = this.pos.plus(new Vector_1.default(this.direction * config_1.speedX * timeStep, 0));\n    }\n    isOutOfBounds() {\n        if (this.direction === enums_1.HorizontalDirection.Right) {\n            return this.pos.x >= 100;\n        }\n        else {\n            return this.pos.x <= -game_config_1.DIMENSIONS.boss.w;\n        }\n    }\n}\nexports[\"default\"] = Boss;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Boss/index.ts?");

/***/ }),

/***/ "./src/components/Bullet/index.ts":
/*!****************************************!*\
  !*** ./src/components/Bullet/index.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nclass Bullet {\n    constructor(from, pos, speed, size, wiggly = false) {\n        this.from = from;\n        this.pos = pos;\n        this.speed = speed;\n        this.size = size;\n        this.wiggly = wiggly;\n    }\n    update(timeStep) {\n        this.pos = this.pos.plus(this.speed.times(timeStep));\n    }\n    isOutOfBounds() {\n        return (this.pos.x > 100 ||\n            this.pos.x < -this.size.w ||\n            this.pos.y + this.size.h >= game_config_1.LAYOUT.floorYPos ||\n            this.pos.y < -this.size.h);\n    }\n}\nexports[\"default\"] = Bullet;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Bullet/index.ts?");

/***/ }),

/***/ "./src/components/Environment/index.ts":
/*!*********************************************!*\
  !*** ./src/components/Environment/index.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Alien_1 = __importDefault(__webpack_require__(/*! ../Alien */ \"./src/components/Alien/index.ts\"));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst overlap_1 = __importDefault(__webpack_require__(/*! @/utils/common/overlap */ \"./src/utils/common/overlap.ts\"));\nclass GameEnv {\n    constructor(alienSet, player, walls) {\n        this.alienSet = alienSet;\n        this.player = player;\n        this.walls = walls;\n    }\n    alienSetTouchesPlayer() {\n        return this.alienSet.pos.y + this.alienSet.size.h >= this.player.pos.y;\n    }\n    bulletTouchesObject(bullet, objPos, objSize) {\n        return (0, overlap_1.default)(bullet.pos, bullet.size, objPos, objSize);\n    }\n    handleAlienSetContactWithWall() {\n        for (const wall of this.walls) {\n            for (const { alien } of this.alienSet) {\n                if (!(alien instanceof Alien_1.default))\n                    continue;\n                const alienPos = this.alienSet.getAlienPos(alien.gridPos);\n                wall.collide(alienPos, game_config_1.DIMENSIONS.alien);\n            }\n        }\n        return false;\n    }\n    bulletTouchesOtherBullet(bullet1, bullet2) {\n        return this.bulletTouchesObject(bullet1, bullet2.pos, bullet2.size);\n    }\n}\nexports[\"default\"] = GameEnv;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Environment/index.ts?");

/***/ }),

/***/ "./src/components/Explosion/index.ts":
/*!*******************************************!*\
  !*** ./src/components/Explosion/index.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass Explosion {\n    constructor(size, pos, duration) {\n        this.size = size;\n        this.pos = pos;\n        this.duration = duration;\n        this.timeSinceBeginning = 0;\n    }\n    update(timeStep) {\n        this.timeSinceBeginning += timeStep;\n    }\n}\nexports[\"default\"] = Explosion;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Explosion/index.ts?");

/***/ }),

/***/ "./src/components/Gun/index.ts":
/*!*************************************!*\
  !*** ./src/components/Gun/index.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Vector_1 = __importDefault(__webpack_require__(/*! @/utils/common/Vector */ \"./src/utils/common/Vector.ts\"));\nconst Bullet_1 = __importDefault(__webpack_require__(/*! ../Bullet */ \"./src/components/Bullet/index.ts\"));\nconst numbers_1 = __webpack_require__(/*! @/utils/common/numbers */ \"./src/utils/common/numbers.ts\");\nclass Gun {\n    constructor(owner, bulletSpeed, bulletSize, baseFireInterval, isBulletWiggly = false) {\n        this.owner = owner;\n        this.bulletSpeed = bulletSpeed;\n        this.bulletSize = bulletSize;\n        this.baseFireInterval = baseFireInterval;\n        this.isBulletWiggly = isBulletWiggly;\n        this.timeSinceLastShot = 0;\n        this.fireInterval =\n            this.baseFireInterval === 0\n                ? 0\n                : (0, numbers_1.randomNumberInFactorRange)(baseFireInterval, 0.2);\n        this.timeSinceLastShot =\n            this.baseFireInterval === 0 ? 0 : (0, numbers_1.randomNum)(0, this.fireInterval);\n    }\n    fire(pos, direction) {\n        const bullet = new Bullet_1.default(this.owner, pos, new Vector_1.default(0, direction === \"up\" ? -this.bulletSpeed : this.bulletSpeed), this.bulletSize, this.isBulletWiggly);\n        if (this.baseFireInterval === 0) {\n            return bullet;\n        }\n        if (this.canFire()) {\n            this.timeSinceLastShot = 0;\n            this.fireInterval = (0, numbers_1.randomNumberInFactorRange)(this.baseFireInterval, 0.2);\n            return bullet;\n        }\n        return null;\n    }\n    update(timeStep) {\n        if (this.baseFireInterval === 0)\n            return;\n        this.timeSinceLastShot += timeStep * 1000;\n    }\n    canFire() {\n        if (this.baseFireInterval === 0)\n            return true;\n        return this.timeSinceLastShot >= this.fireInterval;\n    }\n}\nexports[\"default\"] = Gun;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Gun/index.ts?");

/***/ }),

/***/ "./src/components/IterablePieces/index.ts":
/*!************************************************!*\
  !*** ./src/components/IterablePieces/index.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst readSolidPlan_1 = __importDefault(__webpack_require__(/*! ../../utils/common/readSolidPlan */ \"./src/utils/common/readSolidPlan.ts\"));\nclass IterablePieces {\n    constructor(plan, solidCharacter = \"#\") {\n        const pieces = (0, readSolidPlan_1.default)(plan, solidCharacter);\n        this.pieces = pieces;\n        this.numOfColumns = pieces[0].length;\n        this.numOfRows = pieces.length;\n    }\n    breakPiece(column, row) {\n        this.pieces[row][column] = false;\n    }\n    *[Symbol.iterator]() {\n        const rows = this.pieces.length;\n        for (let row = 0; row < rows; row++) {\n            const rowLength = this.pieces[row].length;\n            for (let column = 0; column < rowLength; column++) {\n                const piece = this.pieces[row][column];\n                yield { row, column, piece };\n            }\n        }\n    }\n}\nexports[\"default\"] = IterablePieces;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/IterablePieces/index.ts?");

/***/ }),

/***/ "./src/components/Player/config.ts":
/*!*****************************************!*\
  !*** ./src/components/Player/config.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.revivingTime = exports.explodingTime = exports.xSpeed = void 0;\nexports.xSpeed = 30, exports.explodingTime = 1, exports.revivingTime = 1.5;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Player/config.ts?");

/***/ }),

/***/ "./src/components/Player/index.ts":
/*!****************************************!*\
  !*** ./src/components/Player/index.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Gun_1 = __importDefault(__webpack_require__(/*! ../Gun */ \"./src/components/Gun/index.ts\"));\nconst Vector_1 = __importDefault(__webpack_require__(/*! @/utils/common/Vector */ \"./src/utils/common/Vector.ts\"));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst config_1 = __webpack_require__(/*! ./config */ \"./src/components/Player/config.ts\");\nconst audios_1 = __importDefault(__webpack_require__(/*! @/audios */ \"./src/audios/index.ts\"));\nclass Player {\n    constructor(bestScore) {\n        this.bestScore = bestScore;\n        this.actorType = \"player\";\n        this.baseXPos = 50 - game_config_1.DIMENSIONS.player.w / 2;\n        this.pos = new Vector_1.default(this.baseXPos, game_config_1.LAYOUT.playerYPos);\n        this.gun = new Gun_1.default(\"player\", 75, { w: 0.5, h: 3 }, 0);\n        this.lives = 3;\n        this.score = 0;\n        this.status = \"alive\";\n        this.timeSinceExplosion = 0;\n        this.timeSinceResurrection = 0;\n    }\n    fire() {\n        const bulletPosX = this.pos.x + game_config_1.DIMENSIONS.player.w / 2 - this.gun.bulletSize.w / 2;\n        audios_1.default.shoot();\n        return this.gun.fire(new Vector_1.default(bulletPosX, this.pos.y), \"up\");\n    }\n    resetPos() {\n        this.pos = new Vector_1.default(this.baseXPos, game_config_1.LAYOUT.playerYPos);\n    }\n    update(state, timeStep, actions) {\n        const movedX = new Vector_1.default(timeStep * config_1.xSpeed, 0);\n        this.handleStatus(timeStep);\n        if (this.status !== \"exploding\") {\n            if (actions.moveLeft && this.pos.x > game_config_1.LAYOUT.padding.hor) {\n                this.pos = this.pos.minus(movedX);\n            }\n            else if (actions.moveRight &&\n                this.pos.x + game_config_1.DIMENSIONS.player.w < 100 - game_config_1.LAYOUT.padding.hor) {\n                this.pos = this.pos.plus(movedX);\n            }\n            if (actions.fire &&\n                !state.isPlayerBulletPresent &&\n                !state.alienSet.entering) {\n                state.bullets.push(this.fire());\n                state.isPlayerBulletPresent = true;\n                state.numOfPlayerFires++;\n            }\n        }\n    }\n    handleStatus(timeStep) {\n        if (this.status === \"exploding\") {\n            this.timeSinceExplosion += timeStep;\n        }\n        if (this.status === \"reviving\") {\n            this.timeSinceResurrection += timeStep;\n        }\n        if (this.timeSinceExplosion >= config_1.explodingTime) {\n            this.status = \"reviving\";\n            this.timeSinceExplosion = 0;\n            this.resetPos();\n        }\n        if (this.timeSinceResurrection >= config_1.revivingTime) {\n            this.status = \"alive\";\n            this.timeSinceResurrection = 0;\n        }\n    }\n}\nexports[\"default\"] = Player;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Player/index.ts?");

/***/ }),

/***/ "./src/components/Presenter/index.ts":
/*!*******************************************!*\
  !*** ./src/components/Presenter/index.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst alien_set_1 = __importDefault(__webpack_require__(/*! @/plans/alien-set */ \"./src/plans/alien-set.ts\"));\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/components/Presenter/utils.ts\");\nclass GamePresenter {\n    constructor(State, View, parent) {\n        this.State = State;\n        this.status = \"start\";\n        this.bestScore = this.getBestScore();\n        this.state = State.start(alien_set_1.default, this.bestScore);\n        this.view = new View(this.state, {\n            onPauseGame: this.handlePause.bind(this),\n            onStartGame: this.handleStartGame.bind(this),\n            onRestartGame: this.handleRestartGame.bind(this),\n        }, parent);\n        this.view.syncState(this.state, 0);\n        this.runGame();\n    }\n    getBestScore() {\n        const bestScore = localStorage.getItem(\"bestScore\");\n        return bestScore === null ? 0 : Number(bestScore);\n    }\n    setBestScore(score) {\n        localStorage.setItem(\"bestScore\", score.toString());\n        this.bestScore = score;\n    }\n    handlePause() {\n        var _a, _b;\n        if (this.state.status !== \"running\" && this.state.status !== \"paused\") {\n            return;\n        }\n        if (this.state.status === \"paused\") {\n            this.state.status = \"running\";\n            this.status = \"running\";\n            (_a = this.state.boss) === null || _a === void 0 ? void 0 : _a.startPitch();\n            this.runGame();\n        }\n        else {\n            (_b = this.state.boss) === null || _b === void 0 ? void 0 : _b.stopPitch();\n            this.state.status = \"paused\";\n            this.status = \"paused\";\n        }\n    }\n    handleStartGame() {\n        if (this.state.status === \"start\") {\n            this.state.status = \"running\";\n        }\n    }\n    handleRestartGame() {\n        if (this.state.status === \"lost\") {\n            this.state = this.State.start(alien_set_1.default, this.bestScore);\n            this.state.status = \"running\";\n        }\n    }\n    runGame() {\n        (0, utils_1.runAnimation)((timeStep) => this.frame(timeStep));\n    }\n    frame(timeStep) {\n        this.state.update(timeStep, this.view.actions);\n        if (this.state.status !== this.status) {\n            this.view.cleanUpFor(this.state.status);\n            this.status = this.state.status;\n            if (this.status === \"lost\" &&\n                this.bestScore < this.state.player.bestScore) {\n                this.setBestScore(this.state.player.score);\n            }\n        }\n        this.view.syncState(this.state, timeStep);\n        if (this.state.status === \"paused\")\n            return false;\n        return true;\n    }\n}\nexports[\"default\"] = GamePresenter;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Presenter/index.ts?");

/***/ }),

/***/ "./src/components/Presenter/utils.ts":
/*!*******************************************!*\
  !*** ./src/components/Presenter/utils.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.runAnimation = void 0;\nfunction runAnimation(callback) {\n    let lastTime = null;\n    function frame(time) {\n        let shouldContinue;\n        if (lastTime) {\n            const timeStep = Math.min(time - lastTime, 100) / 1000;\n            lastTime = time;\n            shouldContinue = callback(timeStep);\n        }\n        else {\n            lastTime = time;\n            shouldContinue = true;\n        }\n        if (shouldContinue)\n            requestAnimationFrame(frame);\n    }\n    requestAnimationFrame(frame);\n}\nexports.runAnimation = runAnimation;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Presenter/utils.ts?");

/***/ }),

/***/ "./src/components/State/index.ts":
/*!***************************************!*\
  !*** ./src/components/State/index.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Boss_1 = __importDefault(__webpack_require__(/*! ../Boss */ \"./src/components/Boss/index.ts\"));\nconst Wall_1 = __importDefault(__webpack_require__(/*! ../Wall */ \"./src/components/Wall/index.ts\"));\nconst Player_1 = __importDefault(__webpack_require__(/*! ../Player */ \"./src/components/Player/index.ts\"));\nconst Explosion_1 = __importDefault(__webpack_require__(/*! ../Explosion */ \"./src/components/Explosion/index.ts\"));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst numbers_1 = __webpack_require__(/*! @/utils/common/numbers */ \"./src/utils/common/numbers.ts\");\nconst AlienSet_1 = __importDefault(__webpack_require__(/*! ../AlienSet */ \"./src/components/AlienSet/index.ts\"));\nconst Alien_1 = __importDefault(__webpack_require__(/*! ../Alien */ \"./src/components/Alien/index.ts\"));\nconst Environment_1 = __importDefault(__webpack_require__(/*! ../Environment */ \"./src/components/Environment/index.ts\"));\nconst walls_1 = __importDefault(__webpack_require__(/*! @/plans/walls */ \"./src/plans/walls.ts\"));\nconst BOSS_CONFIG = __importStar(__webpack_require__(/*! ../Boss/config */ \"./src/components/Boss/config.ts\"));\nconst audios_1 = __importDefault(__webpack_require__(/*! @/audios */ \"./src/audios/index.ts\"));\nconst alien_set_1 = __importDefault(__webpack_require__(/*! @/plans/alien-set */ \"./src/plans/alien-set.ts\"));\nfunction generateRandomBossAppearanceInterval() {\n    return (0, numbers_1.randomNumberInFactorRange)(BOSS_CONFIG.baseAppearanceInterval, 0.1);\n}\nconst bulletCollisionExplosionDuration = 0.3;\nclass GameState {\n    constructor(alienSet, player, env) {\n        this.alienSet = alienSet;\n        this.player = player;\n        this.env = env;\n        this.bullets = [];\n        this.status = \"start\";\n        this.boss = null;\n        this.bossesKilled = 0;\n        this.aliensKilled = 0;\n        this.isPlayerBulletPresent = false;\n        this.bulletCollisions = [];\n        this.lastScore = { value: null, id: null };\n        this.numOfPlayerFires = 0;\n        this.timeSinceBossLastAppearance = 0;\n        this.bossAppearanceInterval = generateRandomBossAppearanceInterval();\n    }\n    update(timeStep, actions) {\n        var _a;\n        if (this.status !== \"running\")\n            return;\n        this.handleCollisions(timeStep);\n        this.player.update(this, timeStep, actions);\n        if (this.player.status === \"exploding\")\n            return;\n        this.alienSet.update(timeStep);\n        if (this.alienSet.entering) {\n            return;\n        }\n        this.fireAliens();\n        this.handleBullets(timeStep);\n        this.handleBoss(timeStep);\n        this.env.handleAlienSetContactWithWall();\n        if (this.alienSet.alive === 0) {\n            this.alienSet = new AlienSet_1.default(alien_set_1.default);\n            this.bullets = [];\n            this.isPlayerBulletPresent = false;\n            this.env.alienSet = this.alienSet;\n            this.player.lives++;\n            this.numOfPlayerFires = 0;\n            if (this.boss !== null) {\n                this.boss.stopPitch();\n                this.boss = null;\n            }\n        }\n        else if (this.player.lives < 1 || this.env.alienSetTouchesPlayer()) {\n            this.status = \"lost\";\n            (_a = this.boss) === null || _a === void 0 ? void 0 : _a.stopPitch();\n            const { bestScore, score } = this.player;\n            this.player.bestScore = score > bestScore ? score : bestScore;\n            AlienSet_1.default.instancesCreated = 0;\n        }\n    }\n    handleBullets(timeStep) {\n        this.bullets.forEach((bullet) => bullet.update(timeStep));\n        let newBullets = [];\n        let isSomeAlienKilled = false;\n        let playerBulletCollided = false;\n        for (const b of this.bullets) {\n            const outOfBounds = b.isOutOfBounds();\n            if (outOfBounds) {\n                if (b.from === \"player\")\n                    this.isPlayerBulletPresent = false;\n                continue;\n            }\n            if (b.from === \"alien\") {\n                const touchedPlayer = this.handleBulletContactWithPlayer(b);\n                if (touchedPlayer)\n                    continue;\n            }\n            else if (b.from === \"player\") {\n                if (playerBulletCollided) {\n                    this.isPlayerBulletPresent = false;\n                    continue;\n                }\n                const touchedAlien = this.handleBulletContactWithAlien(b);\n                if (!isSomeAlienKilled)\n                    isSomeAlienKilled = touchedAlien;\n                if (touchedAlien) {\n                    this.isPlayerBulletPresent = false;\n                    continue;\n                }\n                const touchedBoss = this.handleBulletContactWithBoss(b);\n                if (touchedBoss) {\n                    this.isPlayerBulletPresent = false;\n                    continue;\n                }\n            }\n            const touchedWall = this.handleBulletContactWithWalls(b);\n            if (touchedWall) {\n                if (b.from === \"player\")\n                    this.isPlayerBulletPresent = false;\n                continue;\n            }\n            if (b.from === \"alien\") {\n                const playerBullet = this.bullets.find((b) => b.from === \"player\");\n                if (playerBullet) {\n                    const touchedPlayerBullet = this.env.bulletTouchesOtherBullet(b, playerBullet);\n                    if (touchedPlayerBullet) {\n                        this.bulletCollisions.push(new Explosion_1.default(game_config_1.DIMENSIONS.bulletCollision, {\n                            y: playerBullet.pos.y,\n                            x: playerBullet.pos.x + this.player.gun.bulletSize.w / 2,\n                        }, bulletCollisionExplosionDuration));\n                        playerBulletCollided = true;\n                        const chance = b.wiggly ? 0.9 : 0.3;\n                        if (Math.random() > chance)\n                            continue;\n                    }\n                }\n            }\n            newBullets.push(b);\n        }\n        if (this.isPlayerBulletPresent && playerBulletCollided) {\n            newBullets = newBullets.filter((b) => b.from !== \"player\");\n            this.isPlayerBulletPresent = false;\n        }\n        if (isSomeAlienKilled)\n            this.alienSet.adapt();\n        this.bullets = newBullets;\n    }\n    handleBulletContactWithPlayer(b) {\n        if (this.player.status === \"alive\" &&\n            this.env.bulletTouchesObject(b, this.player.pos, game_config_1.DIMENSIONS.player)) {\n            this.player.lives--;\n            this.player.status = \"exploding\";\n            audios_1.default.explosion();\n            return true;\n        }\n        return false;\n    }\n    handleBulletContactWithAlien(b) {\n        for (const { alien } of this.alienSet) {\n            if (!(alien instanceof Alien_1.default))\n                continue;\n            const alienPos = this.alienSet.getAlienPos(alien.gridPos);\n            if (this.env.bulletTouchesObject(b, alienPos, game_config_1.DIMENSIONS.alien)) {\n                this.lastScore.value = alien.score;\n                if (this.lastScore.id !== null)\n                    this.lastScore.id++;\n                else\n                    this.lastScore.id = 0;\n                this.player.score += alien.score;\n                this.aliensKilled++;\n                this.alienSet.removeAlien(alien);\n                return true;\n            }\n        }\n        return false;\n    }\n    handleBulletContactWithWalls(b) {\n        let touchedPiece = false;\n        for (const wall of this.env.walls) {\n            touchedPiece = wall.collide(b.pos, b.size);\n            if (touchedPiece)\n                break;\n        }\n        return touchedPiece;\n    }\n    handleBulletContactWithBoss(b) {\n        if (this.boss === null || this.boss.status !== \"alive\")\n            return false;\n        if (this.env.bulletTouchesObject(b, this.boss.pos, game_config_1.DIMENSIONS.boss)) {\n            this.lastScore.value = this.boss.score;\n            if (this.lastScore.id !== null)\n                this.lastScore.id++;\n            else\n                this.lastScore.id = 0;\n            this.player.score += this.boss.score;\n            this.boss.status = \"exploding\";\n            this.boss.stopPitch();\n            this.bossesKilled++;\n            this.bossAppearanceInterval = generateRandomBossAppearanceInterval();\n            audios_1.default.alienKilled();\n            return true;\n        }\n    }\n    fireAliens() {\n        const newBullets = [];\n        for (const { alien } of this.alienSet) {\n            if (!(alien instanceof Alien_1.default))\n                continue;\n            if (alien.gun.canFire()) {\n                const alienPos = this.alienSet.getAlienPos(alien.gridPos);\n                const b = alien.fire(alienPos);\n                newBullets.push(b);\n            }\n        }\n        this.bullets.push(...newBullets);\n    }\n    handleBoss(timeStep) {\n        if (this.boss !== null)\n            this.boss.update(this, timeStep);\n        else\n            this.timeSinceBossLastAppearance += timeStep;\n        if (this.timeSinceBossLastAppearance >= this.bossAppearanceInterval) {\n            this.boss = new Boss_1.default(this);\n            this.timeSinceBossLastAppearance = 0;\n            this.bossAppearanceInterval = generateRandomBossAppearanceInterval();\n        }\n        if (this.boss &&\n            (this.boss.isOutOfBounds() || this.boss.status === \"dead\")) {\n            this.boss.stopPitch();\n            this.boss = null;\n        }\n    }\n    handleCollisions(timeStep) {\n        this.bulletCollisions.forEach((c) => c.update(timeStep));\n        this.bulletCollisions = this.bulletCollisions.filter((c) => c.timeSinceBeginning < c.duration);\n    }\n    static start(plan, bestScore) {\n        const alienSet = new AlienSet_1.default(plan);\n        const player = new Player_1.default(bestScore);\n        const gap = (100 - game_config_1.LAYOUT.wallsSize.w * game_config_1.LAYOUT.numWalls) / 5;\n        const walls = new Array(game_config_1.LAYOUT.numWalls)\n            .fill(undefined)\n            .map((_, i) => {\n            return new Wall_1.default({ x: (i + 1) * gap + game_config_1.LAYOUT.wallsSize.w * i, y: game_config_1.LAYOUT.wallYPos }, game_config_1.LAYOUT.wallsSize, walls_1.default);\n        });\n        const env = new Environment_1.default(alienSet, player, walls);\n        return new GameState(alienSet, player, env);\n    }\n}\nexports[\"default\"] = GameState;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/State/index.ts?");

/***/ }),

/***/ "./src/components/View/config.ts":
/*!***************************************!*\
  !*** ./src/components/View/config.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.wigglyBulletPieces = exports.colors = exports.GAME_DISPLAY = exports.GAMEOVER_SCREEN_LAYOUT = exports.INITIAL_SCREEN_LAYOUT = void 0;\nconst IterablePieces_1 = __importDefault(__webpack_require__(/*! @/components/IterablePieces */ \"./src/components/IterablePieces/index.ts\"));\nconst wiggly_bullet_1 = __importDefault(__webpack_require__(/*! @/plans/wiggly-bullet */ \"./src/plans/wiggly-bullet.ts\"));\nexports.INITIAL_SCREEN_LAYOUT = {\n    titleYPos: 30,\n    pressMessageYPos: 85,\n};\nexports.GAMEOVER_SCREEN_LAYOUT = {\n    titleYPos: 16,\n    pressMessageYPos: 80,\n};\nexports.GAME_DISPLAY = {\n    maxWidth: 1024,\n    aspectRatio: 4 / 3,\n};\nexports.colors = {\n    boss: \"#ff4242\",\n};\nexports.wigglyBulletPieces = [\n    new IterablePieces_1.default(wiggly_bullet_1.default[0]),\n    new IterablePieces_1.default(wiggly_bullet_1.default[1]),\n];\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/config.ts?");

/***/ }),

/***/ "./src/components/View/images/index.ts":
/*!*********************************************!*\
  !*** ./src/components/View/images/index.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.spaceKeyImage = exports.arrowKeysSprite = exports.wigglyBulletImage = exports.bossImage = exports.playerSpaceship = exports.aliensSprite = void 0;\nconst aliens_sprite_png_1 = __importDefault(__webpack_require__(/*! ./aliens-sprite.png */ \"./src/components/View/images/aliens-sprite.png\"));\nconst spaceship_png_1 = __importDefault(__webpack_require__(/*! ./spaceship.png */ \"./src/components/View/images/spaceship.png\"));\nconst boss_png_1 = __importDefault(__webpack_require__(/*! ./boss.png */ \"./src/components/View/images/boss.png\"));\nconst wiggly_bullet_png_1 = __importDefault(__webpack_require__(/*! ./wiggly-bullet.png */ \"./src/components/View/images/wiggly-bullet.png\"));\nconst arrow_keys_png_1 = __importDefault(__webpack_require__(/*! ./arrow-keys.png */ \"./src/components/View/images/arrow-keys.png\"));\nconst space_key_png_1 = __importDefault(__webpack_require__(/*! ./space-key.png */ \"./src/components/View/images/space-key.png\"));\nconst aliensSprite = new Image(600, 100);\nexports.aliensSprite = aliensSprite;\naliensSprite.src = aliens_sprite_png_1.default;\nconst playerSpaceship = new Image(100, 100);\nexports.playerSpaceship = playerSpaceship;\nplayerSpaceship.src = spaceship_png_1.default;\nconst bossImage = new Image(100, 100);\nexports.bossImage = bossImage;\nbossImage.src = boss_png_1.default;\nconst wigglyBulletImage = new Image(100, 100);\nexports.wigglyBulletImage = wigglyBulletImage;\nwigglyBulletImage.src = wiggly_bullet_png_1.default;\nconst arrowKeysSprite = new Image(600, 100);\nexports.arrowKeysSprite = arrowKeysSprite;\narrowKeysSprite.src = arrow_keys_png_1.default;\nconst spaceKeyImage = new Image(600, 100);\nexports.spaceKeyImage = spaceKeyImage;\nspaceKeyImage.src = space_key_png_1.default;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/images/index.ts?");

/***/ }),

/***/ "./src/components/View/index.ts":
/*!**************************************!*\
  !*** ./src/components/View/index.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/components/View/utils.ts\");\nconst config_1 = __webpack_require__(/*! ./config */ \"./src/components/View/config.ts\");\nconst InitialScreen_1 = __importDefault(__webpack_require__(/*! ./screens/InitialScreen */ \"./src/components/View/screens/InitialScreen.ts\"));\nconst GameOverScreen_1 = __importDefault(__webpack_require__(/*! ./screens/GameOverScreen */ \"./src/components/View/screens/GameOverScreen.ts\"));\nconst RunningGameScreen_1 = __importDefault(__webpack_require__(/*! ./screens/RunningGameScreen */ \"./src/components/View/screens/RunningGameScreen.ts\"));\n__webpack_require__(/*! ./styles/buttons.css */ \"./src/components/View/styles/buttons.css\");\nclass CanvasView {\n    constructor(state, handlers, parent) {\n        this.state = state;\n        this.handlers = handlers;\n        this.actions = {};\n        this.canvas = document.createElement(\"canvas\");\n        this.canvas.style.display = \"block\";\n        this.canvas.style.marginInline = \"auto\";\n        parent.appendChild(this.canvas);\n        this.currentScreen = new InitialScreen_1.default(this.canvas, handlers.onStartGame);\n        this.defineEventListeners();\n        this.adaptDisplaySize();\n        this.syncState(state, 0);\n    }\n    adaptDisplaySize() {\n        let canvasWidth = Math.min(config_1.GAME_DISPLAY.maxWidth, (0, utils_1.getElementInnerDimensions)(this.canvas.parentNode).w);\n        let canvasHeight = canvasWidth / config_1.GAME_DISPLAY.aspectRatio;\n        if (canvasHeight > innerHeight) {\n            canvasHeight = innerHeight;\n            canvasWidth = canvasHeight * config_1.GAME_DISPLAY.aspectRatio;\n        }\n        this.canvas.setAttribute(\"width\", canvasWidth.toString());\n        this.canvas.setAttribute(\"height\", canvasHeight.toString());\n        this.syncState(this.state, 1 / 60);\n    }\n    cleanUpFor(newStateStatus) {\n        switch (newStateStatus) {\n            case \"start\": {\n                break;\n            }\n            case \"running\": {\n                this.currentScreen.cleanUp();\n                this.currentScreen = new RunningGameScreen_1.default(this.canvas, this.syncAction.bind(this), this.handlers.onPauseGame);\n                break;\n            }\n            case \"lost\": {\n                this.currentScreen.cleanUp();\n                this.currentScreen = new GameOverScreen_1.default(this.canvas, this.handlers.onRestartGame);\n                break;\n            }\n        }\n    }\n    syncState(state, timeStep) {\n        this.state = state;\n        if (state.status === \"lost\") {\n            const actions = Object.keys(this.actions);\n            actions.forEach((a) => (this.actions[a] = false));\n        }\n        this.currentScreen.syncState(state, timeStep);\n    }\n    defineEventListeners() {\n        window.addEventListener(\"resize\", () => this.adaptDisplaySize());\n    }\n    syncAction(action, pressed) {\n        this.actions[action] = pressed;\n    }\n}\nexports[\"default\"] = CanvasView;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/index.ts?");

/***/ }),

/***/ "./src/components/View/screens/BaseScreen.ts":
/*!***************************************************!*\
  !*** ./src/components/View/screens/BaseScreen.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.fontSizes = exports.colors = void 0;\nexports.colors = {\n    X: \"limegreen\",\n    Y: \"orange\",\n    Z: \"pink\",\n    boss: \"#f77\",\n};\nexports.fontSizes = {\n    sm: 2.5,\n    md: 4,\n    lg: 6,\n    xl: 12,\n};\nclass BaseCanvasWrapper {\n    constructor(canvas) {\n        this.canvas = canvas;\n        this.unregisterFunctions = [];\n        this.fontFamily = \"'VT323', monospace\";\n        this.ctx = canvas.getContext(\"2d\");\n        this.ctx.imageSmoothingEnabled = false;\n    }\n    get canvasWidth() {\n        return this.canvas.width;\n    }\n    get canvasHeight() {\n        return this.canvas.height;\n    }\n    horPixels(percentage) {\n        return (percentage / 100) * this.canvasWidth;\n    }\n    verPixels(percentage) {\n        return (percentage / 100) * this.canvasHeight;\n    }\n    getPixelPos(percentagePos) {\n        return {\n            x: this.horPixels(percentagePos.x),\n            y: this.verPixels(percentagePos.y),\n        };\n    }\n    getPixelSize(percentageSize) {\n        return {\n            w: this.horPixels(percentageSize.w),\n            h: this.verPixels(percentageSize.h),\n        };\n    }\n    getFontSize(size) {\n        return this.horPixels(exports.fontSizes[size]);\n    }\n    setFontSize(size) {\n        this.ctx.font = `${this.getFontSize(size)}px ${this.fontFamily}`;\n    }\n    clearScreen() {\n        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);\n        this.ctx.fillStyle = \"#000\";\n        this.drawBackground();\n    }\n    drawBackground() {\n        const { ctx } = this;\n        ctx.save();\n        const size = this.horPixels(1);\n        const radius = size / 2;\n        const center = size / 2;\n        const gradient = this.ctx.createRadialGradient(center, center, radius / 3, center, center, radius);\n        gradient.addColorStop(0, \"#222\");\n        gradient.addColorStop(0.8, \"#000\");\n        ctx.scale(this.canvasWidth / size, this.canvasHeight / size);\n        ctx.fillStyle = gradient;\n        ctx.fillRect(0, 0, size, size);\n        ctx.restore();\n    }\n    cleanUp() {\n        this.mobileButtons.textContent = \"\";\n        this.mobileButtons.remove();\n        this.unregisterFunctions.forEach((f) => f());\n        this.unregisterFunctions = [];\n    }\n    drawPieces(pieces, pieceSize, color = \"#fff\") {\n        this.ctx.fillStyle = color;\n        const { w, h } = pieceSize;\n        for (const { piece, row, column } of pieces) {\n            if (!piece)\n                continue;\n            this.ctx.fillRect(column * w, row * h, w, h);\n        }\n    }\n}\nexports[\"default\"] = BaseCanvasWrapper;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/screens/BaseScreen.ts?");

/***/ }),

/***/ "./src/components/View/screens/GameOverScreen.ts":
/*!*******************************************************!*\
  !*** ./src/components/View/screens/GameOverScreen.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst utils_1 = __webpack_require__(/*! ../utils */ \"./src/components/View/utils.ts\");\nconst BaseScreen_1 = __importDefault(__webpack_require__(/*! ./BaseScreen */ \"./src/components/View/screens/BaseScreen.ts\"));\nconst config_1 = __webpack_require__(/*! ../config */ \"./src/components/View/config.ts\");\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nclass GameOverScreen extends BaseScreen_1.default {\n    constructor(canvas, onRestartGame) {\n        super(canvas);\n        this.onRestartGame = onRestartGame;\n        this.mobileButtons = (0, utils_1.elt)(\"div\", {\n            className: \"btn-container btn-container--state-restart\",\n        });\n        this.setUpControlMethods();\n    }\n    handleKeydown(e) {\n        if (e.key === game_config_1.ACTION_KEYS.restartGame) {\n            e.preventDefault();\n            this.onRestartGame();\n        }\n    }\n    setUpControlMethods() {\n        document.body.appendChild(this.mobileButtons);\n        const handler = (e) => this.handleKeydown(e);\n        window.addEventListener(\"keydown\", handler);\n        this.unregisterFunctions.push(() => {\n            window.removeEventListener(\"keydown\", handler);\n        });\n        this.createMobileControls();\n    }\n    createMobileControls() {\n        const restartBtn = (0, utils_1.elt)(\"button\", {\n            className: \"restart-btn btn-container__btn\",\n            onclick: this.onRestartGame,\n        }, \"restart\");\n        this.mobileButtons.appendChild(restartBtn);\n    }\n    syncState(state) {\n        this.clearScreen();\n        this.drawTitle();\n        this.drawStateData(state);\n        const messagePos = this.getPixelPos({\n            y: config_1.GAMEOVER_SCREEN_LAYOUT.pressMessageYPos,\n            x: 50,\n        });\n        (0, utils_1.drawTwinkleMessage)(this.ctx, \"Press space to play again\", messagePos, {\n            fontSize: this.getFontSize(\"md\"),\n            fontFamily: this.fontFamily,\n        });\n    }\n    drawTitle() {\n        const xPixelPos = this.horPixels(50), yPixelPos = this.verPixels(11);\n        this.setFontSize(\"xl\");\n        this.ctx.fillStyle = \"#f77\";\n        this.ctx.textAlign = \"center\";\n        this.ctx.textBaseline = \"top\";\n        this.ctx.fillText(\"GAME\", xPixelPos, yPixelPos);\n        this.ctx.fillText(\"OVER\", xPixelPos, yPixelPos + this.verPixels(11));\n    }\n    drawStateData(state) {\n        const { bossesKilled, aliensKilled, player: { score, bestScore }, } = state;\n        this.setFontSize(\"md\");\n        this.ctx.fillStyle = \"#fff\";\n        const aliens = aliensKilled === 1 ? \"alien\" : \"aliens\";\n        const bosses = bossesKilled === 1 ? \"boss\" : \"bosses\";\n        this.ctx.fillText(`You killed ${aliensKilled} ${aliens} and ${bossesKilled} ${bosses}`, this.horPixels(50), this.verPixels(45));\n        this.ctx.fillText(`Your score is ${score}`, this.horPixels(50), this.verPixels(52));\n        this.ctx.fillText(`Your best score is ${bestScore}`, this.horPixels(50), this.verPixels(59));\n    }\n}\nexports[\"default\"] = GameOverScreen;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/screens/GameOverScreen.ts?");

/***/ }),

/***/ "./src/components/View/screens/InitialScreen.ts":
/*!******************************************************!*\
  !*** ./src/components/View/screens/InitialScreen.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst config_1 = __webpack_require__(/*! ../config */ \"./src/components/View/config.ts\");\nconst utils_1 = __webpack_require__(/*! ../utils */ \"./src/components/View/utils.ts\");\nconst BaseScreen_1 = __importDefault(__webpack_require__(/*! ./BaseScreen */ \"./src/components/View/screens/BaseScreen.ts\"));\nconst config_2 = __webpack_require__(/*! @/components/Alien/config */ \"./src/components/Alien/config.ts\");\nconst images_1 = __webpack_require__(/*! ../images */ \"./src/components/View/images/index.ts\");\nconst invadersScores = Object.keys(config_2.alienTypesConfig).map((c, i) => ({\n    image: images_1.aliensSprite,\n    score: config_2.alienTypesConfig[c].score,\n    iconSize: { w: 3.5, h: 5 },\n    tiles: [i * 200, 0],\n    imageSize: [100, 100],\n}));\ninvadersScores.push({\n    score: null,\n    iconSize: { w: 10, h: 6.5 },\n    image: images_1.bossImage,\n    tiles: [0, 0],\n    imageSize: [images_1.bossImage.naturalWidth, images_1.bossImage.naturalHeight],\n});\nconst arrowKeysSpriteHorOffset = {\n    left: 0,\n    right: 150,\n    up: 300,\n    down: 450,\n};\nconst arrowKeySize = [5, 6.5], rectangleKeySize = [26, 6.5];\nconst arrowKeySourceImageSize = 150;\nclass InitialScreen extends BaseScreen_1.default {\n    constructor(canvas, onStartGame) {\n        super(canvas);\n        this.onStartGame = onStartGame;\n        this.mobileButtons = (0, utils_1.elt)(\"div\", {\n            className: \"btn-container btn-container--state-start\",\n        });\n        this.setUpControlMethods();\n    }\n    handleKeydown(e) {\n        if (game_config_1.ACTION_KEYS.startGame === e.key) {\n            e.preventDefault();\n            this.onStartGame();\n        }\n    }\n    setUpControlMethods() {\n        document.body.appendChild(this.mobileButtons);\n        const handler = (e) => this.handleKeydown(e);\n        window.addEventListener(\"keydown\", handler);\n        this.unregisterFunctions.push(() => {\n            window.removeEventListener(\"keydown\", handler);\n        });\n        this.createMobileControls();\n    }\n    createMobileControls() {\n        const startBtn = (0, utils_1.elt)(\"button\", {\n            className: \"start-btn btn-container__btn\",\n            onclick: this.onStartGame,\n        }, \"start\");\n        this.mobileButtons.appendChild(startBtn);\n    }\n    syncState(state) {\n        this.clearScreen();\n        this.drawTitle();\n        this.drawBestScore(state.player.bestScore);\n        this.drawScores();\n        const messagePos = this.getPixelPos({\n            y: config_1.INITIAL_SCREEN_LAYOUT.pressMessageYPos,\n            x: 5,\n        });\n        (0, utils_1.drawTwinkleMessage)(this.ctx, \"Press space to start\", messagePos, {\n            fontSize: this.getFontSize(\"md\"),\n            fontFamily: this.fontFamily,\n            align: \"start\",\n        });\n        this.drawControlsGuide();\n        this.drawAuthorAttribution();\n    }\n    drawTitle() {\n        this.setFontSize(\"xl\");\n        const { ctx } = this;\n        const xPixelPos = this.horPixels(5), yPixelPos = this.verPixels(8);\n        ctx.fillStyle = \"white\";\n        ctx.textAlign = \"start\";\n        ctx.textBaseline = \"hanging\";\n        ctx.fillText(\"SPACE\", xPixelPos, yPixelPos);\n        const spaceMetrics = ctx.measureText(\"SPACE\");\n        const { actualBoundingBoxDescent: h } = spaceMetrics;\n        ctx.fillText(\"INVADERS\", xPixelPos, yPixelPos + h + this.verPixels(1));\n    }\n    drawBestScore(bestScore) {\n        if (bestScore === 0)\n            return;\n        const { ctx } = this;\n        this.setFontSize(\"md\");\n        ctx.fillStyle = \"#fff\";\n        ctx.textAlign = \"start\";\n        ctx.textBaseline = \"top\";\n        ctx.fillText(`Your Best Score is ${bestScore}`, this.horPixels(5), this.verPixels(34));\n    }\n    drawControlsGuide() {\n        this.setFontSize(\"lg\");\n        const { ctx } = this;\n        ctx.textAlign = \"start\";\n        ctx.textBaseline = \"hanging\";\n        ctx.save();\n        const y = this.verPixels(45), x = this.horPixels(5);\n        ctx.translate(x, y);\n        ctx.fillText(\"CONTROLS\", 0, 0);\n        const controlsMetrics = ctx.measureText(\"CONTROLS\");\n        ctx.translate(0, this.verPixels(4) + controlsMetrics.actualBoundingBoxDescent);\n        this.setFontSize(\"md\");\n        const [arrowW, arrowH] = arrowKeySize, arrrowKeyPixelW = this.horPixels(arrowW), arrowKeyPixelH = this.verPixels(arrowH), horGap = this.horPixels(1), verGap = this.verPixels(2);\n        const { left, right } = arrowKeysSpriteHorOffset;\n        const sequenceWidth = this.drawSpriteSequence(images_1.arrowKeysSprite, arrowKeySourceImageSize, { w: arrrowKeyPixelW, h: arrowKeyPixelH }, horGap, [left, right]);\n        ctx.textBaseline = \"middle\";\n        ctx.save();\n        ctx.translate(sequenceWidth + horGap, arrowKeyPixelH / 2);\n        ctx.fillText(\"-> MOVEMENT\", 0, 0);\n        ctx.restore();\n        ctx.translate(0, arrowKeyPixelH + verGap);\n        const [spaceW, spaceH] = rectangleKeySize, spacePixelW = this.horPixels(spaceW), spacePixelH = this.verPixels(spaceH);\n        ctx.drawImage(images_1.spaceKeyImage, 0, 0, spacePixelW, spacePixelH);\n        ctx.translate(spacePixelW + horGap, spacePixelH / 2);\n        ctx.fillText(\"-> FIRE\", 0, 0);\n        ctx.restore();\n    }\n    drawSpriteSequence(sprite, sourceImageSize, targetImageSize, gap, offsets) {\n        const { ctx } = this;\n        let width = 0;\n        ctx.save();\n        offsets.forEach((os) => {\n            ctx.drawImage(sprite, os, 0, sourceImageSize, sourceImageSize, 0, 0, targetImageSize.w, targetImageSize.h);\n            width += targetImageSize.w + gap;\n            ctx.translate(targetImageSize.w + gap, 0);\n        });\n        ctx.restore();\n        return width;\n    }\n    drawScores() {\n        const baseYPos = 10;\n        const baseXPos = this.horPixels(73);\n        const gap = this.horPixels(1.5);\n        const { ctx } = this;\n        this.setFontSize(\"md\");\n        ctx.fillStyle = \"#fff\";\n        ctx.textBaseline = \"middle\";\n        ctx.textAlign = \"start\";\n        invadersScores.forEach(({ iconSize, score, image, tiles, imageSize }, i) => {\n            const { w, h } = this.getPixelSize(iconSize);\n            const y = this.verPixels(baseYPos + i * 7);\n            ctx.save();\n            ctx.translate(baseXPos, y);\n            ctx.save();\n            ctx.translate(-w, 0);\n            ctx.drawImage(image, tiles[0], tiles[1], imageSize[0], imageSize[1], 0, 0, w, h);\n            ctx.restore();\n            ctx.translate(gap, h / 2);\n            ctx.fillText(\"=\", 0, 0);\n            const equalsSignMetrics = ctx.measureText(\"=\");\n            ctx.translate(gap + equalsSignMetrics.width, 0);\n            ctx.fillText(score === null ? \"????\" : score + \" points\", 0, 0);\n            ctx.restore();\n        });\n    }\n    drawAuthorAttribution() {\n        const pos = this.getPixelPos({\n            x: 100 - game_config_1.LAYOUT.padding.hor,\n            y: 100 - game_config_1.LAYOUT.padding.ver,\n        });\n        const { ctx } = this;\n        this.setFontSize(\"sm\");\n        ctx.textAlign = \"end\";\n        ctx.textBaseline = \"bottom\";\n        ctx.fillText(\"Coded by Rafael Maia\", pos.x, pos.y);\n    }\n}\nexports[\"default\"] = InitialScreen;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/screens/InitialScreen.ts?");

/***/ }),

/***/ "./src/components/View/screens/RunningGameScreen.ts":
/*!**********************************************************!*\
  !*** ./src/components/View/screens/RunningGameScreen.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst BaseScreen_1 = __importDefault(__webpack_require__(/*! ./BaseScreen */ \"./src/components/View/screens/BaseScreen.ts\"));\nconst config_1 = __webpack_require__(/*! ../config */ \"./src/components/View/config.ts\");\nconst explosions_1 = __importDefault(__webpack_require__(/*! @/plans/explosions */ \"./src/plans/explosions.ts\"));\nconst IterablePieces_1 = __importDefault(__webpack_require__(/*! @/components/IterablePieces */ \"./src/components/IterablePieces/index.ts\"));\nconst playerConfig = __importStar(__webpack_require__(/*! @/components/Player/config */ \"./src/components/Player/config.ts\"));\nconst utils_1 = __webpack_require__(/*! ../utils */ \"./src/components/View/utils.ts\");\nconst images_1 = __webpack_require__(/*! ../images */ \"./src/components/View/images/index.ts\");\nconst aliensTileX = {\n    X: [0, 100],\n    Y: [200, 300],\n    Z: [400, 500],\n};\nconst alienImageSize = { w: 100, h: 100 };\nconst explosion = new IterablePieces_1.default(explosions_1.default);\nconst lastScoreAppearanceDuration = 1;\nclass RunningGameScreen extends BaseScreen_1.default {\n    constructor(canvas, syncAction, onPauseGame) {\n        super(canvas);\n        this.syncAction = syncAction;\n        this.onPauseGame = onPauseGame;\n        this.lastScore = { value: null, id: null };\n        this.timeSinceLastScoreChange = 0;\n        this.mobileButtons = (0, utils_1.elt)(\"div\", {\n            className: \"btn-container btn-container--state-running\",\n        });\n        this.pauseBtn = null;\n        this.trackedTouchIds = [];\n        this.setUpControlMethods();\n    }\n    setUpControlMethods() {\n        document.body.appendChild(this.mobileButtons);\n        const keys = Object.keys(game_config_1.RUNNING_GAME_KEY_ACTIONS);\n        const trackedKeys = (0, utils_1.trackKeys)(keys, (key, pressed) => {\n            const action = game_config_1.RUNNING_GAME_KEY_ACTIONS[key];\n            this.syncAction(action, pressed);\n        });\n        this.unregisterFunctions.push(trackedKeys.unregister);\n        const handleKeydown = (e) => {\n            if (e.key === game_config_1.ACTION_KEYS.pauseGame) {\n                e.preventDefault();\n                this.onPauseGame();\n            }\n        };\n        window.addEventListener(\"keydown\", handleKeydown);\n        this.unregisterFunctions.push(() => {\n            window.removeEventListener(\"keydown\", handleKeydown);\n        });\n        this.createMobileControls();\n    }\n    manageMobileButtonTouchEvents(btn, action) {\n        let id = null;\n        const handleStart = (ev) => {\n            const touches = ev.touches;\n            const touch = (0, utils_1.findUntrackedTouch)(touches, this.trackedTouchIds);\n            if (touch) {\n                id = touch.identifier;\n                this.syncAction(action, true);\n                btn.addEventListener(\"touchmove\", handleMove);\n                btn.addEventListener(\"touchend\", handleEnd);\n                btn.addEventListener(\"touchcancel\", handleEnd);\n                btn.classList.add(\"active\");\n            }\n        };\n        const handleMove = (ev) => {\n            const touches = ev.touches;\n            const touch = (0, utils_1.findTouch)(touches, id);\n            if (touch) {\n                const { top, left, right, bottom } = btn.getBoundingClientRect();\n                const { clientX: x, clientY: y } = touch;\n                if (x > left && x < right && y > top && y < bottom) {\n                    this.syncAction(action, true);\n                }\n                else {\n                    endTouch();\n                }\n            }\n            else {\n                endTouch();\n            }\n        };\n        const handleEnd = () => {\n            endTouch();\n        };\n        btn.addEventListener(\"touchstart\", handleStart);\n        const endTouch = () => {\n            this.syncAction(action, false);\n            btn.removeEventListener(\"touchend\", handleEnd);\n            btn.removeEventListener(\"touchmove\", handleMove);\n            btn.removeEventListener(\"touchcancel\", handleEnd);\n            this.trackedTouchIds = this.trackedTouchIds.filter((trackedId) => trackedId !== id);\n            btn.classList.remove(\"active\");\n        };\n        this.unregisterFunctions.push(() => {\n            btn.removeEventListener(\"touchstart\", handleStart);\n            btn.removeEventListener(\"touchmove\", handleMove);\n            btn.removeEventListener(\"touchend\", handleEnd);\n            btn.removeEventListener(\"touchcancel\", handleEnd);\n            btn.classList.remove(\"active\");\n        });\n    }\n    createMobileControls() {\n        const fireBtn = (0, utils_1.elt)(\"button\", {\n            className: \"fire-btn btn-container__btn\",\n        }, \"fire\"), moveRightBtn = (0, utils_1.elt)(\"button\", {\n            className: \"move-right-btn btn-container__btn\",\n        }, \"right\"), moveLeftBtn = (0, utils_1.elt)(\"button\", {\n            className: \"move-left-btn btn-container__btn\",\n        }, \"left\"), pauseBtn = (0, utils_1.elt)(\"button\", {\n            className: \"pause-btn btn-container__btn\",\n            onclick: () => {\n                this.onPauseGame();\n            },\n        }, \"pause\");\n        this.pauseBtn = pauseBtn;\n        this.manageMobileButtonTouchEvents(moveLeftBtn, \"moveLeft\");\n        this.manageMobileButtonTouchEvents(moveRightBtn, \"moveRight\");\n        this.manageMobileButtonTouchEvents(fireBtn, \"fire\");\n        this.mobileButtons.appendChild(fireBtn);\n        this.mobileButtons.appendChild(moveLeftBtn);\n        this.mobileButtons.appendChild(moveRightBtn);\n        this.mobileButtons.appendChild(pauseBtn);\n    }\n    cleanUp() {\n        super.cleanUp();\n        this.pauseBtn = null;\n        this.trackedTouchIds = [];\n    }\n    syncState(state, timeStep) {\n        this.clearScreen();\n        if (state.lastScore.id !== this.lastScore.id) {\n            this.timeSinceLastScoreChange = 0;\n            this.lastScore.id = state.lastScore.id;\n            this.lastScore.value = state.lastScore.value;\n        }\n        this.timeSinceLastScoreChange += timeStep;\n        this.drawFloor();\n        this.drawPlayer(state.player);\n        this.drawAlienSet(state.alienSet);\n        this.drawBullets(state.bullets);\n        this.drawCollisions(state.bulletCollisions);\n        this.drawWalls(state.env.walls);\n        this.drawMetadata(state, timeStep);\n        this.drawPressEscMessage();\n        if (state.boss !== null)\n            this.drawBoss(state.boss);\n        if (state.status === \"paused\")\n            this.drawPauseHint();\n        this.pauseBtn.textContent =\n            state.status === \"paused\" ? \"unpause\" : \"pause\";\n    }\n    drawFloor() {\n        const floorWidth = 100 - game_config_1.LAYOUT.padding.hor * 2, w = this.horPixels(floorWidth), h = this.verPixels(game_config_1.DIMENSIONS.floorHeight);\n        const x = this.horPixels(game_config_1.LAYOUT.padding.hor), y = this.verPixels(100 - game_config_1.DIMENSIONS.floorHeight - 1.5);\n        this.ctx.fillStyle = \"#fff\";\n        this.ctx.fillRect(x, y, w, h);\n    }\n    drawAlienSet(alienSet) {\n        for (const { alien, row, column } of alienSet) {\n            if (alien === null)\n                continue;\n            const xPercentage = alienSet.pos.x +\n                column * (game_config_1.DIMENSIONS.alienSetGap.w + game_config_1.DIMENSIONS.alien.w);\n            const yPercentage = alienSet.pos.y + row * (game_config_1.DIMENSIONS.alienSetGap.h + game_config_1.DIMENSIONS.alien.h);\n            const alienPos = {\n                x: xPercentage,\n                y: yPercentage,\n            };\n            if (alien !== \"exploding\") {\n                this.drawAlien(alien, alienPos, alienSet.aliensStage);\n            }\n            else {\n                this.drawExplosion(alienPos, game_config_1.DIMENSIONS.alien);\n            }\n        }\n    }\n    drawAlien(alien, pos, stage) {\n        const { w, h } = this.getPixelSize(game_config_1.DIMENSIONS.alien);\n        const { x, y } = this.getPixelPos(pos);\n        const { ctx } = this;\n        const tileX = aliensTileX[alien.alienType][stage];\n        ctx.save();\n        ctx.translate(x, y);\n        ctx.drawImage(images_1.aliensSprite, tileX, 0, alienImageSize.w, alienImageSize.h, 0, 0, w, h);\n        ctx.restore();\n    }\n    drawExplosion(pos, size, color = \"#fff\") {\n        const { w, h } = this.getPixelSize(size);\n        const { x, y } = this.getPixelPos(pos);\n        const pieceHeight = h / explosion.numOfRows, pieceWidth = w / explosion.numOfColumns;\n        this.ctx.save();\n        this.ctx.translate(x, y);\n        this.drawPieces(explosion, { w: pieceWidth, h: pieceHeight }, color);\n        this.ctx.restore();\n    }\n    drawBullets(bullets) {\n        for (const bullet of bullets) {\n            this.drawBullet(bullet);\n        }\n    }\n    drawBullet(bullet) {\n        const { x, y } = this.getPixelPos(bullet.pos);\n        const { w, h } = this.getPixelSize(bullet.size);\n        const { ctx } = this;\n        if (bullet.wiggly) {\n            const stage = Math.round(performance.now() / 200) % 2 === 1 ? 1 : 0;\n            ctx.save();\n            ctx.translate(x, y);\n            if (stage === 1)\n                (0, utils_1.flipHorizontally)(ctx, w / 2);\n            ctx.drawImage(images_1.wigglyBulletImage, 0, 0, w, h);\n            ctx.restore();\n        }\n        else {\n            ctx.fillStyle = \"#fff\";\n            ctx.fillRect(x, y, w, h);\n        }\n    }\n    drawPlayer(player) {\n        if (player.status === \"exploding\") {\n            this.drawExplosion(player.pos, game_config_1.DIMENSIONS.player);\n            return;\n        }\n        else {\n            const progress = player.status === \"reviving\"\n                ? Math.min(player.timeSinceResurrection / playerConfig.revivingTime, 1)\n                : 1;\n            const { x, y } = this.getPixelPos(player.pos);\n            const { w, h } = this.getPixelSize(game_config_1.DIMENSIONS.player);\n            if (player.status === \"reviving\") {\n                const progressBarWidth = w * 1.2, widthDifference = progressBarWidth - w;\n                (0, utils_1.drawProgressBar)(this.ctx, progress, { x: x - widthDifference / 2, y: y + 1.1 * h }, { w: progressBarWidth, h: this.verPixels(1) });\n            }\n            this.ctx.save();\n            this.ctx.translate(x, y);\n            this.ctx.globalAlpha = progress;\n            this.ctx.drawImage(images_1.playerSpaceship, 0, 0, w, h);\n            this.ctx.restore();\n        }\n    }\n    drawBoss(boss) {\n        if (boss.status === \"exploding\") {\n            this.drawExplosion(boss.pos, game_config_1.DIMENSIONS.boss, config_1.colors.boss);\n        }\n        else {\n            const { x, y } = this.getPixelPos(boss.pos);\n            const { w, h } = this.getPixelSize(game_config_1.DIMENSIONS.boss);\n            const { ctx } = this;\n            ctx.save();\n            ctx.translate(x, y);\n            ctx.drawImage(images_1.bossImage, 0, 0, w, h);\n            ctx.restore();\n        }\n    }\n    drawWalls(walls) {\n        for (const wall of walls) {\n            this.drawWall(wall);\n        }\n    }\n    drawWall(wall) {\n        const { x, y } = this.getPixelPos(wall.pos);\n        this.ctx.save();\n        this.ctx.translate(x, y);\n        const { w, h } = wall.pieceSize;\n        const piecePixelWidth = this.horPixels(w), piecePixelHeight = this.verPixels(h);\n        for (const { row, column, piece } of wall.pieces) {\n            if (piece) {\n                const xPixels = this.horPixels(column * w), yPixels = this.verPixels(row * h);\n                this.ctx.fillStyle = \"#fff\";\n                this.ctx.fillRect(xPixels, yPixels, piecePixelWidth, piecePixelHeight);\n            }\n        }\n        this.ctx.restore();\n    }\n    drawMetadata(state, timeStep) {\n        const yPixelsPadding = this.verPixels(game_config_1.LAYOUT.padding.ver);\n        this.setFontSize(\"md\");\n        this.ctx.textBaseline = \"top\";\n        this.drawScore(state.player.score, this.horPixels(game_config_1.LAYOUT.padding.hor), yPixelsPadding);\n        this.drawFPS(timeStep, this.horPixels(50), yPixelsPadding);\n        this.drawPlayerLives(state.player.lives, this.horPixels(100 - game_config_1.LAYOUT.padding.hor), yPixelsPadding);\n    }\n    drawScore(score, x, y) {\n        this.ctx.fillStyle = \"#fff\";\n        this.ctx.textAlign = \"start\";\n        const scoreText = `SCORE ${score.toString().padStart(5, \"0\")}`;\n        this.ctx.fillText(scoreText, x, y);\n        const scoreTextMetrics = this.ctx.measureText(scoreText);\n        if (this.lastScore.value &&\n            this.timeSinceLastScoreChange < lastScoreAppearanceDuration) {\n            const progress = this.timeSinceLastScoreChange / lastScoreAppearanceDuration;\n            this.drawLastScoreAnimation(this.lastScore.value, this.horPixels(game_config_1.LAYOUT.padding.hor) +\n                scoreTextMetrics.width +\n                this.horPixels(2), y, progress);\n        }\n    }\n    drawLastScoreAnimation(score, x, baseY, progress) {\n        const stage = progress < 0.2 ? 1 : progress < 0.8 ? 2 : 3;\n        let y = baseY;\n        let opacity = 1;\n        const translation = stage !== 2 ? this.verPixels(3) : 0;\n        switch (stage) {\n            case 1: {\n                const stageOneProgress = progress / 0.2;\n                opacity = stageOneProgress;\n                y += translation * (1 - stageOneProgress);\n                break;\n            }\n            case 2: {\n                break;\n            }\n            case 3: {\n                const stageThreeProgress = (progress - 0.8) / 0.2;\n                opacity = 1 - stageThreeProgress;\n                y -= translation * stageThreeProgress;\n                break;\n            }\n        }\n        this.ctx.fillStyle = `rgba(255 255 255 / ${opacity})`;\n        this.ctx.fillText(`+${score}`, x, y);\n    }\n    drawFPS(timeStep, x, y) {\n        const fps = Math.round(1 / timeStep);\n        this.ctx.fillStyle = \"#fff\";\n        this.ctx.textAlign = \"center\";\n        this.ctx.fillText(`${fps} FPS`, x, y);\n    }\n    drawPlayerLives(lives, x, y) {\n        this.ctx.fillStyle = \"#fff\";\n        this.ctx.textAlign = \"end\";\n        this.ctx.fillText(`LIVES ${lives}`, x, y);\n    }\n    drawPauseHint() {\n        const hintWidth = this.horPixels(24), hintHeight = this.verPixels(10);\n        const hintXPos = this.horPixels(50) - hintWidth / 2, hintYPos = this.verPixels(50) - hintHeight / 2;\n        this.ctx.fillStyle = \"#fff\";\n        this.ctx.fillRect(hintXPos, hintYPos - this.verPixels(0.1), hintWidth, hintHeight);\n        this.ctx.fillStyle = \"#000\";\n        this.setFontSize(\"lg\");\n        this.ctx.textAlign = \"center\";\n        this.ctx.textBaseline = \"middle\";\n        this.ctx.fillText(\"PAUSED\", this.horPixels(50), this.verPixels(50));\n    }\n    drawPressEscMessage() {\n        const xPixelPos = this.horPixels(game_config_1.LAYOUT.padding.hor), yPixelPos = this.verPixels(8);\n        this.setFontSize(\"sm\");\n        this.ctx.fillStyle = \"#fff\";\n        this.ctx.textAlign = \"left\";\n        this.ctx.textBaseline = \"top\";\n        this.ctx.fillText('Press \"Esc\" to pause/unpause', xPixelPos, yPixelPos);\n    }\n    drawCollisions(collisions) {\n        for (const c of collisions) {\n            this.drawExplosion({ y: c.pos.y - c.size.h / 2, x: c.pos.x - c.size.w / 2 }, c.size);\n        }\n    }\n}\nexports[\"default\"] = RunningGameScreen;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/screens/RunningGameScreen.ts?");

/***/ }),

/***/ "./src/components/View/utils.ts":
/*!**************************************!*\
  !*** ./src/components/View/utils.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.flipHorizontally = exports.findUntrackedTouch = exports.findTouch = exports.elt = exports.drawProgressBar = exports.drawTwinkleMessage = exports.trackKeys = exports.getElementInnerDimensions = void 0;\nfunction getElementInnerDimensions(element) {\n    const cs = getComputedStyle(element);\n    const paddingY = parseFloat(cs.paddingBlockStart) + parseFloat(cs.paddingBlockEnd);\n    const paddingX = parseFloat(cs.paddingInlineStart) + parseFloat(cs.paddingInlineEnd);\n    const marginY = parseFloat(cs.marginBlockStart) + parseFloat(cs.marginBlockEnd);\n    const marginX = parseFloat(cs.marginInlineStart) + parseFloat(cs.marginInlineEnd);\n    return {\n        w: element.offsetWidth - paddingX - marginX,\n        h: element.offsetHeight - paddingY - marginY,\n    };\n}\nexports.getElementInnerDimensions = getElementInnerDimensions;\nfunction trackKeys(keys, onKeyChange) {\n    const down = {};\n    keys.forEach((key) => (down[key] = false));\n    function onPressKey(e) {\n        for (const key of keys) {\n            if (e.key === key) {\n                e.preventDefault();\n                const pressed = e.type === \"keydown\";\n                down[e.key] = pressed;\n                if (onKeyChange)\n                    onKeyChange(key, pressed);\n            }\n        }\n    }\n    window.addEventListener(\"keydown\", onPressKey);\n    window.addEventListener(\"keyup\", onPressKey);\n    down.unregister = () => {\n        window.removeEventListener(\"keydown\", onPressKey);\n        window.removeEventListener(\"keyup\", onPressKey);\n    };\n    return down;\n}\nexports.trackKeys = trackKeys;\nfunction drawTwinkleMessage(ctx, message, pos, options) {\n    const { fontSize = 16, fontFamily = \"monospace\", align = \"center\", baseline = \"middle\", color = \"#fff\", } = options || {};\n    if (Math.round(performance.now() / 800) % 2 === 0) {\n        ctx.font = `${fontSize}px ${fontFamily}`;\n        ctx.textAlign = align;\n        ctx.textBaseline = baseline;\n        ctx.fillStyle = color;\n        const { x, y } = pos;\n        ctx.fillText(message, x, y);\n    }\n}\nexports.drawTwinkleMessage = drawTwinkleMessage;\nfunction drawProgressBar(ctx, progress, pos, size, options) {\n    const { positiveColor = \"limegreen\", negativeColor = \"gray\" } = options || {};\n    const positiveWidth = progress * size.w, negativeWidth = (1 - progress) * size.w;\n    ctx.fillStyle = positiveColor;\n    ctx.fillRect(pos.x, pos.y, positiveWidth, size.h);\n    ctx.fillStyle = negativeColor;\n    ctx.fillRect(pos.x + positiveWidth, pos.y, negativeWidth, size.h);\n}\nexports.drawProgressBar = drawProgressBar;\nfunction elt(type, attrs, ...children) {\n    const element = document.createElement(type);\n    if (attrs)\n        Object.assign(element, attrs);\n    for (const child of children) {\n        if (typeof child === \"string\") {\n            element.textContent = child;\n        }\n        else {\n            element.appendChild(child);\n        }\n    }\n    return element;\n}\nexports.elt = elt;\nfunction findTouch(touches, id) {\n    for (let i = 0; i < touches.length; i++) {\n        if (touches[i].identifier === id)\n            return touches[i];\n    }\n    return null;\n}\nexports.findTouch = findTouch;\nfunction findUntrackedTouch(touches, ids) {\n    for (let i = 0; i < touches.length; i++) {\n        if (!ids.some((id) => id === touches[i].identifier))\n            return touches[i];\n    }\n    return null;\n}\nexports.findUntrackedTouch = findUntrackedTouch;\nfunction flipHorizontally(context, around) {\n    context.translate(around, 0);\n    context.scale(-1, 1);\n    context.translate(-around, 0);\n}\nexports.flipHorizontally = flipHorizontally;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/utils.ts?");

/***/ }),

/***/ "./src/components/Wall/index.ts":
/*!**************************************!*\
  !*** ./src/components/Wall/index.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst overlap_1 = __importDefault(__webpack_require__(/*! @/utils/common/overlap */ \"./src/utils/common/overlap.ts\"));\nconst IterablePieces_1 = __importDefault(__webpack_require__(/*! @/components/IterablePieces */ \"./src/components/IterablePieces/index.ts\"));\nclass Wall {\n    constructor(pos, size, plan) {\n        this.pos = pos;\n        this.size = size;\n        const ip = new IterablePieces_1.default(plan);\n        this.pieceSize = {\n            w: size.w / ip.pieces[0].length,\n            h: size.h / ip.pieces.length,\n        };\n        this.pieces = ip;\n    }\n    getPiecePos(column, row) {\n        return {\n            x: this.pos.x + column * this.pieceSize.w,\n            y: this.pos.y + row * this.pieceSize.h,\n        };\n    }\n    collide(objPos, objSize) {\n        if (!(0, overlap_1.default)(this.pos, this.size, objPos, objSize))\n            return false;\n        let touchedPiece = false;\n        for (const { row, column, piece } of this.pieces) {\n            if (!piece)\n                continue;\n            const piecePos = this.getPiecePos(column, row);\n            if ((0, overlap_1.default)(objPos, objSize, piecePos, this.pieceSize)) {\n                this.pieces.breakPiece(column, row);\n                if (!touchedPiece)\n                    touchedPiece = true;\n            }\n        }\n        return touchedPiece;\n    }\n}\nexports[\"default\"] = Wall;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Wall/index.ts?");

/***/ }),

/***/ "./src/game-config.ts":
/*!****************************!*\
  !*** ./src/game-config.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.RUNNING_GAME_KEY_ACTIONS = exports.DIMENSIONS = exports.LAYOUT = exports.ACTION_KEYS = void 0;\nconst LAYOUT = {\n    padding: {\n        hor: 3,\n        ver: 3,\n    },\n    numWalls: 4,\n    wallsSize: {\n        w: 10,\n        h: 8.3,\n    },\n    wallYPos: 70,\n    playerYPos: 86,\n    floorYPos: 97,\n    bossYPos: 8,\n};\nexports.LAYOUT = LAYOUT;\nconst DIMENSIONS = {\n    alien: {\n        w: 3.5,\n        h: 4.5,\n    },\n    player: {\n        w: 4,\n        h: 6,\n    },\n    alienSetGap: {\n        w: 1.2,\n        h: 2,\n    },\n    boss: {\n        w: 8,\n        h: 5.5,\n    },\n    floorHeight: 1,\n    bulletCollision: { w: 2, h: 1.5 },\n};\nexports.DIMENSIONS = DIMENSIONS;\nconst ACTION_KEYS = {\n    moveRight: \"ArrowRight\",\n    moveLeft: \"ArrowLeft\",\n    fire: \" \",\n    startGame: \" \",\n    restartGame: \" \",\n    pauseGame: \"Escape\",\n};\nexports.ACTION_KEYS = ACTION_KEYS;\nconst RUNNING_GAME_KEY_ACTIONS = {\n    ArrowRight: \"moveRight\",\n    ArrowLeft: \"moveLeft\",\n    [\" \"]: \"fire\",\n};\nexports.RUNNING_GAME_KEY_ACTIONS = RUNNING_GAME_KEY_ACTIONS;\n\n\n//# sourceURL=webpack://space-invaders/./src/game-config.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Presenter_1 = __importDefault(__webpack_require__(/*! @/components/Presenter */ \"./src/components/Presenter/index.ts\"));\nconst View_1 = __importDefault(__webpack_require__(/*! @/components/View */ \"./src/components/View/index.ts\"));\nconst State_1 = __importDefault(__webpack_require__(/*! @/components/State */ \"./src/components/State/index.ts\"));\nnew Presenter_1.default(State_1.default, View_1.default, document.body);\n\n\n//# sourceURL=webpack://space-invaders/./src/index.ts?");

/***/ }),

/***/ "./src/plans/alien-set.ts":
/*!********************************!*\
  !*** ./src/plans/alien-set.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst defaultAliensPlan = `\r\nZZZZZZZZZZZ\r\nYYYYYYYYYYY\r\nYYYYYYYYYYY\r\nXXXXXXXXXXX\r\nXXXXXXXXXXX\r\n`;\nexports[\"default\"] = defaultAliensPlan;\n\n\n//# sourceURL=webpack://space-invaders/./src/plans/alien-set.ts?");

/***/ }),

/***/ "./src/plans/explosions.ts":
/*!*********************************!*\
  !*** ./src/plans/explosions.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst normalExplosion = `\r\n....#.......\r\n....##...###\r\n.....#..##..\r\n.....##.#...\r\n.###........\r\n##......###.\r\n....#.##..##\r\n...##..##...\r\n...#....##..\r\n...#.....#..\r\n`;\nexports[\"default\"] = normalExplosion;\n\n\n//# sourceURL=webpack://space-invaders/./src/plans/explosions.ts?");

/***/ }),

/***/ "./src/plans/walls.ts":
/*!****************************!*\
  !*** ./src/plans/walls.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.fancyWall = exports.fancyShieldLikeWall = void 0;\nexports.fancyShieldLikeWall = `\r\n........######################################........\r\n.....############################################.....\r\n...################################################...\r\n..##################################################..\r\n.###################################################..\r\n.############.......##############.......############.\r\n.##########...........##########...........##########.\r\n##########..............######..............##########\r\n#########......##........####.........##.....#########\r\n########......##..........##...........##....#########\r\n########......##.........####..........##.....########\r\n########......###......#########......###.....########\r\n########.......#####..####..######..####......########\r\n########........########......########........########\r\n########.........#####..........#####.........########\r\n#########....................................#########\r\n.#########..................................#########.\r\n..##########..............................##########..\r\n`;\nexports.fancyWall = `\r\n...#...............................................#...\r\n..###.............................................###..\r\n..####...........................................####..\r\n.######....................#....................######.\r\n.#######..................###..................#######.\r\n#########................#####................#########\r\n##########..............#######..............##########\r\n############.........#############.........############\r\n##############..#..#################..#..##############\r\n#######################################################\r\n.#####################################################.\r\n...#################################################...\r\n......###########################################......\r\n........###########..................##########........\r\n..........#######......................#######.........\r\n`;\nconst shieldLikeWall = `\r\n............######################################............\r\n.........############################################.........\r\n.......################################################.......\r\n......##################################################......\r\n....####################################################......\r\n....######################################################....\r\n....######################################################....\r\n....######################################################....\r\n....######################################################....\r\n....######################################################....\r\n....######################################################....\r\n....######################################################....\r\n....#############............................#############....\r\n....############..............................############....\r\n....###########................................###########....\r\n...###########..................................###########...\r\n...###########..................................###########...\r\n..#############................................#############..\r\n.###############..............................###############.\r\n##################..........................##################\r\n`;\nexports[\"default\"] = shieldLikeWall;\n\n\n//# sourceURL=webpack://space-invaders/./src/plans/walls.ts?");

/***/ }),

/***/ "./src/plans/wiggly-bullet.ts":
/*!************************************!*\
  !*** ./src/plans/wiggly-bullet.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst wigglyBullet = [`\r\n##....\r\n.##...\r\n..##..\r\n...##.\r\n....##\r\n....##\r\n...##.\r\n..##..\r\n.##...\r\n##....\r\n##....\r\n.##...\r\n..##..\r\n...##.\r\n....##\r\n.....#\r\n`, `\r\n....##\r\n...##.\r\n..##..\r\n.##...\r\n##....\r\n##....\r\n.##...\r\n..##..\r\n...##.\r\n....##\r\n....##\r\n...##.\r\n..##..\r\n.##...\r\n##....\r\n#.....\r\n`\n];\nexports[\"default\"] = wigglyBullet;\n\n\n//# sourceURL=webpack://space-invaders/./src/plans/wiggly-bullet.ts?");

/***/ }),

/***/ "./src/ts/enums.ts":
/*!*************************!*\
  !*** ./src/ts/enums.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.HorizontalDirection = void 0;\nvar HorizontalDirection;\n(function (HorizontalDirection) {\n    HorizontalDirection[HorizontalDirection[\"Right\"] = 1] = \"Right\";\n    HorizontalDirection[HorizontalDirection[\"Left\"] = -1] = \"Left\";\n})(HorizontalDirection || (exports.HorizontalDirection = HorizontalDirection = {}));\n\n\n//# sourceURL=webpack://space-invaders/./src/ts/enums.ts?");

/***/ }),

/***/ "./src/utils/common/Vector.ts":
/*!************************************!*\
  !*** ./src/utils/common/Vector.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass Vector {\n    constructor(x, y) {\n        this.x = x;\n        this.y = y;\n    }\n    plus(other) {\n        return new Vector(this.x + other.x, this.y + other.y);\n    }\n    minus(other) {\n        return new Vector(this.x - other.x, this.y - other.y);\n    }\n    times(factor) {\n        return new Vector(this.x * factor, this.y * factor);\n    }\n}\nexports[\"default\"] = Vector;\n\n\n//# sourceURL=webpack://space-invaders/./src/utils/common/Vector.ts?");

/***/ }),

/***/ "./src/utils/common/numbers.ts":
/*!*************************************!*\
  !*** ./src/utils/common/numbers.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.randomNumberInFactorRange = exports.randomNumInSteps = exports.randomNum = exports.randomInt = void 0;\nfunction randomInt(min, max) {\n    return Math.round(randomNum(min, max));\n}\nexports.randomInt = randomInt;\nfunction randomNum(min, max) {\n    if (min > max) {\n        const savedMax = max;\n        max = min;\n        min = savedMax;\n    }\n    return min + Math.random() * (max - min);\n}\nexports.randomNum = randomNum;\nfunction randomNumInSteps(min, max, step = 1) {\n    if (min > max) {\n        const savedMax = max;\n        max = min;\n        min = savedMax;\n    }\n    const difference = max - min;\n    const numSteps = Math.floor(difference / step);\n    const randomStep = randomInt(0, numSteps);\n    return min + randomStep * step;\n}\nexports.randomNumInSteps = randomNumInSteps;\nfunction randomNumberInFactorRange(n, subtractingFactor, addingFactor = subtractingFactor) {\n    return randomNum((1 - subtractingFactor) * n, (1 + addingFactor) * n);\n}\nexports.randomNumberInFactorRange = randomNumberInFactorRange;\n\n\n//# sourceURL=webpack://space-invaders/./src/utils/common/numbers.ts?");

/***/ }),

/***/ "./src/utils/common/overlap.ts":
/*!*************************************!*\
  !*** ./src/utils/common/overlap.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nfunction overlap(pos1, size1, pos2, size2) {\n    return (pos1.x + size1.w > pos2.x &&\n        pos1.x < pos2.x + size2.w &&\n        pos1.y + size1.h > pos2.y &&\n        pos1.y < pos2.y + size2.h);\n}\nexports[\"default\"] = overlap;\n\n\n//# sourceURL=webpack://space-invaders/./src/utils/common/overlap.ts?");

/***/ }),

/***/ "./src/utils/common/readSolidPlan.ts":
/*!*******************************************!*\
  !*** ./src/utils/common/readSolidPlan.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nfunction readSolidPlan(plan, solidCharacter = \"#\") {\n    const pieces = plan\n        .trim()\n        .split(\"\\n\")\n        .map((row) => [...row].map((ch) => ch === solidCharacter));\n    return pieces;\n}\nexports[\"default\"] = readSolidPlan;\n\n\n//# sourceURL=webpack://space-invaders/./src/utils/common/readSolidPlan.ts?");

/***/ }),

/***/ "./src/audios/explosion.mp3":
/*!**********************************!*\
  !*** ./src/audios/explosion.mp3 ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"ceac09b1b3aa6c85662b.mp3\";\n\n//# sourceURL=webpack://space-invaders/./src/audios/explosion.mp3?");

/***/ }),

/***/ "./src/audios/fastinvader1.mp3":
/*!*************************************!*\
  !*** ./src/audios/fastinvader1.mp3 ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"02e070370e4a27a64ae8.mp3\";\n\n//# sourceURL=webpack://space-invaders/./src/audios/fastinvader1.mp3?");

/***/ }),

/***/ "./src/audios/fastinvader2.mp3":
/*!*************************************!*\
  !*** ./src/audios/fastinvader2.mp3 ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"0c80a6637cceb2d5356e.mp3\";\n\n//# sourceURL=webpack://space-invaders/./src/audios/fastinvader2.mp3?");

/***/ }),

/***/ "./src/audios/fastinvader3.mp3":
/*!*************************************!*\
  !*** ./src/audios/fastinvader3.mp3 ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"5a6c4895e87bf42c0c2f.mp3\";\n\n//# sourceURL=webpack://space-invaders/./src/audios/fastinvader3.mp3?");

/***/ }),

/***/ "./src/audios/fastinvader4.mp3":
/*!*************************************!*\
  !*** ./src/audios/fastinvader4.mp3 ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"48768c54b5dfba947f20.mp3\";\n\n//# sourceURL=webpack://space-invaders/./src/audios/fastinvader4.mp3?");

/***/ }),

/***/ "./src/audios/invaderkilled.mp3":
/*!**************************************!*\
  !*** ./src/audios/invaderkilled.mp3 ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"fca20ddfa9fa20ba0556.mp3\";\n\n//# sourceURL=webpack://space-invaders/./src/audios/invaderkilled.mp3?");

/***/ }),

/***/ "./src/audios/shoot.mp3":
/*!******************************!*\
  !*** ./src/audios/shoot.mp3 ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"aab5218dece3ea59a0d0.mp3\";\n\n//# sourceURL=webpack://space-invaders/./src/audios/shoot.mp3?");

/***/ }),

/***/ "./src/audios/ufo_highpitch.mp3":
/*!**************************************!*\
  !*** ./src/audios/ufo_highpitch.mp3 ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"de09425c7429b939bc24.mp3\";\n\n//# sourceURL=webpack://space-invaders/./src/audios/ufo_highpitch.mp3?");

/***/ }),

/***/ "./src/audios/ufo_lowpitch.mp3":
/*!*************************************!*\
  !*** ./src/audios/ufo_lowpitch.mp3 ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"4ec9957d4df5fa2e8531.mp3\";\n\n//# sourceURL=webpack://space-invaders/./src/audios/ufo_lowpitch.mp3?");

/***/ }),

/***/ "./src/components/View/images/aliens-sprite.png":
/*!******************************************************!*\
  !*** ./src/components/View/images/aliens-sprite.png ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"d5e50f638b096e9190e7.png\";\n\n//# sourceURL=webpack://space-invaders/./src/components/View/images/aliens-sprite.png?");

/***/ }),

/***/ "./src/components/View/images/arrow-keys.png":
/*!***************************************************!*\
  !*** ./src/components/View/images/arrow-keys.png ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"bd188dea76900fce15fe.png\";\n\n//# sourceURL=webpack://space-invaders/./src/components/View/images/arrow-keys.png?");

/***/ }),

/***/ "./src/components/View/images/boss.png":
/*!*********************************************!*\
  !*** ./src/components/View/images/boss.png ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"da9ede23a82090924c57.png\";\n\n//# sourceURL=webpack://space-invaders/./src/components/View/images/boss.png?");

/***/ }),

/***/ "./src/components/View/images/space-key.png":
/*!**************************************************!*\
  !*** ./src/components/View/images/space-key.png ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"f509ef93b23ccdf2d4dd.png\";\n\n//# sourceURL=webpack://space-invaders/./src/components/View/images/space-key.png?");

/***/ }),

/***/ "./src/components/View/images/spaceship.png":
/*!**************************************************!*\
  !*** ./src/components/View/images/spaceship.png ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"7d18eacc177861913a0c.png\";\n\n//# sourceURL=webpack://space-invaders/./src/components/View/images/spaceship.png?");

/***/ }),

/***/ "./src/components/View/images/wiggly-bullet.png":
/*!******************************************************!*\
  !*** ./src/components/View/images/wiggly-bullet.png ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("module.exports = __webpack_require__.p + \"75063fe4732528c784c6.png\";\n\n//# sourceURL=webpack://space-invaders/./src/components/View/images/wiggly-bullet.png?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;