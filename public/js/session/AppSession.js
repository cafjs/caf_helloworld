var cli = require('caf_cli');
var url = require('url');

var CA_NAME =  'antonio-c2';
var currentUrl = url.parse(window.location.href);
if (currentUrl.protocol === 'http:') {
    currentUrl.protocol = 'ws:';
} else if (currentUrl.protocol === 'https:') {
    currentUrl.protocol = 'wss:';
}
var WS_URL = url.format(currentUrl);
console.log('ca: '+ CA_NAME + ' ' + WS_URL);

module.exports = new cli.Session(WS_URL, CA_NAME);
