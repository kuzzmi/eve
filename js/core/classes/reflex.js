(function() {
  var Q, Reflex;

  Q = require('q');

  Reflex = (function() {
    function Reflex(stimulus) {
      this.stimulus = stimulus;
    }

    Reflex.prototype.exec = function(action) {
      var IntentModule, deferred, e, intentModule;
      deferred = Q.defer();
      try {
        IntentModule = require('../../modules/' + this.stimulus.intent);
      } catch (_error) {
        e = _error;
        console.log(e);
        deferred.reject(e);
      }
      intentModule = new IntentModule(this.stimulus, action);
      intentModule.exec().then(deferred.resolve);
      return deferred.promise;
    };

    return Reflex;

  })();

  module.exports = Reflex;

}).call(this);
