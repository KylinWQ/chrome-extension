// Store CSS data in the "local" storage area.
const storage = chrome.storage.local;
const listDiv = document.querySelector('div.list');
const message = document.querySelector('div.message');

loadLinks();

function loadLinks() {
    storage.get('links', function (items) {
        if (items.links) {
            let linksHtml = "";
            items.links.forEach(function (link) {
                linksHtml += '<a href="' + link.url + '" target="_blank" style="background-image: url(\'' + faviconURL(link.url) + '\');" title="' + link.name + '[' + link.url + ']">' + link.name + '</a>';
            });
            listDiv.innerHTML = linksHtml;
        }
    });
}

function faviconURL(u) {
    const url = new URL(chrome.runtime.getURL('/_favicon/'));
    url.searchParams.set('pageUrl', u); // this encodes the URL as well
    url.searchParams.set('size', '32');
    return url.toString();
}