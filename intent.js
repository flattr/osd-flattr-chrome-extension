var intent = window.intent || window.webkitIntent;
if (intent && intent.type === 'text/uri-list') {
	window.location = 'https://flattr.com/submit/auto?url=' + encodeURI(intent.data);
}
