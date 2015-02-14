
function pick(params) {
    var deferred = require('q').defer();
    var phrase = 'Hello Tester';

    setTimeout(function() {
        deferred.resolve(phrase);
    }, 10);

    return deferred.promise;
};

module.exports = {
    pick: pick
};