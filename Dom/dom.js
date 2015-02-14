'use strict';

// ******************************* //
// Define constant methods         //
// ******************************* //
if (!Object.defineProperty) {
    Object.defineProperty = function (obj, key, props) {
        obj[key] = props.value;
    };
}

Object.defineProperty(window, 'define', {
    value: function(parent, key, value) {
        Object.defineProperty(parent, key, {
            value: value,
            writable: false,
            enumerable: true,
            configurable: false
        });
    },
    writable: false,
    enumerable: true,
    configurable: false
});

// ******************************* //
// Helpers                         //
// ******************************* //
define(window, 'isHTMLElement', function (element) {
    return element instanceof Node;
});

define(window, 'isObject', function (element) {
    return element instanceof Object;
});

define(window, 'isArray', function (element) {
    return element instanceof Array;
});

define(window, 'isString', function (element) {
    return (typeof element).toLowerCase() === 'string';
});

define(window, 'isNumber', function (element) {
    return (typeof element).toLowerCase() === 'number';
});

define(window, 'isUndefined', function (element) {
     return [undefined, null, '', 'undefined', 'null'].indexOf(element) > -1;
});

define(window, 'setListsPrototype', function (name, f) {
    HTMLCollection.prototype[name] = f;
    NodeList.prototype[name] = f;
});

define(window, 'copyToListsPrototype', function (name) {
    setListsPrototype(name, function (arg) {
        this.each(function () {
            HTMLElement.prototype[name].call(this, arg);
        });
        return this;
    });
});

String.prototype.removeWhiteSpaces = function () {
    return this.replace(/\s+/g, '');
}

// ******************************* //
// If no other $ library you can   //
// use this                        //
// ******************************* //
define(window, '$', function (str) {
    var result = document.querySelectorAll(str);
    if (result.length == 1) {
        return result[0];
    } else {
        return result;
    }
});

// ******************************* //
// Getter                          //
// ******************************* //
define(window, 'get', {

    id: function (str) {
        return document.getElementById(str);
    },

    class: function (str) {
        return document.getElementsByClassName(str);
    },

    tag: function (str) {
        return document.getElementsByTagName(str);
    },

    name: function (str) {
        return document.getElementsByName(str);
    },

    q: function (str) {
        return document.querySelector(str);
    },

    qAll: function (str) {
        return document.querySelectorAll(str);
    },

    body: function () {
        return document.body;
    }
});

// ******************************* //
// Creator                         //
// ******************************* //
define(window, 'create', function (elementType, props) {
    var el = document.createElement(elementType);
    if (props && isObject(props)) {
        var propKeys = Object.keys(props),
            len = propKeys.length,
            i = 0;
        for (; i < len; i++) {
            el[propKeys[i]] = props[propKeys[i]];
        }
    }
    return el;
});

// ******************************* //
// Extend Html elements prototype  //
// ******************************* //

// ***** each, first and last ***** //
setListsPrototype('each', function (f) {
    var l = this.length, i = 0;
    for (; i < l; i++) {
        f.call(this[i], i);
    }
});

setListsPrototype('first', function (f) {
    return this[0];
});

setListsPrototype('last', function (f) {
    return this[this.length - 1];
});


// ***** addStyle ***** //
HTMLElement.prototype.addStyle = Object.prototype.addStyle = function (stylesObj) {
    for (var i in stylesObj) {
        this.style[i] = stylesObj[i];
    }
    return this;
};

copyToListsPrototype('addStyle');


// ***** append ***** //
HTMLElement.prototype.append = function (element) {
    if (isHTMLElement(element)) {
        this.appendChild(element.cloneNode(true));
    } else {
        this.innerHTML += element.toString();
    }
    return this;
};

copyToListsPrototype('append');


// ***** prepend ***** //
HTMLElement.prototype.prepend = function (element) {
    if (isHTMLElement(element)) {
        this.insertBefore(element.cloneNode(true), this.childNodes[0]);
    } else {
        this.innerHTML = element.toString() + this.innerHTML;
    }
    return this;
};

copyToListsPrototype('prepend');


// ***** hide ***** //
HTMLElement.prototype.hide = function () {
    this.style.display = 'none';
    return this;
};

copyToListsPrototype('hide');


// ***** show ***** //
HTMLElement.prototype.show = function () {
    this.style.display = 'block';
    return this;
};

copyToListsPrototype('show');


// ***** remove ***** //
HTMLElement.prototype.remove = function () {
    this.parentElement.removeChild(this);
};

setListsPrototype('remove', function () {
    for (var i = 0, l = this.length; i < l; i++) {
        this.first().remove();
    }
});


// ***** empty ***** //
HTMLElement.prototype.empty = function () {
    while (this.lastChild) {
        this.removeChild(this.lastChild);
    }
    return this;
};

copyToListsPrototype('empty');


// ***** find ***** //
HTMLElement.prototype.find = function (query) {
    return this.querySelectorAll(query);
};


// ***** html ***** //
HTMLElement.prototype.html = function (html) {
    if (isUndefined(html) && !isString(html) && !isNumber(html)) {
        return this.innerHTML;
    } else if (isString(html)) {
        if (html.trim().length === 0) {
            this.empty();
        } else {
            this.innerHTML = html;
        }
    } else if (html instanceof Node) {
        this.empty();
        this.append(html);
    } else {
        this.innerHTML = html.toString();
    }
    return this;
};

copyToListsPrototype('html');


// ***** addClass ***** //
HTMLElement.prototype.addClass = function (className) {
    if (className && isString(className)) {
        this.classList.add(className.removeWhiteSpaces());
    }
    return this;
};

copyToListsPrototype('addClass');


// ***** removeClass ***** //
HTMLElement.prototype.removeClass = function (className) {
    if (isString(className)) {
        if (className) {
            this.classList.remove(className.removeWhiteSpaces());
        } 
    } else if (isUndefined(className)) {
        this.className = '';
    }
    return this;
};

copyToListsPrototype('removeClass');


// ***** toggleClass ***** //
HTMLElement.prototype.toggleClass = function (className) {
    if (className && isString(className)) {
        this.classList.toggle(className.removeWhiteSpaces());
    }
    return this;
};

copyToListsPrototype('toggleClass');


// ***** hasClass ***** //
HTMLElement.prototype.hasClass = function (className) {
    if (className && isString(className)) {
        return this.classList.contains(className);
    }
    return false;
};


// ***** attr ***** //
HTMLElement.prototype.attr = function (attrName, attrValue) {
    if (!isUndefined(attrName) && isString(attrName)) {
        if (!isUndefined(attrValue)) {
            this.setAttribute(attrName, attrValue.toString());
        } else {
            this.getAttribute(attrName);
        }
    }
    return this;
};


// ***** removeAttr ***** //
HTMLElement.prototype.removeAttr = function (attrName) {
    if (!isUndefined(attrName) && isString(attrName)) {
        this.removeAttribute(attrName);
    }
    return this;
};

copyToListsPrototype('removeAttr');