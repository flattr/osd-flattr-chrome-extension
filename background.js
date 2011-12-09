var thingUrl;

var WHITELIST = [
    "wikipedia.org",
    "youtube.com",
    "twitter.com",
    "youtify.com",
    "soundcloud.com",
    "grooveshark.com",
    "github.com",
    "flattr.com"
];

function isBlocked(url) {
    var i = 0,
        domain;

    for (i = 0; i < WHITELIST.length; i += 1) {
        domain = WHITELIST[i];
        if (url.match("(http|https)://(www.)?(" + domain + ")")) {
            return false;
        }
    }

    return true;
}

function showIconIfAnyUrlExists(url, tabId) {
    var xhr = new XMLHttpRequest(),
        lookupUrl = 'https://api.flattr.com/rest/v2/things/lookup?q=' + encodeURIComponent(url);

    xhr.open("GET", lookupUrl, true); // HEAD makes a 400 Bad Request...
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200 || xhr.status == 304) {
                var response = JSON.parse(xhr.responseText);
                if (response.message !== "not_found") {
                    chrome.pageAction.show(tabId);
                    thingUrl = response.link;
                }
            }
        }
    }
    xhr.send();
}

// Listen for any changes to the URL of any tab. If URL
// exists, we show our extension icon in the address field.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    var url = tab.url;

    if (isBlocked(url) === false) {
        showIconIfAnyUrlExists(url, tabId);
    }
});

// When the icon in address field is clicked, we open the flattr.com
// thing page in a new tab/window.
chrome.pageAction.onClicked.addListener(function (tab) {
    window.open(thingUrl);
});
