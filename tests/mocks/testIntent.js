var Q = require('q');

function TestIntent(entities) {

};

TestIntent.prototype.exec = function() {
    var deferred = Q.defer();

    setTimeout(function() {
        deferred.resolve('Test');
    }, 10)

    return deferred.promise;
};

module.exports = TestIntent;