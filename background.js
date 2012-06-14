var lookupUrl = undefined;
var relPaymentLink = undefined;
var canonicalUrl = undefined;

// Listen for any changes to the URL of any tab. If URL
// exists, we show our extension icon in the address field.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    lookupUrl = undefined;

    if (isWikipedia(tab.url)) {
        lookupUrl = createWikipediaAutoSubmitUrl(tab.url, tab.title);
        chrome.pageAction.show(tabId);
    } else {
        showFlattrButtonIfThingExistsForUrl(tab.url, tabId, function(url) {
            lookupUrl = url;
        });
    }
});

function showFlattrButtonIfThingExistsForUrl(url, tabId, callback) {
    findFlattrThingForUrl(url, function(thing) {
        var url;

        if (thing.message === 'flattrable') {
            url = 'https://flattr.com/submit/auto?url=' + escape(url);
        } else if (thing) {
            url = thing.link;
        }

        if (url) {
            chrome.pageAction.show(tabId);
            callback(url);
        }
    });
}

// See if contentscript.js finds a rel payment link or canonical url. 
// Use these if the regular flattr API lookup does not find a matching thing.
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.relPaymentLink) {
        relPaymentLink = request.relPaymentLink;
        chrome.pageAction.show(sender.tab.id);
    } else if (request.canonicalUrl) {
        showFlattrButtonIfThingExistsForUrl(request.canonicalUrl, sender.tab.id, function(url) {
            canonicalUrl = url;
        });
    }
});

// When the icon in address field is clicked, we open the flattr.com
// thing page in a new tab/window.
chrome.pageAction.onClicked.addListener(function (tab) {
    window.open(lookupUrl || relPaymentLink || canonicalUrl);
});
