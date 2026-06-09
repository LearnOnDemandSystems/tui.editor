/**
 * @fileoverview Check whether the given variable is a function or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Check whether the given variable is a function or not.
 * If the given variable is a function, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is function?
 * @memberof module:type
 */
function isFunction(obj) {
  return obj instanceof Function;
}

var isFunction_1 = isFunction;

var BACKTICK_COUNT = 3;
function getHTMLRenderers(prism) {
    return {
        codeBlock: function (node) {
            var _a = node, fenceLength = _a.fenceLength, info = _a.info;
            var infoWords = info ? info.split(/\s+/) : [];
            var preClasses = [];
            var codeAttrs = {};
            if (fenceLength > BACKTICK_COUNT) {
                codeAttrs['data-backticks'] = fenceLength;
            }
            var content = node.literal;
            if (infoWords.length && infoWords[0].length) {
                var lang = infoWords[0];
                preClasses.push("lang-" + lang);
                codeAttrs['data-language'] = lang;
                var registeredLang = prism.languages[lang];
                if (registeredLang) {
                    content = prism.highlight(node.literal, registeredLang, lang);
                }
            }
            return [
                { type: 'openTag', tagName: 'pre', classNames: preClasses },
                { type: 'openTag', tagName: 'code', attributes: codeAttrs },
                { type: 'html', content: content },
                { type: 'closeTag', tagName: 'code' },
                { type: 'closeTag', tagName: 'pre' },
            ];
        },
    };
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

/**
 * @fileoverview Check whether the given variable is a string or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Check whether the given variable is a string or not.
 * If the given variable is a string, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is string?
 * @memberof module:type
 */
function isString$1(obj) {
  return typeof obj === 'string' || obj instanceof String;
}

var isString_1 = isString$1;

function flatten(arr) {
    return arr.reduce(function (a, b) { return a.concat(Array.isArray(b) ? flatten(b) : b); }, []);
}

var NODE_TYPE = 'codeBlock';
function findCodeBlocks(doc) {
    var descendants = [];
    doc.descendants(function (node, pos) {
        if (node.isBlock && node.type.name === NODE_TYPE) {
            descendants.push({ node: node, pos: pos });
        }
    });
    return descendants;
}
function parseTokens(tokens, classNames) {
    if (classNames === void 0) { classNames = []; }
    if (isString_1(tokens)) {
        return [{ text: tokens, classes: classNames }];
    }
    return tokens.map(function (token) {
        var _a = token, type = _a.type, alias = _a.alias;
        var typeClassNames = [];
        var aliasClassNames = [];
        if (type) {
            typeClassNames = ['token', type];
        }
        if (alias) {
            aliasClassNames = isString_1(alias) ? [alias] : alias;
        }
        var classes = __spreadArray(__spreadArray(__spreadArray([], classNames), typeClassNames), aliasClassNames);
        return isString_1(token)
            ? {
                text: token,
                classes: classes,
            }
            : parseTokens(token.content, classes);
    });
}
function getDecorations(doc, context, prism) {
    var pmView = context.pmView;
    var decorations = [];
    var codeBlocks = findCodeBlocks(doc);
    codeBlocks.forEach(function (_a) {
        var pos = _a.pos, node = _a.node;
        var language = node.attrs.language;
        var registeredLang = prism.languages[language];
        var prismTokens = registeredLang ? prism.tokenize(node.textContent, registeredLang) : [];
        var nodeInfos = flatten(parseTokens(prismTokens));
        var startPos = pos + 1;
        nodeInfos.forEach(function (_a) {
            var text = _a.text, classes = _a.classes;
            var from = startPos;
            var to = from + text.length;
            startPos = to;
            var classNames = classes.join(' ');
            var decoration = pmView.Decoration.inline(from, to, {
                class: classNames,
            });
            if (classNames.length) {
                decorations.push(decoration);
            }
        });
    });
    return pmView.DecorationSet.create(doc, decorations);
}
function codeSyntaxHighlighting(context, prism) {
    return new context.pmState.Plugin({
        state: {
            init: function (_, _a) {
                var doc = _a.doc;
                return getDecorations(doc, context, prism);
            },
            apply: function (tr, set) {
                if (!tr.docChanged) {
                    return set.map(tr.mapping, tr.doc);
                }
                return getDecorations(tr.doc, context, prism);
            },
        },
        props: {
            decorations: function (state) {
                return this.getState(state);
            },
        },
    });
}

/**
 * @fileoverview Check whether the given variable is an instance of Array or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Check whether the given variable is an instance of Array or not.
 * If the given variable is an instance of Array, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is array instance?
 * @memberof module:type
 */
function isArray$3(obj) {
  return obj instanceof Array;
}

var isArray_1 = isArray$3;

/**
 * @fileoverview Execute the provided callback once for each element present in the array(or Array-like object) in ascending order.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Execute the provided callback once for each element present
 * in the array(or Array-like object) in ascending order.
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the element
 *  2) The index of the element
 *  3) The array(or Array-like object) being traversed
 * @param {Array|Arguments|NodeList} arr The array(or Array-like object) that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * // ES6
 * import forEachArray from 'tui-code-snippet/collection/forEachArray';
 * 
 * // CommonJS
 * const forEachArray = require('tui-code-snippet/collection/forEachArray'); 
 *
 * let sum = 0;
 *
 * forEachArray([1,2,3], function(value){
 *   sum += value;
 * });
 * alert(sum); // 6
 */
function forEachArray$3(arr, iteratee, context) {
  var index = 0;
  var len = arr.length;

  context = context || null;

  for (; index < len; index += 1) {
    if (iteratee.call(context, arr[index], index, arr) === false) {
      break;
    }
  }
}

var forEachArray_1 = forEachArray$3;

/**
 * @fileoverview Execute the provided callback once for each property of object which actually exist.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Execute the provided callback once for each property of object which actually exist.
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the property
 *  2) The name of the property
 *  3) The object being traversed
 * @param {Object} obj The object that will be traversed
 * @param {function} iteratee  Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * // ES6
 * import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
 * 
 * // CommonJS
 * const forEachOwnProperties = require('tui-code-snippet/collection/forEachOwnProperties'); 
 *
 * let sum = 0;
 *
 * forEachOwnProperties({a:1,b:2,c:3}, function(value){
 *   sum += value;
 * });
 * alert(sum); // 6
 */
function forEachOwnProperties$1(obj, iteratee, context) {
  var key;

  context = context || null;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (iteratee.call(context, obj[key], key, obj) === false) {
        break;
      }
    }
  }
}

