if (window.intent && window.intent.type.indexOf('text/') === 0) {
	window.location = 'https://flattr.com/submit/auto?url=' + encodeURI(window.intent.data);
}
