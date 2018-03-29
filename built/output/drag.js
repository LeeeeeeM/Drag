/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var getSize_1 = __webpack_require__(4);
var Dragger_1 = __webpack_require__(1);
function extend(a, b) {
    for (var prop in b) {
        a[prop] = b[prop];
    }
    return a;
}
var positionValues = {
    relative: true,
    absolute: true,
    fixed: true
};
function applyGrid(value, grid, method) {
    if (method === void 0) {
        method = 'round';
    }
    return grid ? Math[method](value / grid) * grid : value;
}
var Drag = function (_super) {
    __extends(Drag, _super);
    function Drag(element, options) {
        var _this = _super.call(this) || this;
        _this.element = element;
        _this.options = options;
        _this.position = null;
        _this.dragPoint = null;
        _this.startPosition = null;
        _this.isEnabled = false;
        _this.relativeStartPosition = null;
        _this.containSize = null;
        _this.element = typeof element == 'string' ? document.querySelector(element) : element;
        _this.options = extend({}, Drag.defaults);
        _this.option(options);
        _this._create();
        return _this;
    }
    Drag.prototype.option = function (opts) {
        extend(this.options, opts);
    };
    Drag.prototype._create = function () {
        this.position = {};
        var style = getComputedStyle(this.element);
        if (!positionValues[style.position]) {
            this.element.style.position = 'relative';
        }
        this._getPosition();
        this.dragPoint = {
            x: 0,
            y: 0
        };
        this.startPosition = extend({}, this.position);
        this.enable();
        this.setHandles();
    };
    Drag.prototype.setHandles = function () {
        this.handleDoms = this.options.handle ? this.element.querySelectorAll(this.options.handle) : [this.element];
        this.bindHandles();
    };
    Drag.prototype._getPosition = function () {
        var style = getComputedStyle(this.element, null);
        var x = this._getPositionCoord(style.left, 'width');
        var y = this._getPositionCoord(style.top, 'height');
        this.position.x = isNaN(x) ? 0 : x;
        this.position.y = isNaN(y) ? 0 : y;
        this._addTransformPosition(style);
    };
    Drag.prototype._getPositionCoord = function (styleSide, measure) {
        if (styleSide.indexOf('%') != -1) {
            var parentSize = getSize_1.default(this.element.parentNode);
            return !parentSize ? 0 : parseFloat(styleSide) / 100 * parentSize[measure];
        }
        return parseInt(styleSide, 10);
    };
    Drag.prototype._addTransformPosition = function (style) {
        var transform = style.transform;
        if (transform.indexOf('matrix') !== 0) {
            return;
        }
        var matrixValues = transform.split(',');
        var xIndex = transform.indexOf('matrix3d') === 0 ? 12 : 4;
        var translateX = parseInt(matrixValues[xIndex], 10);
        var translateY = parseInt(matrixValues[xIndex + 1], 10);
        this.position.x += translateX;
        this.position.y += translateY;
    };
    ;
    Drag.prototype.dragStart = function (event, pointer) {
        if (!this.isEnabled) {
            return;
        }
        this._getPosition();
        this.measureContainment();
        this.startPosition.x = this.position.x;
        this.startPosition.y = this.position.y;
        this.setLeftTop();
        this.dragPoint.x = 0;
        this.dragPoint.y = 0;
        this.dispatchEvent('dragStart', event, pointer);
        this.animate();
    };
    Drag.prototype.getContainer = function () {
        var containment = this.options.containment;
        if (!containment) {
            return;
        }
        var isElement = containment instanceof HTMLElement;
        if (isElement) {
            return containment;
        }
        if (typeof containment == 'string') {
            return document.querySelector(containment);
        }
        return this.element.parentNode;
    };
    Drag.prototype.measureContainment = function () {
        var container = this.getContainer();
        if (!container) {
            return;
        }
        var elemSize = getSize_1.default(this.element);
        var containerSize = getSize_1.default(container);
        var elemRect = this.element.getBoundingClientRect();
        var containerRect = container.getBoundingClientRect();
        var borderSizeX = containerSize.borderLeftWidth + containerSize.borderRightWidth;
        var borderSizeY = containerSize.borderTopWidth + containerSize.borderBottomWidth;
        var position = this.relativeStartPosition = {
            x: elemRect.left - (containerRect.left + containerSize.borderLeftWidth),
            y: elemRect.top - (containerRect.top + containerSize.borderTopWidth)
        };
        this.containSize = {
            width: containerSize.width - borderSizeX - position.x - elemSize.width,
            height: containerSize.height - borderSizeY - position.y - elemSize.height
        };
    };
    Drag.prototype.enable = function () {
        this.isEnabled = true;
    };
    Drag.prototype.disable = function () {
        this.isEnabled = false;
        if (this.isDragging) {
            this.dragEnd(null, null);
        }
    };
    Drag.prototype.dragMove = function (event, pointer, moveVector) {
        if (!this.isEnabled) {
            return;
        }
        var dragX = moveVector.x;
        var dragY = moveVector.y;
        var grid = this.options.grid;
        var gridX = grid && grid[0];
        var gridY = grid && grid[1];
        dragX = applyGrid(dragX, gridX);
        dragY = applyGrid(dragY, gridY);
        dragX = this.containDrag('x', dragX, gridX);
        dragY = this.containDrag('y', dragY, gridY);
        dragX = this.options.axis == 'y' ? 0 : dragX;
        dragY = this.options.axis == 'x' ? 0 : dragY;
        this.position.x = this.startPosition.x + dragX;
        this.position.y = this.startPosition.y + dragY;
        this.dragPoint.x = dragX;
        this.dragPoint.y = dragY;
        this.dispatchEvent('dragMove', event, pointer, moveVector);
    };
    Drag.prototype.containDrag = function (axis, drag, grid) {
        if (!this.options.containment) {
            return drag;
        }
        var measure = axis == 'x' ? 'width' : 'height';
        var rel = this.relativeStartPosition[axis];
        var min = applyGrid(-rel, grid, 'ceil');
        var max = this.containSize[measure];
        max = applyGrid(max, grid, 'floor');
        return Math.max(min, Math.min(max, drag));
    };
    Drag.prototype.dragEnd = function (event, pointer) {
        if (!this.isEnabled) {
            return;
        }
        this.element.style.transform = '';
        this.setLeftTop();
        this.dispatchEvent('dragEnd', event, pointer);
    };
    Drag.prototype.setLeftTop = function () {
        this.element.style.left = this.position.x + 'px';
        this.element.style.top = this.position.y + 'px';
    };
    Drag.prototype.dispatchEvent = function (type, event) {
        var rest = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rest[_i - 2] = arguments[_i];
        }
        this.emit.apply(this, [type, event].concat(rest));
    };
    Drag.prototype.animate = function () {
        if (!this.isDragging) {
            return;
        }
        this.positionDrag();
        var self = this;
        requestAnimationFrame(function animateFrame() {
            self.animate();
        });
    };
    Drag.prototype.positionDrag = function () {
        this.element.style.transform = 'translate3d( ' + this.dragPoint.x + 'px, ' + this.dragPoint.y + 'px, 0)';
    };
    Drag.prototype.destroy = function () {
        this.disable();
        this.element.style.transform = '';
        this.element.style.left = '';
        this.element.style.top = '';
        this.element.style.position = '';
        this.unbindHandles();
    };
    Drag.defaults = {};
    return Drag;
}(Dragger_1.default);
exports.default = Drag;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var Pointer_1 = __webpack_require__(3);
var cursorNodes = {
    TEXTAREA: true,
    INPUT: true,
    SELECT: true,
    OPTION: true
};
var clickTypes = {
    radio: true,
    checkbox: true,
    button: true,
    submit: true,
    image: true,
    file: true
};
var Dragger = function (_super) {
    __extends(Dragger, _super);
    function Dragger() {
        var _this = _super.call(this) || this;
        _this.handleDoms = [];
        _this.isPreventingClicks = false;
        _this.isDragging = false;
        _this.pointerDownPointer = null;
        _this.isIgnoringMouseUp = false;
        return _this;
    }
    Dragger.prototype.bindHandles = function () {
        this._bindHandles(true);
    };
    Dragger.prototype.unbindHandles = function () {
        this._bindHandles(false);
    };
    Dragger.prototype._bindHandles = function (isAdd) {
        for (var i = 0; i < this.handleDoms.length; i++) {
            this._bindStartEvent(this.handleDoms[i], isAdd);
            if (isAdd) {
                this.handleDoms[i].addEventListener('click', this.handleEvent);
            } else {
                this.handleDoms[i].removeEventListener('click', this.handleEvent);
            }
        }
    };
    Dragger.prototype.onclick = function (event) {
        if (this.isPreventingClicks) {
            event.preventDefault();
        }
    };
    Dragger.prototype.pointerDown = function (event, pointer) {
        var isOkay = this.okayPointerDown(event);
        if (!isOkay) {
            return;
        }
        this.pointerDownPointer = pointer;
        event.preventDefault();
        this.pointerDownBlur();
        this._bindPostStartEventS(event);
        this.emit('pointerDown', event, pointer);
    };
    Dragger.prototype.okayPointerDown = function (event) {
        var isCursorNode = cursorNodes[event.target.nodeName];
        var isClickType = clickTypes[event.target.type];
        var isOkay = !isCursorNode || isClickType;
        if (!isOkay) {
            this._pointerReset();
        }
        return isOkay;
    };
    Dragger.prototype.pointerDownBlur = function () {
        var focused = document.activeElement;
        var canBlur = focused && focused.blur && focused !== document.body;
        if (canBlur) {
            focused.blur();
        }
    };
    Dragger.prototype.pointerMove = function (event, pointer) {
        var moveVector = this._dragPointerMove(event, pointer);
        this.emit('pointerMove', event, pointer, moveVector);
        this._dragMove(event, pointer, moveVector);
    };
    Dragger.prototype._dragPointerMove = function (event, pointer) {
        var moveVector = {
            x: pointer.pageX - this.pointerDownPointer.pageX,
            y: pointer.pageY - this.pointerDownPointer.pageY
        };
        if (!this.isDragging && this.hasDragStarted(moveVector)) {
            this._dragStart(event, pointer);
        }
        return moveVector;
    };
    Dragger.prototype._dragStart = function (event, pointer) {
        this.isDragging = true;
        this.isPreventingClicks = true;
        this.dragStart(event, pointer);
    };
    Dragger.prototype.hasDragStarted = function (moveVector) {
        return Math.abs(moveVector.x) > 3 || Math.abs(moveVector.y) > 3;
    };
    Dragger.prototype.dragStart = function (event, pointer) {
        this.emit('dragStart', event, pointer);
    };
    Dragger.prototype._dragMove = function (event, pointer, moveVector) {
        if (!this.isDragging) {
            return;
        }
        this.dragMove(event, pointer, moveVector);
    };
    Dragger.prototype.dragMove = function (event, pointer, moveVector) {
        event.preventDefault();
        this.emit('dragMove', event, pointer, moveVector);
    };
    Dragger.prototype.pointerUp = function (event, pointer) {
        this.emit('pointerUp', event, pointer);
        this._dragPointerUp(event, pointer);
    };
    Dragger.prototype._dragPointerUp = function (event, pointer) {
        if (this.isDragging) {
            this._dragEnd(event, pointer);
        } else {
            this._staticClick(event, pointer);
        }
    };
    Dragger.prototype._staticClick = function (event, pointer) {
        if (this.isIgnoringMouseUp && event.type === 'mouseup') {
            return;
        }
        this.staticClick(event, pointer);
        if (event.type !== 'mouseup') {
            this.isIgnoringMouseUp = true;
            setTimeout(function () {
                this.isIgnoringMouseUp = false;
            }.bind(this), 400);
        }
    };
    Dragger.prototype.staticClick = function (event, pointer) {
        this.emit('staticClick', event, pointer);
    };
    Dragger.prototype.dragEnd = function (event, pointer) {
        this.emit('dragEnd', event, pointer);
    };
    Dragger.prototype._dragEnd = function (event, pointer) {
        this.isDragging = false;
        setTimeout(function () {
            this.isPreventingClicks = false;
        }.bind(this));
        this.dragEnd(event, pointer);
    };
    return Dragger;
}(Pointer_1.default);
exports.default = Dragger;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = function () {
    function EventEmitter() {
        this._event = {};
    }
    EventEmitter.prototype.on = function (type, fn) {
        if (!type || !fn) {
            throw Error('loose params');
        }
        this._add(type, fn, false);
        return this;
    };
    EventEmitter.prototype.once = function (type, fn) {
        if (!type || !fn) {
            throw Error('loose params');
        }
        this._add(type, fn, true);
        return this;
    };
    EventEmitter.prototype._add = function (type, fn, once) {
        var listeners = this._event[type] || (this._event[type] = []);
        for (var i = 0; i < listeners.length; i++) {
            if (fn === listeners[i].fn && once === listeners[i].once) {
                return;
            }
        }
        listeners.push({
            once: once,
            fn: fn
        });
    };
    EventEmitter.prototype.off = function (type, fn) {
        var listeners = this._event[type] || (this._event[type] = []);
        for (var i = listeners.length - 1; i >= 0; i--) {
            if (fn === listeners[i].fn) {
                listeners.splice(i, 1);
            }
        }
        return this;
    };
    EventEmitter.prototype.emit = function (type) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var listeners = this._event[type] || (this._event[type] = []);
        var copy = listeners.slice();
        for (var i = 0; i < copy.length; i++) {
            var listener = copy[i];
            listener.fn.apply(this, rest);
            if (copy[i].once) {
                this.off(type, listeners[i].fn);
            }
        }
        return this;
    };
    return EventEmitter;
}();
exports.default = EventEmitter;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter_1 = __webpack_require__(2);
var postStartEvents = {
    mousedown: ['mousemove', 'mouseup'],
    touchstart: ['touchmove', 'touchend', 'touchcancel'],
    pointerdown: ['pointermove', 'pointerup', 'pointercancel']
};
var Pointer = function (_super) {
    __extends(Pointer, _super);
    function Pointer() {
        var _this = _super.call(this) || this;
        _this.isPointerDown = false;
        _this.pointerIdentifier = null;
        _this._boundPointerEvents = [];
        _this.handleEvent = null;
        _this._unbindPostStartEvents = function () {
            if (!this._boundPointerEvents) {
                return;
            }
            this._boundPointerEvents.forEach(function (type) {
                window.removeEventListener(type, this.handleEvent);
            }, this);
            this._boundPointerEvents = null;
        };
        _this.handleEvent = _this.handleProxy();
        return _this;
    }
    Pointer.prototype.bindStartEvent = function (el) {
        this._bindStartEvent(el, true);
    };
    Pointer.prototype.unbindStartEvent = function (el) {
        this._bindStartEvent(el, false);
    };
    Pointer.prototype._bindStartEvent = function (el, isAdd) {
        var method = isAdd ? 'addEventListener' : 'removeEventListener';
        var startEvent = 'mousedown';
        if (isAdd) {
            el.addEventListener(startEvent, this.handleEvent);
        } else {
            el.removeEventListener(startEvent, this.handleEvent);
        }
    };
    Pointer.prototype.handleProxy = function () {
        var self = this;
        return function (event) {
            var method = 'on' + event.type;
            if (self[method]) {
                self[method](event);
            }
        };
    };
    Pointer.prototype.onmousemove = function (event) {
        this._pointerMove(event, event);
    };
    Pointer.prototype._pointerMove = function (event, pointer) {
        this.pointerMove(event, pointer);
    };
    Pointer.prototype.pointerMove = function (event, pointer) {
        this.emit('pointerMove', event, pointer);
    };
    Pointer.prototype.onmouseup = function (event) {
        this._pointerUp(event, event);
    };
    Pointer.prototype._pointerUp = function (event, pointer) {
        this._pointerDone();
        this.pointerUp(event, pointer);
    };
    Pointer.prototype.pointerUp = function (event, pointer) {
        this.emit('pointerUp', event, pointer);
    };
    ;
    Pointer.prototype._pointerDone = function () {
        this._pointerReset();
        this._unbindPostStartEvents();
        this.pointerDone();
    };
    Pointer.prototype.pointerDone = function () {
        console.log('done');
    };
    Pointer.prototype._pointerReset = function () {
        this.isPointerDown = false;
        this.pointerIdentifier = null;
    };
    Pointer.prototype.onmousedown = function (event) {
        var button = event.button;
        if (button && button !== 0 && button !== 1) {
            return;
        }
        this._pointerDown(event, event);
    };
    Pointer.prototype._pointerDown = function (event, pointer) {
        if (event.button || this.isPointerDown) {
            return;
        }
        this.isPointerDown = true;
        this.pointerIdentifier = pointer.pointerId !== undefined ? pointer.poiterId : pointer.identifier;
        this.pointerDown(event, pointer);
    };
    Pointer.prototype.pointerDown = function (event, pointer) {
        this._bindPostStartEventS(event);
        this.emit('pointerDown', event, pointer);
    };
    Pointer.prototype._bindPostStartEventS = function (event) {
        if (!event) {
            return;
        }
        var events = postStartEvents[event.type];
        events.forEach(function (type) {
            window.addEventListener(type, this.handleEvent);
        }, this);
        this._boundPointerEvents = events;
    };
    return Pointer;
}(EventEmitter_1.default);
exports.default = Pointer;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
var measurements = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth'];
var measurementsLength = measurements.length;
function getStyleSize(value) {
    var num = parseFloat(value);
    var isValid = value.indexOf('%') == -1 && !isNaN(num);
    return isValid && num;
}
function getZeroSize() {
    var size = {
        width: 0,
        height: 0,
        innerWidth: 0,
        innerHeight: 0,
        outerWidth: 0,
        outerHeight: 0
    };
    for (var i = 0; i < measurementsLength; i++) {
        var measurement = measurements[i];
        size[measurement] = 0;
    }
    return size;
}
function getStyle(ele) {
    var style = getComputedStyle(ele);
    return style;
}
var isSetup = false;
var isBoxSizeOuter;
function setup() {
    if (isSetup) {
        return;
    }
    isSetup = true;
    var div = document.createElement('div');
    div.style.width = '200px';
    div.style.padding = '1px 2px 3px 4px';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px 2px 3px 4px';
    div.style.boxSizing = 'border-box';
    var body = document.body || document.documentElement;
    body.appendChild(div);
    var style = getStyle(div);
    getSize.isBoxSizeOuter = isBoxSizeOuter = getStyleSize(style.width) == 200;
    body.removeChild(div);
}
function getSize(elem) {
    setup();
    if (typeof elem == 'string') {
        elem = document.querySelector(elem);
    }
    if (!elem || (typeof elem === "undefined" ? "undefined" : _typeof(elem)) != 'object' || !elem.nodeType) {
        return;
    }
    var style = getStyle(elem);
    if (style.display == 'none') {
        return getZeroSize();
    }
    var size = {};
    size.width = elem.offsetWidth;
    size.height = elem.offsetHeight;
    var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';
    for (var i = 0; i < measurementsLength; i++) {
        var measurement = measurements[i];
        var value = style[measurement];
        var num = parseFloat(value);
        size[measurement] = !isNaN(num) ? num : 0;
    }
    var paddingWidth = size.paddingLeft + size.paddingRight;
    var paddingHeight = size.paddingTop + size.paddingBottom;
    var marginWidth = size.marginLeft + size.marginRight;
    var marginHeight = size.marginTop + size.marginBottom;
    var borderWidth = size.borderLeftWidth + size.borderRightWidth;
    var borderHeight = size.borderTopWidth + size.borderBottomWidth;
    var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;
    var styleWidth = getStyleSize(style.width);
    if (styleWidth !== false) {
        size.width = styleWidth + (isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
    }
    var styleHeight = getStyleSize(style.height);
    if (styleHeight !== false) {
        size.height = styleHeight + (isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
    }
    size.innerWidth = size.width - (paddingWidth + borderWidth);
    size.innerHeight = size.height - (paddingHeight + borderHeight);
    size.outerWidth = size.width + marginWidth;
    size.outerHeight = size.height + marginHeight;
    return size;
}
exports.default = getSize;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var Drag_1 = __webpack_require__(0);
window.Draggabilly = Drag_1.default;

/***/ })
/******/ ]);