var forEachOwnProperties_1 = forEachOwnProperties$1;

/**
 * @fileoverview Execute the provided callback once for each property of object(or element of array) which actually exist.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

var isArray$2 = isArray_1;
var forEachArray$2 = forEachArray_1;
var forEachOwnProperties = forEachOwnProperties_1;

/**
 * @module collection
 */

/**
 * Execute the provided callback once for each property of object(or element of array) which actually exist.
 * If the object is Array-like object(ex-arguments object), It needs to transform to Array.(see 'ex2' of example).
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the property(or The value of the element)
 *  2) The name of the property(or The index of the element)
 *  3) The object being traversed
 * @param {Object} obj The object that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * // ES6
 * import forEach from 'tui-code-snippet/collection/forEach'; 
 * 
 * // CommonJS
 * const forEach = require('tui-code-snippet/collection/forEach'); 
 *
 * let sum = 0;
 *
 * forEach([1,2,3], function(value){
 *   sum += value;
 * });
 * alert(sum); // 6
 *
 * // In case of Array-like object
 * const array = Array.prototype.slice.call(arrayLike); // change to array
 * forEach(array, function(value){
 *   sum += value;
 * });
 */
function forEach$2(obj, iteratee, context) {
  if (isArray$2(obj)) {
    forEachArray$2(obj, iteratee, context);
  } else {
    forEachOwnProperties(obj, iteratee, context);
  }
}

var forEach_1 = forEach$2;

/* eslint-disable complexity */

var isArray$1 = isArray_1;

/**
 * @module array
 */

/**
 * Returns the first index at which a given element can be found in the array
 * from start index(default 0), or -1 if it is not present.
 * It compares searchElement to elements of the Array using strict equality
 * (the same method used by the ===, or triple-equals, operator).
 * @param {*} searchElement Element to locate in the array
 * @param {Array} array Array that will be traversed.
 * @param {number} startIndex Start index in array for searching (default 0)
 * @returns {number} the First index at which a given element, or -1 if it is not present
 * @memberof module:array
 * @example
 * // ES6
 * import inArray from 'tui-code-snippet/array/inArray';
 * 
 * // CommonJS
 * const inArray = require('tui-code-snippet/array/inArray');
 *
 * const arr = ['one', 'two', 'three', 'four'];
 * const idx1 = inArray('one', arr, 3); // -1
 * const idx2 = inArray('one', arr); // 0
 */
