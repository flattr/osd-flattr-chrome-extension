// Utility functions used to help determine flattr'ability

function getFlattrLangCodeForWikipediaUrl(url) {
	var ret = 'en_GB';
	var map = {
		'en': 'en_GB',
		'es': 'es_ES',
		'de': 'de_DE',
		'fr': 'fr_FR',
		'it': 'it_IT',
		'pt': 'pt_PT',
		'pl': 'pl_PL',
		'ja': 'ja_JP',
		'ru': 'ru_RU',
		'zh': 'zh_CN',
		'sv': 'sv_SE',
		'dk': 'da_DK',
		'fi': 'fi_FI',
		'no': 'no_NO',
	};

	try {
		var langCode = url.match('(http|https)://(.*)\.(wikipedia.org)')[2];
		if (langCode in map) {
			ret = map[langCode];
		}
	} catch (e) { }

	return ret;
}

function createWikipediaAutoSubmitUrl(url, title) {
	return 'https://flattr.com/submit/auto?user_id=WikimediaFoundation&url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) + '&language=' + getFlattrLangCodeForWikipediaUrl(url) + '&tags=wikipedia,article&hidden=0&category=text';
}

function isWikipedia(url) {
	return url.match('(http|https)://(.*\.)?(wikipedia.org)');
}

// Strip hash anchors - they broke the furls array when used for an index
// also, arguably better for wikipedia, at least from a load standpoint
function stripHashes(url) {
	hashLoc = url.indexOf('#')
	if (hashLoc != -1) {
		return url.substring(0,hashLoc);
	}
	return url;
}

/*
 * This is a recursive function which queries the flattr API for the 'url' param
 * The base case is recRetries < 0, in which case the callback is exec'd
 * When recRetries = 0, the root url of the domain is tested for flattr'ability
 * When recRetries > 1, the function will recurse until a match is found
*/
function findFlattrThingForUrl(url, recRetries, callback) {
	var xhr = new XMLHttpRequest(),
	lookupUrl = 'https://api.flattr.com/rest/v2/things/lookup?q=' +
	encodeURIComponent(url);

	xhr.open('GET', lookupUrl, true); // HEAD makes a 400 Bad Request...
	dlog('requesting:'+lookupUrl);

	// When the API call returns
	xhr.onreadystatechange = function() {

		if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
			var response = JSON.parse(xhr.responseText);

			// If we have a match, we're done, callback to show the plugin icon
			if (response.message !== 'not_found') {
				dlog('match on:'+url);
				callback(response);
			} else {
				// Recursion base case; no match found, so no-op
				if (recRetries < 0) {
					callback(false);
				}

				// Make the final recursive call with the root domain url
				if (0 == recRetries) {
					recRetries--;
					// grab the root of the url
					root = url.match('^https?://.*?/');

					// If no domain was found, or the root was already looked up
					if (!root || root == url) {
						return callback(false);
					}

					// Make the final recursive call with the domain root
					dlog('recRetries:'+recRetries+' | root:'+root);
					findFlattrThingForUrl(root, recRetries, callback);
				}

				// Recurse to find a flattr'able url one level up
				if (recRetries > 0) {
					recRetries--;
					domain = url;
					if (url.indexOf('https://') == 0) {
						domain = url.substring(8);
					}
					if (url.indexOf('http://') == 0) {
						domain = url.substring(7);
					}
					parts = domain.split('/');
					numParts = parts.length - 1;
					if (numParts > 0) {
						searchUrl = url.substring(
							0, url.lastIndexOf(parts[numParts]) - 1
						);
						dlog('recRetries:'+recRetries+' | recurse:'+searchUrl);
						// Make a recursive call with the trimmed url
						findFlattrThingForUrl(searchUrl, recRetries, callback);
					}
				}
			}
		}
	};
	xhr.send();
}
