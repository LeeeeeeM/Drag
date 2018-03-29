import EventEmitter from './EventEmitter';

declare const window: any;

const postStartEvents: any = {
    mousedown: ['mousemove', 'mouseup'],
    touchstart: ['touchmove', 'touchend', 'touchcancel'],
    pointerdown: ['pointermove', 'pointerup', 'pointercancel'],
};

export default class Pointer extends EventEmitter {
    isPointerDown: boolean = false;
    pointerIdentifier: any = null;
    _boundPointerEvents: any[] = [];
    handleEvent: any = null;
    constructor() {
        super();
        this.handleEvent = this.handleProxy();
    }
    bindStartEvent(el: Node) {
        this._bindStartEvent(el, true);
    }
    unbindStartEvent(el: Node) {
        this._bindStartEvent(el, false);
    }
    _bindStartEvent(el: Node, isAdd: boolean) {
        const method = isAdd ? 'addEventListener' : 'removeEventListener';
        let startEvent = 'mousedown';
        if (isAdd) {
            el.addEventListener(startEvent, this.handleEvent);
        } else {
            el.removeEventListener(startEvent, this.handleEvent);
        }
    }

    handleProxy() {
        var self: any = this;
        return function(event: any) {
            let method = 'on' + event.type;
            if (self[method]) {
                self[method](event);
            }
        };
    }

    onmousemove(event: any) {
        this._pointerMove(event, event);
    }

    _pointerMove(event: any, pointer: any) {
        this.pointerMove(event, pointer);
    }

    pointerMove(event: any, pointer: any) {
        this.emit('pointerMove', event, pointer);
    }

    onmouseup(event: any) {
        this._pointerUp(event, event);
    }

    _pointerUp(event: any, pointer: any) {
        this._pointerDone();
        this.pointerUp(event, pointer);
    }

    pointerUp(event: any, pointer: any) {
        this.emit('pointerUp', event, pointer);
    };

    _pointerDone() {
        this._pointerReset();
        this._unbindPostStartEvents();
        this.pointerDone();
    }

    pointerDone() {
        console.log('done')
    }

    _pointerReset() {
        this.isPointerDown = false;
        this.pointerIdentifier = null;
    }

    onmousedown(event: any) {
        const button = event.button;
        if (button && (button !== 0 && button !== 1)) {
            return;
        }
        this._pointerDown(event, event);
    }

    _pointerDown(event: any, pointer: any) {
        // button = 0 is okay, 1-4 not  0 鼠标左键
        if (event.button || this.isPointerDown) {
            return;
        }
        this.isPointerDown = true;
        this.pointerIdentifier = pointer.pointerId !== undefined ?
            pointer.poiterId : pointer.identifier;
        this.pointerDown(event, pointer);
    }

    pointerDown(event: any, pointer: any) {
        this._bindPostStartEventS(event);
        this.emit('pointerDown', event, pointer);
    }

    _bindPostStartEventS(event: any) {
        if (!event) {
            return;
        }
        const events = postStartEvents[event.type];
        events.forEach(function (type: string) {
            window.addEventListener(type, this.handleEvent);
        }, this);
        this._boundPointerEvents = events;
    }

    _unbindPostStartEvents = function () {
        if (!this._boundPointerEvents) {
            return;
        }
        this._boundPointerEvents.forEach(function (type: string) {
            window.removeEventListener(type, this.handleEvent);
        }, this);
        this._boundPointerEvents = null;
    };
}