function inArray$3(searchElement, array, startIndex) {
  var i;
  var length;
  startIndex = startIndex || 0;

  if (!isArray$1(array)) {
    return -1;
  }

  if (Array.prototype.indexOf) {
    return Array.prototype.indexOf.call(array, searchElement, startIndex);
  }

  length = array.length;
  for (i = startIndex; startIndex >= 0 && i < length; i += 1) {
    if (array[i] === searchElement) {
      return i;
    }
  }

  return -1;
}

var inArray_1 = inArray$3;

/**
 * @fileoverview Check whether the given variable is undefined or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Check whether the given variable is undefined or not.
 * If the given variable is undefined, returns true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is undefined?
 * @memberof module:type
 */
function isUndefined$2(obj) {
  return obj === undefined; // eslint-disable-line no-undefined
}

var isUndefined_1 = isUndefined$2;

/**
 * @fileoverview Get HTML element's design classes.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

var isUndefined$1 = isUndefined_1;

/**
 * Get HTML element's design classes.
 * @param {(HTMLElement|SVGElement)} element target element
 * @returns {string} element css class name
 * @memberof module:domUtil
 */
function getClass$3(element) {
  if (!element || !element.className) {
    return '';
  }

  if (isUndefined$1(element.className.baseVal)) {
    return element.className;
  }

  return element.className.baseVal;
}

var getClass_1 = getClass$3;

/**
 * @fileoverview Set className value
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

var isArray = isArray_1;
var isUndefined = isUndefined_1;

/**
 * Set className value
 * @param {(HTMLElement|SVGElement)} element - target element
 * @param {(string|string[])} cssClass - class names
 * @private
 */
function setClassName$2(element, cssClass) {
  cssClass = isArray(cssClass) ? cssClass.join(' ') : cssClass;

  cssClass = cssClass.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

  if (isUndefined(element.className.baseVal)) {
    element.className = cssClass;

    return;
  }

  element.className.baseVal = cssClass;
}

var _setClassName = setClassName$2;

/**
 * @fileoverview Add css class to element
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

var forEach$1 = forEach_1;
var inArray$2 = inArray_1;
var getClass$2 = getClass_1;
var setClassName$1 = _setClassName;

/**
 * domUtil module
 * @module domUtil
 */

/**
 * Add css class to element
 * @param {(HTMLElement|SVGElement)} element - target element
 * @param {...string} cssClass - css classes to add
 * @memberof module:domUtil
 */
function addClass(element) {
  var cssClass = Array.prototype.slice.call(arguments, 1);
  var classList = element.classList;
  var newClass = [];
  var origin;

  if (classList) {
    forEach$1(cssClass, function(name) {
      element.classList.add(name);
    });

    return;
  }

  origin = getClass$2(element);

  if (origin) {
    cssClass = [].concat(origin.split(/\s+/), cssClass);
  }

  forEach$1(cssClass, function(cls) {
    if (inArray$2(cls, newClass) < 0) {
      newClass.push(cls);
    }
  });

  setClassName$1(element, newClass);
}

var addClass_1 = addClass;

function stringToNumber(value) {
    return parseInt(value, 10);
}
function isPositionInBox(style, offsetX, offsetY) {
    var left = stringToNumber(style.left);
    var top = stringToNumber(style.top);
    var width = stringToNumber(style.width) +
        stringToNumber(style.paddingLeft) +
        stringToNumber(style.paddingRight);
    var height = stringToNumber(style.height) +
        stringToNumber(style.paddingTop) +
        stringToNumber(style.paddingBottom);
    return offsetX >= left && offsetX <= left + width && offsetY >= top && offsetY <= top + height;
}
function removeNode(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
var CLS_PREFIX = 'toastui-editor-';
function cls() {
    var names = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        names[_i] = arguments[_i];
    }
    return names.map(function (className) { return "" + CLS_PREFIX + className; }).join(' ');
}

/**
 * @fileoverview Setting element style
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

var isString = isString_1;
var forEach = forEach_1;

/**
 * Setting element style
 * @param {(HTMLElement|SVGElement)} element - element to setting style
 * @param {(string|object)} key - style prop name or {prop: value} pair object
 * @param {string} [value] - style value
 * @memberof module:domUtil
 */
