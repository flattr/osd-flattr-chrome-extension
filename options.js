var POPULAR_DOMAINS = [
    "youtube.com",
    "twitter.com",
    "soundcloud.com",
    "youtify.com",
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

function add() {
    var elem = document.querySelector("#addForm input"),
        domains = JSON.parse(localStorage["whiteListDomains"] || JSON.stringify(POPULAR_DOMAINS));

    domains.push(elem.value);
    localStorage['whiteListDomains'] = JSON.stringify(domains);

    elem.value = '';

    reloadList();
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
