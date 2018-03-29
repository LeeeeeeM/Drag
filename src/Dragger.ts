import Pointer from './Pointer';

const cursorNodes: any = {
    TEXTAREA: true,
    INPUT: true,
    SELECT: true,
    OPTION: true,
};

const clickTypes: any = {
    radio: true,
    checkbox: true,
    button: true,
    submit: true,
    image: true,
    file: true,
};


export default class Dragger extends Pointer {
    handleDoms: Node[] = [];
    isPreventingClicks: boolean = false;
    isDragging: boolean = false;
    pointerDownPointer: any = null;
    isIgnoringMouseUp: boolean = false;
    constructor() {
        super();
    }

    bindHandles() {
        this._bindHandles(true);
    }

    unbindHandles() {
        this._bindHandles(false);
    }
    /**
     * 
     * @param isAdd click handlers
     */
    _bindHandles(isAdd: boolean) {
        for (let i = 0; i < this.handleDoms.length; i++) {
            this._bindStartEvent(this.handleDoms[i], isAdd);
            if (isAdd) {
                this.handleDoms[i].addEventListener('click', this.handleEvent);
            } else {
                this.handleDoms[i].removeEventListener('click', this.handleEvent);
            }
        }
    }

    onclick(event: any) {
        if (this.isPreventingClicks) {
            event.preventDefault();
        }
    }

    pointerDown(event: any, pointer: any) {
        const isOkay = this.okayPointerDown(event);
        if (!isOkay) {
            return;
        }
        this.pointerDownPointer = pointer;

        event.preventDefault();
        this.pointerDownBlur();
        this._bindPostStartEventS(event);
        this.emit('pointerDown', event, pointer);
    }

    okayPointerDown(event: any) {
        const isCursorNode = cursorNodes[event.target.nodeName];
        const isClickType = clickTypes[event.target.type];
        const isOkay = !isCursorNode || isClickType;
        if (!isOkay) {
            this._pointerReset();
        }
        return isOkay;
    }

    pointerDownBlur() {
        const focused: any = document.activeElement;
        const canBlur = focused && focused.blur && focused !== document.body;
        if (canBlur) {
            focused.blur();
        }
    }

    pointerMove(event: any, pointer: any) {
        var moveVector = this._dragPointerMove(event, pointer);
        this.emit('pointerMove', event, pointer, moveVector);
        this._dragMove(event, pointer, moveVector);
    }

    _dragPointerMove(event: any, pointer: any) {
        const moveVector = {
            x: pointer.pageX - this.pointerDownPointer.pageX,
            y: pointer.pageY - this.pointerDownPointer.pageY
        };

        if (!this.isDragging && this.hasDragStarted(moveVector)) {
            this._dragStart(event, pointer);
        }
        return moveVector;
    }

    _dragStart(event: any, pointer: any) {
        this.isDragging = true;
        this.isPreventingClicks = true;
        this.dragStart(event, pointer);
    }

    hasDragStarted(moveVector: any) {
        return Math.abs(moveVector.x) > 3 || Math.abs(moveVector.y) > 3;
    }

    dragStart(event: any, pointer: any) {
        this.emit('dragStart', event, pointer);
    }

    _dragMove(event: any, pointer: any, moveVector: any) {
        if (!this.isDragging) {
            return;
        }
        this.dragMove(event, pointer, moveVector);
    }

    dragMove(event: any, pointer: any, moveVector: any) {
        event.preventDefault();
        this.emit('dragMove', event, pointer, moveVector);
    }

    pointerUp(event: any, pointer: any) {
        this.emit('pointerUp', event, pointer);
        this._dragPointerUp(event, pointer);
    }

    _dragPointerUp(event: any, pointer: any) {
        if (this.isDragging) {
            this._dragEnd(event, pointer);
        } else {
            this._staticClick(event, pointer);
        }
    }

    _staticClick(event: any, pointer: any) {
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
    }

    staticClick(event: any, pointer: any) {
        this.emit('staticClick', event, pointer);
    }

    dragEnd(event: any, pointer: any) {
        this.emit('dragEnd', event, pointer);
    }

    _dragEnd(event: any, pointer: any) {
        // set flags
        this.isDragging = false;
        // re-enable clicking async
        setTimeout(function () {
            this.isPreventingClicks = null;
        }.bind(this));

        this.dragEnd(event, pointer);
    }
}