function css(element, key, value) {
  var style = element.style;

  if (isString(key)) {
    style[key] = value;

    return;
  }

  forEach(key, function(v, k) {
    style[k] = v;
  });
}

var css_1 = css;

/**
 * @fileoverview Remove css class from element
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

var forEachArray$1 = forEachArray_1;
var inArray$1 = inArray_1;
var getClass$1 = getClass_1;
var setClassName = _setClassName;

/**
 * Remove css class from element
 * @param {(HTMLElement|SVGElement)} element - target element
 * @param {...string} cssClass - css classes to remove
 * @memberof module:domUtil
 */
function removeClass(element) {
  var cssClass = Array.prototype.slice.call(arguments, 1);
  var classList = element.classList;
  var origin, newClass;

  if (classList) {
    forEachArray$1(cssClass, function(name) {
      classList.remove(name);
    });

    return;
  }

  origin = getClass$1(element).split(/\s+/);
  newClass = [];
  forEachArray$1(origin, function(name) {
    if (inArray$1(name, cssClass) < 0) {
      newClass.push(name);
    }
  });

  setClassName(element, newClass);
}

var removeClass_1 = removeClass;

/**
 * @fileoverview Check element has specific css class
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

var inArray = inArray_1;
var getClass = getClass_1;

/**
 * Check element has specific css class
 * @param {(HTMLElement|SVGElement)} element - target element
 * @param {string} cssClass - css class
 * @returns {boolean}
 * @memberof module:domUtil
 */
function hasClass(element, cssClass) {
  var origin;

  if (element.classList) {
    return element.classList.contains(cssClass);
  }

  origin = getClass(element).split(/\s+/);

  return inArray(cssClass, origin) > -1;
}

var hasClass_1 = hasClass;

/**
 * @fileoverview Transform the Array-like object to Array.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

var forEachArray = forEachArray_1;

/**
 * Transform the Array-like object to Array.
 * In low IE (below 8), Array.prototype.slice.call is not perfect. So, try-catch statement is used.
 * @param {*} arrayLike Array-like object
 * @returns {Array} Array
 * @memberof module:collection
 * @example
 * // ES6
 * import toArray from 'tui-code-snippet/collection/toArray'; 
 * 
 * // CommonJS
 * const toArray = require('tui-code-snippet/collection/toArray'); 
 *
 * const arrayLike = {
 *   0: 'one',
 *   1: 'two',
 *   2: 'three',
 *   3: 'four',
 *   length: 4
 * };
 * const result = toArray(arrayLike);
 *
 * alert(result instanceof Array); // true
 * alert(result); // one,two,three,four
 */
function toArray(arrayLike) {
  var arr;
  try {
    arr = Array.prototype.slice.call(arrayLike);
  } catch (e) {
    arr = [];
    forEachArray(arrayLike, function(value) {
      arr.push(value);
    });
  }

  return arr;
}

var toArray_1 = toArray;

