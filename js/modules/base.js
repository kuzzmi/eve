(function() {
  var BaseModule, q, vocabulary;

  q = require('q');

  vocabulary = require('../core/classes/vocabulary');

  BaseModule = (function() {
    function BaseModule(stimulus, action) {
      this.stimulus = stimulus;
      this.action = action;
      this.entities = this.stimulus.entities;
      this.vocabulary = null;
    }

    BaseModule.prototype.getEntity = function(name, def) {
      if (this.entities && this.entities[name]) {
        if (this.entities[name].length > 1) {
          return this.entities[name].map(function(entity) {
            return entity.value;
          });
        } else {
          return this.entities[name][0].value;
        }
      } else {
        return def;
      }
    };

    BaseModule.prototype.exec = function(result) {
      var deferred, response;
      deferred = q.defer();
      response = {
        text: void 0,
        voice: void 0,
        actions: void 0
      };
      if (typeof result === 'string') {
        response.text = response.voice = result;
        deferred.resolve(response);
      }
      if (typeof result === 'object') {
        if (result.voice) {
          vocabulary.pick(result.voice).then(function(phrase) {
            response.voice = phrase;
            response.text = result.text;
            if (!response.text) {
              response.text = phrase;
            }
            response.actions = result.actions;
            return deferred.resolve(response);
          });
        } else {
          response.text = result.text;
          response.actions = result.actions;
          deferred.resolve(response);
        }
      }
      if (result === void 0) {
        deferred.reject('Result is undefined');
      }
      return deferred.promise;
    };

    return BaseModule;

  })();

  module.exports = BaseModule;

}).call(this);
