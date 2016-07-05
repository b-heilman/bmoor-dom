var win = require('./window.js');

function getBoundryBox( element ){
	return element.getBoundingClientRect();
}

function centerOn( element, target, doc ){
	var el = getBoundryBox(element),
		targ = getBoundryBox( target ),
		pos = win.getScrollPosition( doc );

	if ( !doc ){
		doc = document;
	}

	element.style.top = pos.top + targ.top + targ.height/2 - el.height / 2;
	element.style.left = pos.left + targ.left + targ.width/2 - el.width / 2;
	element.style.right = '';
	element.style.bottom = '';

	element.style.position = 'absolute';
	doc.body.appendChild( element );
}

function showOn( element, target, doc ){
	var direction,
		targ = getBoundryBox( target ),
		x = targ.x + targ.width / 2,
		y = targ.y + targ.height / 2,
		centerX = window.innerWidth / 2,
		centerY = window.innerHeight / 2,
		pos = win.getScrollPosition( doc );

	if ( !doc ){
		doc = document;
	}

	if ( x < centerX ){
		// right side has more room
		direction = 'r';
		element.style.left = pos.left + targ.right;
		element.style.right = '';
	}else{
		// left side has more room
		//element.style.left = targ.left - el.width - offset;
		direction = 'l';
		element.style.right = window.innerWidth - targ.left - pos.left;
		element.style.left = '';
	}

	if ( y < centerY ){
		// more room on bottom
		direction = 'b' + direction;
		element.style.top = pos.top + targ.bottom;
		element.style.bottom = '';
	}else{
		// more room on top
		direction = 't' + direction;
		element.style.bottom = window.innerHeight - targ.top - pos.top;
		element.style.top = '';
	}
	
	element.style.position = 'absolute';
	doc.body.appendChild( element );

	return direction;
}

function bringForward( element ){
	if ( element.parentNode ){
		element.parentNode.appendChild( element );
	}
}

function triggerEvent( element, eventName, eventData ){
	var doc,
		event,
		EventClass;
		
	// Make sure we use the ownerDocument from the provided node to avoid cross-window problems
	if (element.ownerDocument){
		doc = element.ownerDocument;
	}else if (element.nodeType === 9){
		// the node may be the document itself, nodeType 9 = DOCUMENT_NODE
		doc = element;
	}else if ( typeof document !== 'undefined' ){
		doc = document;
	}else{
		throw new Error('Invalid node passed to fireEvent: ' + element.id);
	}

	if ( element.dispatchEvent ){
		try{
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

			if ( !eventData ){
				eventData = { 'view': window, 'bubbles': true, 'cancelable': true };
			}else{
				if ( eventData.bubbles === undefined ){
					eventData.bubbles = true;
				}
				if ( eventData.cancelable === undefined ){
					eventData.cancelable = true;
				}
			}

			event = new EventClass( eventName, eventData );
		}catch( ex ){
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
	}else if (element.fireEvent){
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
	triggerEvent
};