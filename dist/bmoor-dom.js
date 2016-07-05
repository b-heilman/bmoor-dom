var bmoorDom =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Collection = __webpack_require__(2);

	module.exports = {
		select: function select(query) {
			return new Collection(query);
		},
		element: __webpack_require__(3),
		window: __webpack_require__(4),
		Collection: Collection
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var regex = {};

	function getReg(className) {
		var reg = regex[className];

		if (!reg) {
			reg = new RegExp('(?:^|\\s)' + className + '(?!\\S)');
			regex[className] = reg;
		}

		return reg;
	}

	function _find(el, query, res) {
		var i,
		    c,
		    selection = el.querySelectorAll(query);

		for (i = 0, c = selection.length; i < c; i++) {
			res.push(selection[i]);
		}
	}

	var Collection = function () {
		function Collection(query) {
			_classCallCheck(this, Collection);

			this.elements = [];
			if (query) {
				this.find(query);
			}
		}

		_createClass(Collection, [{
			key: 'find',
			value: function find(query) {
				var i, c, elements;

				elements = this.elements.slice(0);
				this.elements.length = 0;

				if (elements.length) {
					for (i = 0, c = elements.length; i < c; i++) {
						_find(elements[i], query, this.elements);
					}
				} else {
					_find(document.body, query, this.elements);
				}

				return this;
			}
		}, {
			key: 'addClass',
			value: function addClass(className) {
				var i,
				    c,
				    node,
				    baseClass,
				    reg = getReg(className),
				    elements = this.elements;

				for (i = 0, c = elements.length; i < c; i++) {
					node = elements[i];
					baseClass = node.getAttribute('class') || '';

					if (!baseClass.match(reg)) {
						node.setAttribute('class', baseClass + ' ' + className);
					}
				}

				return this;
			}
		}, {
			key: 'removeClass',
			value: function removeClass(className) {
				var i,
				    c,
				    node,
				    reg = getReg(className),
				    elements = this.elements;

				for (i = 0, c = elements.length; i < c; i++) {
					node = elements[i];
					node.setAttribute('class', (node.getAttribute('class') || '').replace(reg, ''));
				}

				return this;
			}
		}]);

		return Collection;
	}();

	module.exports = Collection;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var win = __webpack_require__(4);

	function getBoundryBox(element) {
		return element.getBoundingClientRect();
	}

	function centerOn(element, target, doc) {
		var el = getBoundryBox(element),
		    targ = getBoundryBox(target),
		    pos = win.getScrollPosition(doc);

		if (!doc) {
			doc = document;
		}

		element.style.top = pos.top + targ.top + targ.height / 2 - el.height / 2;
		element.style.left = pos.left + targ.left + targ.width / 2 - el.width / 2;
		element.style.right = '';
		element.style.bottom = '';

		element.style.position = 'absolute';
		doc.body.appendChild(element);
	}

	function showOn(element, target, doc) {
		var direction,
		    targ = getBoundryBox(target),
		    x = targ.x + targ.width / 2,
		    y = targ.y + targ.height / 2,
		    centerX = window.innerWidth / 2,
		    centerY = window.innerHeight / 2,
		    pos = win.getScrollPosition(doc);

		if (!doc) {
			doc = document;
		}

		if (x < centerX) {
			// right side has more room
			direction = 'r';
			element.style.left = pos.left + targ.right;
			element.style.right = '';
		} else {
			// left side has more room
			//element.style.left = targ.left - el.width - offset;
			direction = 'l';
			element.style.right = window.innerWidth - targ.left - pos.left;
			element.style.left = '';
		}

		if (y < centerY) {
			// more room on bottom
			direction = 'b' + direction;
			element.style.top = pos.top + targ.bottom;
			element.style.bottom = '';
		} else {
			// more room on top
			direction = 't' + direction;
			element.style.bottom = window.innerHeight - targ.top - pos.top;
			element.style.top = '';
		}

		element.style.position = 'absolute';
		doc.body.appendChild(element);

		return direction;
	}

	function bringForward(element) {
		if (element.parentNode) {
			element.parentNode.appendChild(element);
		}
	}

	function triggerEvent(element, eventName, eventData) {
		var doc, event, EventClass;

		// Make sure we use the ownerDocument from the provided node to avoid cross-window problems
		if (element.ownerDocument) {
			doc = element.ownerDocument;
		} else if (element.nodeType === 9) {
			// the node may be the document itself, nodeType 9 = DOCUMENT_NODE
			doc = element;
		} else if (typeof document !== 'undefined') {
			doc = document;
		} else {
			throw new Error('Invalid node passed to fireEvent: ' + element.id);
		}

		if (element.dispatchEvent) {
			try {
				// modern, except for IE still? https://developer.mozilla.org/en-US/docs/Web/API/Event
				// I ain't doing them all
				// slightly older style, give some backwards compatibility
				switch (eventName) {
					case 'click':
					case 'mousedown':
					case 'mouseup':
						EventClass = MouseEvent;
						break;

					case 'focus':
					case 'blur':
						EventClass = FocusEvent; // jshint ignore:line
						break;

					case 'change':
					case 'select':
						EventClass = UIEvent; // jshint ignore:line
						break;

					default:
						EventClass = CustomEvent;
				}

				if (!eventData) {
					eventData = { 'view': window, 'bubbles': true, 'cancelable': true };
				} else {
					if (eventData.bubbles === undefined) {
						eventData.bubbles = true;
					}
					if (eventData.cancelable === undefined) {
						eventData.cancelable = true;
					}
				}

				event = new EventClass(eventName, eventData);
			} catch (ex) {
				// slightly older style, give some backwards compatibility
				switch (eventName) {
					case 'click':
					case 'mousedown':
					case 'mouseup':
						EventClass = 'MouseEvents';
						break;

					case 'focus':
					case 'change':
					case 'blur':
					case 'select':
						EventClass = 'HTMLEvents';
						break;

					default:
						EventClass = 'CustomEvent';
				}
				event = doc.createEvent(EventClass);
				event.initEvent(eventName, true, true);
			}

			event.$synthetic = true; // allow detection of synthetic events

			element.dispatchEvent(event);
		} else if (element.fireEvent) {
			// IE-old school style
			event = doc.createEventObject();
			event.$synthetic = true; // allow detection of synthetic events
			element.fireEvent('on' + eventName, event);
		}
	}

	module.exports = {
		getBoundryBox: getBoundryBox,
		bringForward: bringForward,
		showOn: showOn,
		centerOn: centerOn,
		triggerEvent: triggerEvent
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	module.exports = {
		getScrollPosition: function getScrollPosition(doc) {
			if (!doc) {
				doc = document;
			}

			return {
				left: window.pageXOffset || (doc.documentElement || doc.body).scrollLeft,
				top: window.pageYOffset || (doc.documentElement || doc.body).scrollTop
			};
		}
	};

/***/ }
/******/ ]);