var WRAPPER_CLASS_NAME$1 = 'code-block-language';
var INPUT_CLASS_NANE = 'code-block-language-input';
var LIST_CLASS_NAME = 'code-block-language-list';
var LANG_ATTR = 'data-language';
var CODE_BLOCK_PADDING = 10;
function getButtonsHTML(languages) {
    return languages
        .map(function (language) { return "<button type=\"button\" data-language=\"" + language + "\">" + language + "</button>"; })
        .join('');
}
var LanguageSelectBox = /** @class */ (function () {
    function LanguageSelectBox(rootEl, eventEmitter, languages) {
        var _this = this;
        this.buttons = [];
        this.prevStoredLanguage = '';
        this.onSelectToggleButton = function (ev) {
            var target = ev.target;
            var style = getComputedStyle(target, ':after');
            var offsetX = ev.offsetX, offsetY = ev.offsetY;
            if (isPositionInBox(style, offsetX, offsetY)) {
                ev.preventDefault();
                _this.toggleFocus();
            }
        };
        this.onSelectLanguageButtons = function (ev) {
            var target = ev.target;
            var language = target.getAttribute(LANG_ATTR);
            if (language) {
                _this.selectLanguage(language);
            }
        };
        this.handleKeydown = function (ev) {
            var key = ev.key;
            if (key === 'ArrowUp') {
                _this.selectPrevLanguage();
                ev.preventDefault();
            }
            else if (key === 'ArrowDown') {
                _this.selectNextLanguage();
                ev.preventDefault();
            }
            else if (key === 'Enter' || key === 'Tab') {
                _this.storeInputLanguage();
                ev.preventDefault();
            }
            else {
                _this.hideList();
            }
        };
        this.showLangugaeSelectBox = function (_a, language) {
            var top = _a.top, right = _a.right;
            if (language) {
                _this.setLanguage(language);
            }
            _this.show();
            var width = _this.input.parentElement.getBoundingClientRect().width;
            css_1(_this.wrapper, {
                top: top + CODE_BLOCK_PADDING + "px",
                left: right - width - CODE_BLOCK_PADDING + "px",
            });
            _this.toggleFocus();
        };
        this.rootEl = rootEl;
        this.eventEmitter = eventEmitter;
        this.languages = languages;
        this.createElement();
        this.bindDOMEvent();
        this.bindEvent();
    }
    LanguageSelectBox.prototype.createElement = function () {
        this.wrapper = document.createElement('div');
        addClass_1(this.wrapper, cls(WRAPPER_CLASS_NAME$1));
        this.createInputElement();
        this.createLanguageListElement();
        this.rootEl.appendChild(this.wrapper);
        this.hide();
    };
    LanguageSelectBox.prototype.createInputElement = function () {
        var wrapper = document.createElement('span');
        addClass_1(wrapper, cls(INPUT_CLASS_NANE));
        var input = document.createElement('input');
        input.type = 'text';
        input.setAttribute('maxlength', '20');
        this.input = input;
        wrapper.appendChild(this.input);
        this.wrapper.appendChild(wrapper);
    };
    LanguageSelectBox.prototype.createLanguageListElement = function () {
        this.list = document.createElement('div');
        addClass_1(this.list, cls(LIST_CLASS_NAME));
        var buttonsContainer = document.createElement('div');
        addClass_1(buttonsContainer, 'buttons');
        buttonsContainer.innerHTML = getButtonsHTML(this.languages);
        this.buttons = toArray_1(buttonsContainer.children);
        this.list.appendChild(buttonsContainer);
        this.wrapper.appendChild(this.list);
        this.activateButtonByIndex(0);
        this.hideList();
    };
    LanguageSelectBox.prototype.bindDOMEvent = function () {
        var _this = this;
        this.wrapper.addEventListener('mousedown', this.onSelectToggleButton);
        this.input.addEventListener('keydown', this.handleKeydown);
        this.input.addEventListener('focus', function () { return _this.activateSelectBox(); });
        this.input.addEventListener('blur', function () { return _this.inactivateSelectBox(); });
        this.list.addEventListener('mousedown', this.onSelectLanguageButtons);
    };
    LanguageSelectBox.prototype.bindEvent = function () {
        this.eventEmitter.listen('showCodeBlockLanguages', this.showLangugaeSelectBox);
    };
    LanguageSelectBox.prototype.activateSelectBox = function () {
        addClass_1(this.wrapper, 'active');
        css_1(this.list, { display: 'block' });
    };
    LanguageSelectBox.prototype.inactivateSelectBox = function () {
        this.input.value = this.prevStoredLanguage;
        removeClass_1(this.wrapper, 'active');
        this.hideList();
    };
    LanguageSelectBox.prototype.toggleFocus = function () {
        if (hasClass_1(this.wrapper, 'active')) {
            this.input.blur();
        }
        else {
            this.input.focus();
        }
    };
    LanguageSelectBox.prototype.storeInputLanguage = function () {
        var selectedLanguage = this.input.value;
        this.setLanguage(selectedLanguage);
        this.hideList();
        this.eventEmitter.emit('selectLanguage', selectedLanguage);
    };
    LanguageSelectBox.prototype.activateButtonByIndex = function (index) {
        if (this.currentButton) {
            removeClass_1(this.currentButton, 'active');
        }
        if (this.buttons.length) {
            this.currentButton = this.buttons[index];
            this.input.value = this.currentButton.getAttribute(LANG_ATTR);
            addClass_1(this.currentButton, 'active');
            this.currentButton.scrollIntoView();
        }
    };
    LanguageSelectBox.prototype.selectLanguage = function (selectedLanguage) {
        this.input.value = selectedLanguage;
        this.storeInputLanguage();
    };
    LanguageSelectBox.prototype.selectPrevLanguage = function () {
        var index = inArray_1(this.currentButton, this.buttons) - 1;
        if (index < 0) {
            index = this.buttons.length - 1;
        }
        this.activateButtonByIndex(index);
    };
    LanguageSelectBox.prototype.selectNextLanguage = function () {
        var index = inArray_1(this.currentButton, this.buttons) + 1;
        if (index >= this.buttons.length) {
            index = 0;
        }
        this.activateButtonByIndex(index);
    };
    LanguageSelectBox.prototype.hideList = function () {
        css_1(this.list, { display: 'none' });
    };
    LanguageSelectBox.prototype.show = function () {
        css_1(this.wrapper, { display: 'inline-block' });
    };
    LanguageSelectBox.prototype.hide = function () {
        css_1(this.wrapper, { display: 'none' });
    };
    LanguageSelectBox.prototype.setLanguage = function (language) {
        this.prevStoredLanguage = language;
        this.input.value = language;
        var item = this.buttons.filter(function (button) { return button.getAttribute(LANG_ATTR) === language; });
        if (item.length) {
            var index = inArray_1(item[0], this.buttons);
            this.activateButtonByIndex(index);
        }
    };
    LanguageSelectBox.prototype.destroy = function () {
        removeNode(this.wrapper);
        this.eventEmitter.removeEventHandler('showCodeBlockLanguages', this.showLangugaeSelectBox);
    };
    return LanguageSelectBox;
}());

