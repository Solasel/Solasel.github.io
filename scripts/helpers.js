function output() {
	"use strict";
	var win = window.open();
	win.document.write('<!DOCTYPE html>' +
		'<html>' +

		'<head>' +
			'<title>Results</title>' +
			'<meta charset="UTF-8">' +
			'<meta name="description" content="Your Output!">' +
			'<meta name="author" content="William Walker">' +
		'</head>' +

		'<body style="padding: 1vh 1vw; overflow: scroll">' +
			'<span>' + alg() + '</span>' +
		'</body>' +

		'</html>');
}
