// Look for a rel payment link
var elem = document.querySelector('link[rel=payment]');
var href;

if (elem) {
    href = elem.getAttribute('href');
    if (href) {
        chrome.extension.sendRequest({relPaymentLink: href}, function(response) {
        });
    }
}

// If no rel payment link was found, continue looking for a canonical URL
if (!href) {
    elem = document.querySelector('link[rel=canonical]');

    if (elem) {
        href = elem.getAttribute('href');
        if (href) {
            if (href[0] === '/') {
                href = location.origin + href;
            }
            chrome.extension.sendRequest({canonicalUrl: href}, function(response) {
            });
        }
    }
}
