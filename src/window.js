module.exports = {
	getScrollPosition: function( doc ){
		if ( !doc ){
			doc = document;
		}

		return {
			left:  window.pageXOffset || ( doc.documentElement || doc.body ).scrollLeft,
			top: window.pageYOffset || ( doc.documentElement || doc.body ).scrollTop
		};
	}
};