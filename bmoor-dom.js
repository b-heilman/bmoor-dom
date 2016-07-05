var Collection = require('./src/Collection.js');
	
module.exports = {
	select: function( query ){
		return new Collection( query )
	},
	element: require('./src/element.js'),
	window: require('./src/window.js'),
	Collection: Collection
};