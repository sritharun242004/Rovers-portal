/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./sg/static/site/javascript/utils/animate_element.js":
/*!************************************************************!*\
  !*** ./sg/static/site/javascript/utils/animate_element.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ animateElement)
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);


// Remove class using regex
// http://stackoverflow.com/a/18621161
(jquery__WEBPACK_IMPORTED_MODULE_0___default().fn).removeClassRegex = function (regex) {
  return jquery__WEBPACK_IMPORTED_MODULE_0___default()(this).removeClass(function (index, classes) {
    return classes.split(/\s+/).filter(function (c) {
      return regex.test(c);
    }).join(' ');
  });
};
function animateElement($elem, className, delay, duration) {
  var name = 'anim--' + className,
    setup = 32,
    // 2 Frames to setup
    start = setup + delay;
  $elem.removeClassRegex(/^anim--/);

  // Setup transition properties
  window.setTimeout(function setTransitionProps() {
    $elem.addClass(name + '-transition');
  }, setup / 2);

  // Start the animation
  window.setTimeout(function startAnimation() {
    $elem.addClass(name);
  }, start);

  // Animation completed
  window.setTimeout(function endAnimation() {
    // Animation Complete

    // Remove transition property
    $elem.removeClass(name + '-transition');
  }, duration + start);
}

/***/ }),

/***/ "./sg/static/site/javascript/utils/dirtyforms.js":
/*!*******************************************************!*\
  !*** ./sg/static/site/javascript/utils/dirtyforms.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   disableDirtyFormCheck: () => (/* binding */ disableDirtyFormCheck),
/* harmony export */   enableDirtyFormCheck: () => (/* binding */ enableDirtyFormCheck)
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var gettext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! gettext */ "gettext");
/* harmony import */ var gettext__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(gettext__WEBPACK_IMPORTED_MODULE_1__);
/*
 * Enables a "dirty form check", prompting the user if they are navigating away
 * from a page with unsaved changes.
 *
 * It takes the following parameters:
 *
 *  - formSelector - A HTMLFormElement to apply this check to.
 *
 *  - options - An object for passing in options. Possible options are:
 *    - alwaysDirty - When set to true the form will always be considered dirty,
 *      prompting the user even when nothing has been changed.
 */



var dirtyFormCheckIsActive = true;
function enableDirtyFormCheck(form, _ref) {
  var _ref$alwaysDirty = _ref.alwaysDirty,
    alwaysDirty = _ref$alwaysDirty === void 0 ? false : _ref$alwaysDirty;
  setTimeout(function () {
    var initialData = jquery__WEBPACK_IMPORTED_MODULE_0___default()(form).serialize();
    var formSubmitted = false;
    form.addEventListener('submit', function () {
      formSubmitted = true;
    });
    window.addEventListener('beforeunload', function (event) {
      var displayConfirmation = dirtyFormCheckIsActive && !formSubmitted && (alwaysDirty || jquery__WEBPACK_IMPORTED_MODULE_0___default()(form).serialize() != initialData);
      if (displayConfirmation) {
        var confirmationMessage = gettext__WEBPACK_IMPORTED_MODULE_1___default()('This page has unsaved changes.');
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    });
  }, 1000);
}
function disableDirtyFormCheck() {
  dirtyFormCheckIsActive = false;
}

/***/ }),

/***/ "./sg/static/site/javascript/utils/dropdown_toggle.js":
/*!************************************************************!*\
  !*** ./sg/static/site/javascript/utils/dropdown_toggle.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ dropdownToggle)
/* harmony export */ });
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _animate_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./animate_element */ "./sg/static/site/javascript/utils/animate_element.js");


