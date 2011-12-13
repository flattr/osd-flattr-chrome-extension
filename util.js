var WHITELIST = [
    "wikipedia.org",
    "twitter.com",
    "youtube.com",
    "youtify.com",
    "jamendo.com",
    "soundcloud.com",
    "grooveshark.com",
    "github.com",
    "flattr.com"
];

function createWikipediaAutoSubmitUrl(url, title) {
    var url = "https://flattr.com/submit/auto?user_id=USERNAME&url=URL&title=TITLE&description=DESCRIPTION&language=LANGUAGE&tags=TAGS&hidden=HIDDEN&category=CATEGORY";
    url = url.replace('USERNAME', 'WikimediaFoundation');
    url = url.replace('URL', encodeURIComponent(url));
    url = url.replace('TITLE', encodeURIComponent(title));
    url = url.replace('DESCRIPTION', '');
    url = url.replace('TAGS', 'wikipedia,article');
    url = url.replace('LANGUAGE', 'en_GB');
    url = url.replace('HIDDEN', '0');
    url = url.replace('CATEGORY', 'text');
    return url;
}

function isWikipedia(url) {
    return url.match("(http|https)://(.*\.)?(wikipedia.org)");
}

function isWhiteListed(url) {
    var i = 0,
        domain;

    for (i = 0; i < WHITELIST.length; i += 1) {
        domain = WHITELIST[i];
        if (url.match("(http|https)://(.*?\.)?(" + domain + ")")) {
            return true;
        }
    }

    return false;
}

function findFlattrThingForUrl(url, callback) {
    var xhr = new XMLHttpRequest(),
        lookupUrl = 'https://api.flattr.com/rest/v2/things/lookup?q=' + encodeURIComponent(url);

    xhr.open("GET", lookupUrl, true); // HEAD makes a 400 Bad Request...
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200 || xhr.status == 304) {
            var response = JSON.parse(xhr.responseText);
            if (response.message !== "not_found") {
                callback(response);
            } else {
                callback(false);
            }
        }
    };
    xhr.send();
}
