var POPULAR_DOMAINS = [
    "wikipedia.org",
    "youtube.com",
    "twitter.com",
    "youtify.com",
    "soundcloud.com",
    "grooveshark.com",
    "github.com",
    "flattr.com"
];

function arrayContains(a, v) {
    var i;

    for (i = 0; i < a.length; i += 1) {
        if (a[i] === v) {
            return true;
        }
    }

    return false;
}

function keyUpCallback(e) {
    if (e.keyCode === 13) {
        add();
    }
}

function excludeFromArray(a, v) {
    var i,
        ret = [];

    for (i = 0; i < a.length; i += 1) {
        if (a[i] === v) {
            continue;
        }
        ret.push(a[i]);
    }

    return ret;
}

function normalizeUrl(url) {
    console.log(url);
    if (url.match('http://')) {
        url = url.substring(7);
    }
    if (url.match('www.')) {
        url = url.substring(4);
    }
    if (url[url.length-1] === '/') {
        url = url.substring(0, url.length-1);
    }
    return url;
}

function add() {
    var elem = document.querySelector("#addForm input"),
        url = normalizeUrl(elem.value),
        domains = JSON.parse(localStorage["whiteListDomains"] || JSON.stringify(POPULAR_DOMAINS));

    elem.value = '';

    if (url.length > 0 & !arrayContains(domains, url)) {
        domains.push(url);
        localStorage['whiteListDomains'] = JSON.stringify(domains);
        reloadList();
    }
}

function toggleWhiteList(elem) {
    localStorage['enableWhiteList'] = JSON.stringify(elem.checked);
}

function reloadList() {
    document.getElementById("whiteListDomains").innerHTML = '';
    renderDomains();
}

function removeFromWhiteList(domain) {
    var domains = JSON.parse(localStorage['whiteListDomains'] || '[]');
    domains = excludeFromArray(domains, domain);
    localStorage['whiteListDomains'] = JSON.stringify(domains);
    reloadList();
}

function createLi(domain, whiteListDomains) {
    var li = document.createElement('li'),
        removeButton = document.createElement('button'),
        span = document.createElement('span');

    removeButton.innerHTML = 'Remove';
    removeButton.setAttribute('onclick', 'removeFromWhiteList("' + domain + '")');
    span.innerHTML = domain;

    li.appendChild(removeButton);
    li.appendChild(span);

    return li;
}

function renderDomains() {
    var ul = document.getElementById("whiteListDomains"),
        domains = JSON.parse(localStorage["whiteListDomains"] || JSON.stringify(POPULAR_DOMAINS)),
        i;

    for (i = 0; i < domains.length; i += 1) {
        ul.appendChild(createLi(domains[i], domains));
    }
}

function main() {
    var checkbox = document.getElementById("enableWhiteList");
    renderDomains();
}
