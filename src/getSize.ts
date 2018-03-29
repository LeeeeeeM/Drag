const measurements = [
    'paddingLeft',
    'paddingRight',
    'paddingTop',
    'paddingBottom',
    'marginLeft',
    'marginRight',
    'marginTop',
    'marginBottom',
    'borderLeftWidth',
    'borderRightWidth',
    'borderTopWidth',
    'borderBottomWidth'
];

const measurementsLength = measurements.length;

function getStyleSize(value: any) {
    const num = parseFloat(value);
    const isValid = value.indexOf('%') == -1 && !isNaN(num);
    return isValid && num;
}

function getZeroSize() {
    const size: any = {
        width: 0,
        height: 0,
        innerWidth: 0,
        innerHeight: 0,
        outerWidth: 0,
        outerHeight: 0
    };
    for (let i = 0; i < measurementsLength; i++) {
        var measurement = measurements[i];
        size[measurement] = 0;
    }
    return size;
}

function getStyle(ele: Element) {
    const style = getComputedStyle(ele);
    return style;
}

let isSetup = false;

let isBoxSizeOuter: any;

function setup() {
    if (isSetup) {
        return;
    }
    isSetup = true;

    const div = document.createElement('div');
    div.style.width = '200px';
    div.style.padding = '1px 2px 3px 4px';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px 2px 3px 4px';
    div.style.boxSizing = 'border-box';

    const body = document.body || document.documentElement;
    body.appendChild(div);
    const style = getStyle(div);

    (getSize as any).isBoxSizeOuter = isBoxSizeOuter = getStyleSize(style.width) == 200;
    body.removeChild(div);
}

export default function getSize(elem: any) {
    setup();

    if (typeof elem == 'string') {
        elem = document.querySelector(elem);
    }

    if (!elem || typeof elem != 'object' || !elem.nodeType) {
        return;
    }

    const style:any = getStyle(elem);

    if (style.display == 'none') {
        return getZeroSize();
    }

    const size: any = {};
    size.width = elem.offsetWidth;
    size.height = elem.offsetHeight;

    let isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';

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
        size.width = styleWidth +
            // add padding and border unless it's already including it
            (isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
    }

    var styleHeight = getStyleSize(style.height);
    if (styleHeight !== false) {
        size.height = styleHeight +
            // add padding and border unless it's already including it
            (isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
    }

    size.innerWidth = size.width - (paddingWidth + borderWidth);
    size.innerHeight = size.height - (paddingHeight + borderHeight);

    size.outerWidth = size.width + marginWidth;
    size.outerHeight = size.height + marginHeight;

    return size;
}