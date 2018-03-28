
interface EventStruct {
    once: boolean,
    fn: Function
}

interface EventCtor {
    [x: string]: EventStruct[]
}

export default class EventEmitter {
    _event: EventCtor;
    constructor() {
        this._event = {};
    }
    on(type: string, fn: Function) {
        if (!type || !fn) {
            throw Error('loose params');
        }
        this._add(type, fn, false);
        return this;
    }
    once(type: string, fn: Function) {
        if (!type || !fn) {
            throw Error('loose params');
        }
        this._add(type, fn, true);
        return this;
    }

    _add(type: string, fn: Function, once: boolean) {
        const listeners = this._event[type] || (this._event[type] = []);
        for (let i = 0; i < listeners.length; i++) {
            if (fn === listeners[i].fn && once === listeners[i].once) {
                return;
            }
        }
        listeners.push({
            once,
            fn
        });
    }

    off(type: string, fn: Function) {
        const listeners = this._event[type] || (this._event[type] = []);
        for (let i = listeners.length - 1; i >= 0; i--) {
            if (fn === listeners[i].fn) {
                listeners.splice(i, 1);
            }
        }
        return this;
    }
    emit(type: string, ...rest: any[]) {
        const listeners = this._event[type] || (this._event[type] = []);
        const copy = listeners.slice();
        for (let i = 0; i < copy.length; i++) {
            let listener = copy[i];
            listener.fn.apply(this, rest);
            if (copy[i].once) {
                this.off(type, listeners[i].fn);
            }
        }
        return this;
    }
}