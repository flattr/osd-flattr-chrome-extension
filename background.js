var lookupUrl = undefined;
var relPaymentLink = undefined;

// Listen for any changes to the URL of any tab. If URL
// exists, we show our extension icon in the address field.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    lookupUrl = undefined;

    if (isWikipedia(tab.url)) {
        lookupUrl = createWikipediaAutoSubmitUrl(tab.url, tab.title);
        chrome.pageAction.show(tabId);
    } else {
        showFlattrButtonIfThingExistsForUrl(tab.url, tabId);
    }
});

function showFlattrButtonIfThingExistsForUrl(url, tabId, callback) {
    findFlattrThingForUrl(url, function(thing) {
        if (thing.message === 'flattrable') {
            lookupUrl = 'https://flattr.com/submit/auto?url=' + escape(url);
        } else if (thing) {
            lookupUrl = thing.link;
        }
        if (lookupUrl) {
            chrome.pageAction.show(tabId);
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
        showFlattrButtonIfThingExistsForUrl(request.canonicalUrl, sender.tab.id);
    }
});

// When the icon in address field is clicked, we open the flattr.com
// thing page in a new tab/window.
chrome.pageAction.onClicked.addListener(function (tab) {
    window.open(lookupUrl || relPaymentLink);
});
