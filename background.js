var url;

// Listen for any changes to the URL of any tab. If URL
// exists, we show our extension icon in the address field.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (isWhiteListed(tab.url)) {
        if (isWikipedia(tab.url)) {
            url = createWikipediaAutoSubmitUrl(tab.url, tab.title);
            chrome.pageAction.show(tabId);
        } else {
            findFlattrThingForUrl(tab.url, function(thing) {
                if (thing) {
                    url = thing.link;
                    chrome.pageAction.show(tabId);
                }
            });
        }
    }
});

// When the icon in address field is clicked, we open the flattr.com
// thing page in a new tab/window.
chrome.pageAction.onClicked.addListener(function (tab) {
    window.open(url);
});
