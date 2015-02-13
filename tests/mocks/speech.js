module.exports = {
    exec: function() {
        var deferred = require('q').defer();
        var phrase = 'Hello';

        setTimeout(function() {
            deferred.resolve(phrase);
        }, 10);

        return deferred.promise;
    }
};