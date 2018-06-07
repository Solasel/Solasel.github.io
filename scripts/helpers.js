function output() {
	"use strict";
	var win = window.open();
	win.document.write('<!DOCTYPE html>' +
		'<html>' +

		'<head>' +
			'<title>Results</title>' +
			'<link rel="stylesheet" type="text/css" href="../styles/main.css">' +
			'<meta charset="UTF-8">' +
			'<meta name="description" content="Your Output!">' +
			'<meta name="author" content="William Walker">' +
			'<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
		'</head>' +

		'<body style="padding: 1vh 1vw;">' +
			'<span>' + alg() + '</span>' +
		'</body>' +

		'</html>');
}
