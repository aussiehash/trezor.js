'use strict';

var extend = require('extend'),
    http = require('../http');

//
// HTTP transport.
//
var HttpTransport = function (url) {
    this._url = url;
};

HttpTransport.create = function (url) {
    return HttpTransport.status(url).then(function () {
        return new HttpTransport(url);
    });
};

HttpTransport.status = function (url) {
    return http({
        method: 'GET',
        url: url
    });
};

// @deprecated
HttpTransport.connect = HttpTransport.status;

HttpTransport.prototype._request = function (options) {
    return http(extend(options, {
        url: this._url + options.url
    }));
};

HttpTransport.prototype.configure = function (config) {
    return this._request({
        method: 'POST',
        url: '/configure',
        body: config
    });
};

HttpTransport.prototype.enumerate = function (wait) {
    return this._request({
        method: 'GET',
        url: wait ? '/listen' : '/enumerate'
    });
};

HttpTransport.prototype.acquire = function (device) {
    return this._request({
        method: 'POST',
        url: '/acquire/' + device.path
    });
};

HttpTransport.prototype.release = function (sessionId) {
    return this._request({
        method: 'POST',
        url: '/release/' + sessionId
    });
};

HttpTransport.prototype.call = function (sessionId, type, message) {
    return this._request({
        method: 'POST',
        url: '/call/' + sessionId,
        body: {
            type: type,
            message: message
        }
    });
};

module.exports = HttpTransport;
