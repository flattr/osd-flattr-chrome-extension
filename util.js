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
        var langCode = url.match("(http|https)://(.*)\.(wikipedia.org)")[2];
        if (langCode in map) {
            ret = map[langCode];
        }
    } catch (e) {
    }

    return ret;
}

function createWikipediaAutoSubmitUrl(url, title) {
    return "https://flattr.com/submit/auto?user_id=WikimediaFoundation&url=" + encodeURIComponent(url) + "&title=" + encodeURIComponent(title) + "&language=" + getFlattrLangCodeForWikipediaUrl(url) + "&tags=wikipedia,article&hidden=0&category=text";
}

function isWikipedia(url) {
    return url.match("(http|https)://(.*\.)?(wikipedia.org)");
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
