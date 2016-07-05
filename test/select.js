describe('bmoor-dom.select', function(){
	var el;

	beforeEach(function(){
		document.body.innerHTML = '<div><span id="hello"></span></div>';
	});

	it('should allow adding classes', function(){
		var c = bmoorDom.select('#hello'),
			el = c.elements[0];

		c.addClass( 'test' );

		expect( el.className ).toBe( ' test' );
	});

	it('should allow removing classes', function(){
		var c = bmoorDom.select('#hello'),
			el = c.elements[0];

		el.className = 'test';
		c.removeClass( 'test' );

		expect( el.className ).toBe( '' );
	});
});