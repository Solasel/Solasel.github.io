function output() {
	"use strict";
	var win = window.open();
	win.document.write('<!DOCTYPE html>' +
		'<html>' +

		'<head>' +
			
		'</head>' +

		'<body style="padding: 1vh 1vw; overflow: scroll">' +
			'<span>' + alg() + '</span>' +
		'</body>' +

		'</html>');
}
