var sinon = require('sinon'),
    Q     = require('q');

function ReflexMock () {
};

ReflexMock.prototype.exec = function() {
    var deferred = Q.defer();

    setTimeout(function() {
        deferred.resolve('Hello');
    }, 10);

    return deferred.promise;
};

ReflexMock.prototype.on = function() {
    return this;
};

module.exports = ReflexMock;