var activeClass = 'active';
var inactiveClass = 'inactive';
function dropdownToggle(element) {
  var $item = jquery__WEBPACK_IMPORTED_MODULE_0___default()(element),
    $parent = $item.parent();
  if ($parent.hasClass('anim--active')) {
    (0,_animate_element__WEBPACK_IMPORTED_MODULE_1__["default"])($parent, inactiveClass, 0, 500);
  } else {
    (0,_animate_element__WEBPACK_IMPORTED_MODULE_1__["default"])($parent, activeClass, 0, 500);
  }
}

/***/ }),

/***/ "gettext":
/*!**************************!*\
  !*** external "gettext" ***!
  \**************************/
/***/ ((module) => {

module.exports = gettext;

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ ((module) => {

module.exports = jQuery;

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
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"shared": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**************************************************!*\
  !*** ./sg/static/site/javascript/shared_main.js ***!
  \**************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery */ "jquery");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_dropdown_toggle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/dropdown_toggle */ "./sg/static/site/javascript/utils/dropdown_toggle.js");
/* harmony import */ var _utils_dirtyforms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/dirtyforms */ "./sg/static/site/javascript/utils/dirtyforms.js");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }



function initialiseComponents(rootElement) {
  var _iterator = _createForOfIteratorHelper(rootElement.querySelectorAll('.js-enable-dirty-form-check')),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var element = _step.value;
      var alwaysDirty = element.classList.contains('js-form-is-dirty');
      (0,_utils_dirtyforms__WEBPACK_IMPORTED_MODULE_2__.enableDirtyFormCheck)(element, {
        alwaysDirty: alwaysDirty
      });
    }

    // cancel dirty form check when clicking a button within a form
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var _iterator2 = _createForOfIteratorHelper(rootElement.querySelectorAll('.js-cancel-dirty-form-check')),
    _step2;
  try {
    var _loop = function _loop() {
      var element = _step2.value;
      element.addEventListener('click', function (e) {
        e.preventDefault();
        var target = element.href;
        (0,_utils_dirtyforms__WEBPACK_IMPORTED_MODULE_2__.disableDirtyFormCheck)();
        window.location.href = target;
      });
    };
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
}
document.addEventListener('DOMContentLoaded', function () {
  initialiseComponents(document);
});
jquery__WEBPACK_IMPORTED_MODULE_0___default()(function () {
  // Insert jQuery code here
  // Dismiss messages
  function dismissMessage($button) {
    var $message = $button.closest('.js-message');
    $message.slideUp();
  }
  if (jquery__WEBPACK_IMPORTED_MODULE_0___default()('.js-message-dismiss').length) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('body').on('click', '.js-message-dismiss', function (e) {
      e.preventDefault();
      var $button = jquery__WEBPACK_IMPORTED_MODULE_0___default()(this);
      dismissMessage($button);
    });
  }
  if (jquery__WEBPACK_IMPORTED_MODULE_0___default()('.js-dropdown').length) {
    jquery__WEBPACK_IMPORTED_MODULE_0___default()('body').on('click', '.js-dropdown', function (e) {
      return (0,_utils_dropdown_toggle__WEBPACK_IMPORTED_MODULE_1__["default"])(e.currentTarget);
    });
  }

  // Remove required attributes from form fields for specified forms as we want to use the
  // serverside validation
  function removeRequired() {
    var $forms = jquery__WEBPACK_IMPORTED_MODULE_0___default()('.js-remove-required');
    $forms.find('input').removeAttr('required');
    $forms.find('select').removeAttr('required');
    $forms.find('textarea').removeAttr('required');
  }

  // Removes default browser form validation ('required' attributes) as we want to use the more
  // informative serverside validation.
  if (jquery__WEBPACK_IMPORTED_MODULE_0___default()('.js-remove-required').length) {
    removeRequired();
  }

  // #300 - Prevent duplicate form submissions
  jquery__WEBPACK_IMPORTED_MODULE_0___default()('form.js-prevent-double-submit').submit(function (e) {
    if (e.target.previouslySubmitted) {
      e.preventDefault();
    }
    e.target.previouslySubmitted = true;
  });
});
__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ })()
;
