var regex = {};

function getReg( className ){
	var reg = regex[className];

	if ( !reg ){
		reg = new RegExp('(?:^|\\s)'+className+'(?!\\S)');
		regex[className] = reg;
	}

	return reg;
}

function _find( el, query, res ){
	var i, c,
		selection = el.querySelectorAll( query );

	for( i = 0, c = selection.length; i < c; i++ ){
		res.push( selection[i] );
	}
}

class Collection {
	constructor( query ){
		this.elements = [];
		if ( query ){
			this.find( query );
		}
	}

	find( query ){
		var i, c,
			elements;

		elements = this.elements.slice(0);
		this.elements.length = 0;

		if ( elements.length ){
			for( i = 0, c = elements.length; i < c; i++ ){
				_find( elements[i], query, this.elements );
			}
		}else{
			_find( document.body, query, this.elements );
		}
		

		return this;
	}

	addClass( className ){
		var i, c,
			node,
			baseClass,
			reg = getReg( className ),
			elements = this.elements;

		for( i = 0, c = elements.length; i < c; i++ ){
			node = elements[i];
			baseClass = node.getAttribute('class') || '';

			if ( !baseClass.match(reg) ){
				node.setAttribute( 'class', baseClass+' '+className );
			}
		}

		return this;
	}

	removeClass( className ){
		var i, c,
			node,
			reg = getReg( className ),
			elements = this.elements;

		for( i = 0, c = elements.length; i < c; i++ ){
			node = elements[i];
			node.setAttribute( 'class', (node.getAttribute('class')||'').replace(reg,'') );
		}

		return this;
	}
}

module.exports = Collection;