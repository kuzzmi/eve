var Q = require('q'),
    utils = require('../scommon/utils');

function TimeIntent() {};

TimeIntent.prototype.exec = function(callback) {
    var deferred = Q.defer();
    deferred.resolve(utils.humanLikeTime());
    return deferred.promise;
}

module.exports = function(params) {
    return new TimeIntent(params);
}