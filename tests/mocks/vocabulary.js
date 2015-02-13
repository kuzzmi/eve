
function pick(file, phraseObj, callback) {
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