var WRAPPER_CLASS_NAME = 'ww-code-block-highlighting';
function getCustomAttrs(attrs) {
    var htmlAttrs = attrs.htmlAttrs, classNames = attrs.classNames;
    return __assign(__assign({}, htmlAttrs), { class: classNames ? classNames.join(' ') : null });
}
var CodeSyntaxHighlightView = /** @class */ (function () {
    // eslint-disable-next-line max-params
    function CodeSyntaxHighlightView(node, view, getPos, eventEmitter, languages, customAttributes) {
        var _this = this;
        this.node = node;
        this.view = view;
        this.getPos = getPos;
        this.eventEmitter = eventEmitter;
        this.languages = languages;
        this.customAttributes = customAttributes;
        this.contentDOM = null;
        this.languageSelectBox = null;
        this.onSelectLanguage = function (language) {
            if (_this.languageEditing) {
                _this.changeLanguage(language);
            }
        };
        this.onClickEditingButton = function (ev) {
            var target = ev.target;
            var style = getComputedStyle(target, ':after');
            // judge to click pseudo element with background image for IE11
            if (style.backgroundImage !== 'none' && isFunction_1(_this.getPos)) {
                var pos = _this.view.coordsAtPos(_this.getPos());
                _this.openLanguageSelectBox(pos);
            }
        };
        this.finishLanguageEditing = function () {
            if (_this.languageEditing) {
                _this.reset();
            }
        };
        this.node = node;
        this.view = view;
        this.getPos = getPos;
        this.eventEmitter = eventEmitter;
        this.languageEditing = false;
        this.languages = languages;
        this.customAttributes = customAttributes;
        this.createElement();
        this.bindDOMEvent();
        this.bindEvent();
    }
    CodeSyntaxHighlightView.prototype.createElement = function () {
        var language = this.node.attrs.language;
        var wrapper = document.createElement('div');
        wrapper.setAttribute('data-language', language || 'text');
        addClass_1(wrapper, cls(WRAPPER_CLASS_NAME));
        var pre = this.createCodeBlockElement();
        var code = pre.firstChild;
        if (language) {
            addClass_1(pre, "language-" + language);
            addClass_1(code, "language-" + language);
        }
        wrapper.appendChild(pre);
        this.dom = wrapper;
        this.contentDOM = code;
    };
    CodeSyntaxHighlightView.prototype.setAttributes = function (element, attributes) {
        Object.keys(attributes).forEach(function (attribute) {
            if (attributes === null || attributes === void 0 ? void 0 : attributes[attribute]) {
                element.setAttribute(attribute, attributes === null || attributes === void 0 ? void 0 : attributes[attribute]);
            }
        });
    };
    CodeSyntaxHighlightView.prototype.createCodeBlockElement = function () {
        var _a, _b;
        var pre = document.createElement('pre');
        var code = document.createElement('code');
        var language = this.node.attrs.language;
        var attrs = getCustomAttrs(this.node.attrs);
        if (language) {
            code.setAttribute('data-language', language);
        }
        Object.keys(attrs).forEach(function (attrName) {
            if (attrs[attrName]) {
                pre.setAttribute(attrName, attrs[attrName]);
            }
        });
        if ((_a = this.customAttributes) === null || _a === void 0 ? void 0 : _a.pre) {
            this.setAttributes(pre, this.customAttributes.pre);
        }
        if ((_b = this.customAttributes) === null || _b === void 0 ? void 0 : _b.code) {
            this.setAttributes(code, this.customAttributes.code);
        }
        pre.appendChild(code);
        return pre;
    };
    CodeSyntaxHighlightView.prototype.bindDOMEvent = function () {
        if (this.dom) {
            this.dom.addEventListener('click', this.onClickEditingButton);
            this.view.dom.addEventListener('mousedown', this.finishLanguageEditing);
            window.addEventListener('resize', this.finishLanguageEditing);
        }
    };
    CodeSyntaxHighlightView.prototype.bindEvent = function () {
        this.eventEmitter.listen('selectLanguage', this.onSelectLanguage);
        this.eventEmitter.listen('scroll', this.finishLanguageEditing);
        this.eventEmitter.listen('finishLanguageEditing', this.finishLanguageEditing);
    };
    CodeSyntaxHighlightView.prototype.openLanguageSelectBox = function (pos) {
        this.languageSelectBox = new LanguageSelectBox(this.view.dom.parentElement, this.eventEmitter, this.languages);
        this.eventEmitter.emit('showCodeBlockLanguages', pos, this.node.attrs.language);
        this.languageEditing = true;
    };
    CodeSyntaxHighlightView.prototype.changeLanguage = function (language) {
        if (isFunction_1(this.getPos)) {
            this.reset();
            var pos = this.getPos();
            var tr = this.view.state.tr;
            tr.setNodeMarkup(pos, null, { language: language });
            this.view.dispatch(tr);
        }
    };
    CodeSyntaxHighlightView.prototype.reset = function () {
        if (this.languageSelectBox) {
            this.languageSelectBox.destroy();
            this.languageSelectBox = null;
        }
        this.languageEditing = false;
    };
    CodeSyntaxHighlightView.prototype.stopEvent = function () {
        return true;
    };
    CodeSyntaxHighlightView.prototype.update = function (node) {
        if (!node.sameMarkup(this.node)) {
            return false;
        }
        this.node = node;
        return true;
    };
    CodeSyntaxHighlightView.prototype.destroy = function () {
        this.reset();
        if (this.dom) {
            this.dom.removeEventListener('click', this.onClickEditingButton);
            this.view.dom.removeEventListener('mousedown', this.finishLanguageEditing);
            window.removeEventListener('resize', this.finishLanguageEditing);
        }
        this.eventEmitter.removeEventHandler('selectLanguage', this.onSelectLanguage);
        this.eventEmitter.removeEventHandler('scroll', this.finishLanguageEditing);
        this.eventEmitter.removeEventHandler('finishLanguageEditing', this.finishLanguageEditing);
    };
    return CodeSyntaxHighlightView;
}());
function createCodeSyntaxHighlightView(languages, customAttributes) {
    return function (node, view, getPos, emitter) {
        return new CodeSyntaxHighlightView(node, view, getPos, emitter, languages, customAttributes);
    };
}

function codeSyntaxHighlightPlugin(context, options) {
    if (options) {
        var eventEmitter = context.eventEmitter;
        var prism_1 = options.highlighter, customAttributes = options.customAttributes;
        eventEmitter.addEventType('showCodeBlockLanguages');
        eventEmitter.addEventType('selectLanguage');
        eventEmitter.addEventType('finishLanguageEditing');
        var languages_1 = prism_1.languages;
        var registerdlanguages = Object.keys(languages_1).filter(function (language) { return !isFunction_1(languages_1[language]); });
        return {
            toHTMLRenderers: getHTMLRenderers(prism_1),
            wysiwygPlugins: [function () { return codeSyntaxHighlighting(context, prism_1); }],
            wysiwygNodeViews: {
                codeBlock: createCodeSyntaxHighlightView(registerdlanguages, customAttributes),
            },
        };
    }
    return {};
}

// Prevent to highlight all code elements automatically.
// @link https://prismjs.com/docs/Prism.html#.manual
// eslint-disable-next-line no-undefined
if (typeof window !== undefined) {
    window.Prism = window.Prism || {};
    window.Prism.manual = true;
}

export { codeSyntaxHighlightPlugin as default };
