require(['owd/app'], function(app) {
	var a = app.create({
		name: 'about',
		run: function() {
			alert('run')
		}
	});
	a.run();
});