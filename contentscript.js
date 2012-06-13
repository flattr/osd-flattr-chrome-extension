var elem = document.querySelector('link[rel=payment]');
var href;

if (elem) {
    href = elem.getAttribute('href');
    if (href) {
        chrome.extension.sendRequest({relPaymentLink: href}, function(response) {
        });
    }
}
