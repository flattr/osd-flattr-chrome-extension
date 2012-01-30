// This script listens for new tab events & inspects the url for flattr'ability
//
// If a flattr thing is found, an icon is displayed in the browser url bar,
//
// When the icon in address field is clicked, we open the flattr.com thing page
// in a new tab/window.

// Global variables
var furls = [];		// associative object containing flattr'able urls
var debug = false;	// log a bunch of debug info to the console
var entries = 0;	// debug var to track total # of urls checked via the API

// debug logging
function dlog(str) {
	if (debug) {
		console.log('entry:'+entries+' | '+str);
	}
}

// Listen for any changes to the URL of any tab.
// If URL exists, we show our extension icon in the address field.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

	// Take no action for non http urls
	if (tab.url.indexOf('http') != 0) {
		dlog('non http url:'+tab.url);
		return;
	}

	// In order to avoid duplicate requests, wait until the tab load is complete
	// http://code.google.com/chrome/extensions/tabs.html#event-onUpdated
	if (changeInfo.status != 'complete') {
		dlog('non complete tab status for:'+tab.url);
		return;
	}

	if (isWikipedia(tab.url)) {
		// strip hashes for wikipedia urls, results in one flattr thing per page
		furls[escape(tab.url)] =
			createWikipediaAutoSubmitUrl(stripHashes(tab.url), tab.title);
		chrome.pageAction.show(tabId);
	} else {
		entries++; // debug

		// Grab retries from browser storage, defaults to 5
		// See ./options/index.html for documentation
		retries = localStorage['retry_times'];
		if (isNaN(retries) || retries < -1 || retries > 9) {
			retries = 5;
		}

		// Call the flattr API (possibly recursively) to search for tab.url
		findFlattrThingForUrl(tab.url, retries, function(thing) {
			// callback function stores the link & sets the icon in the url bar
			if (thing) {
				furls[escape(tab.url)] = thing.link;
				chrome.pageAction.show(tabId);
			}
		});
	}
});

// When the icon in address field is clicked, we
// open the flattr.com thing page in a new tab/window.
chrome.pageAction.onClicked.addListener(function (tab) {
	// pull the appropriate flattr url from the global array
	furl = furls[escape(tab.url)];
	if (furl) {
		window.open(furl);
	}
});
