import getSize from './getSize';
import Dragger from './Dragger';

function extend(a: any, b: any) {
    for (var prop in b) {
        a[prop] = b[prop];
    }
    return a;
}

const positionValues: any = {
    relative: true,
    absolute: true,
    fixed: true
};


function applyGrid(value: any, grid: any, method: any = 'round') {
    return grid ? (Math as any)[method](value / grid) * grid : value;
}

export default class Drag extends Dragger {
    position: any = null;
    dragPoint: any = null;
    startPosition: any = null;
    isEnabled: boolean = false;
    relativeStartPosition: any = null;
    containSize: any = null;
    constructor(public element: any, public options: any) {
        super();
        this.element = typeof element == 'string' ? document.querySelector(element) : element;
        this.options = extend({}, Drag.defaults);
        this.option(options);
        this._create();
    }
    static defaults = {};
    option(opts: any) {
        extend(this.options, opts);
    }
    _create() {
        this.position = {};
        const style: any = getComputedStyle(this.element);
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
    }

    setHandles() {
        this.handleDoms = this.options.handle ? this.element.querySelectorAll(this.options.handle) : [this.element];
        this.bindHandles();
    }

    _getPosition() {
        let style = getComputedStyle(this.element, null);
        var x = this._getPositionCoord(style.left, 'width');
        var y = this._getPositionCoord(style.top, 'height');
        this.position.x = isNaN(x) ? 0 : x;
        this.position.y = isNaN(y) ? 0 : y;
        this._addTransformPosition(style);
    }

    _getPositionCoord(styleSide: any, measure: any) {
        if (styleSide.indexOf('%') != -1) {
            var parentSize = getSize(this.element.parentNode);
            return !parentSize ? 0 : (parseFloat(styleSide) / 100) * parentSize[measure];
        }
        return parseInt(styleSide, 10);
    }

    _addTransformPosition(style: any) {
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

    dragStart(event: any, pointer: any) {
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
    }

    getContainer() {
        var containment = this.options.containment;
        if (!containment) {
            return;
        }
        var isElement = containment instanceof HTMLElement;
        // use as element
        if (isElement) {
            return containment;
        }
        // querySelector if string
        if (typeof containment == 'string') {
            return document.querySelector(containment);
        }
        // fallback to parent element
        return this.element.parentNode;
    }

    measureContainment() {
        var container = this.getContainer();
        if (!container) {
            return;
        }

        var elemSize = getSize(this.element);
        var containerSize = getSize(container);
        var elemRect = this.element.getBoundingClientRect();
        var containerRect = container.getBoundingClientRect();

        var borderSizeX = containerSize.borderLeftWidth + containerSize.borderRightWidth;
        var borderSizeY = containerSize.borderTopWidth + containerSize.borderBottomWidth;
        var position = this.relativeStartPosition = {
            x: elemRect.left - (containerRect.left + containerSize.borderLeftWidth),
            y: elemRect.top - (containerRect.top + containerSize.borderTopWidth)
        };

        this.containSize = {
            width: (containerSize.width - borderSizeX) - position.x - elemSize.width,
            height: (containerSize.height - borderSizeY) - position.y - elemSize.height
        };
    }

    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
        if (this.isDragging) {
            this.dragEnd(null, null);
        }
    }

    dragMove(event: any, pointer: any, moveVector: any) {
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
        // set dragPoint properties
        this.dragPoint.x = dragX;
        this.dragPoint.y = dragY;
        this.dispatchEvent('dragMove', event, pointer, moveVector);
    }

    containDrag(axis: any, drag: any, grid: any) {
        if (!this.options.containment) {
            return drag;
        }
        var measure = axis == 'x' ? 'width' : 'height';

        var rel = this.relativeStartPosition[axis];
        var min = applyGrid(-rel, grid, 'ceil');
        var max = this.containSize[measure];
        max = applyGrid(max, grid, 'floor');
        return Math.max(min, Math.min(max, drag));
    }

    dragEnd(event: any, pointer: any) {
        if (!this.isEnabled) {
            return;
        }
        this.element.style.transform = '';
        this.setLeftTop();
        this.dispatchEvent('dragEnd', event, pointer);
    }

    setLeftTop() {
        this.element.style.left = this.position.x + 'px';
        this.element.style.top = this.position.y + 'px';
    }

    dispatchEvent(type: string, event: any, ...rest: any[]) {
        this.emit(type, event, ...rest);
    }

    animate() {
        if (!this.isDragging) {
            return;
        }
        this.positionDrag();
        const self: any = this;
        requestAnimationFrame(function animateFrame() {
            self.animate();
        });
    }
    positionDrag() {
        this.element.style.transform = 'translate3d( ' + this.dragPoint.x + 'px, ' + this.dragPoint.y + 'px, 0)';
    }

    destroy() {
        this.disable();
        this.element.style.transform = '';
        this.element.style.left = '';
        this.element.style.top = '';
        this.element.style.position = '';
        this.unbindHandles();
    }
}