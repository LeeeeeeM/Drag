import EventEmitter from './EventEmitter';
import Pointer from './Pointer'
import getSize from './getSize';

declare var window: any;

window.EventEmitter = EventEmitter;

window.getSize = getSize;

window.Pointer = Pointer;