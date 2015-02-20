// Generated by CoffeeScript 1.9.0
var BaseModule, q, vocabulary;

q = require('q');

vocabulary = require('../core/classes/vocabulary');

BaseModule = (function() {
  BaseModule.pickPhrase = vocabulary.pick;

  function BaseModule(_at_stimulus, _at_action) {
    this.stimulus = _at_stimulus;
    this.action = _at_action;
    this.entities = this.stimulus.entities;
    this.vocabulary = null;
  }

  BaseModule.prototype.getEntity = function(name, def) {
    if (this.entities && this.entities[name]) {
      return this.entities[name][0].value;
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
    if (result.constructor === String) {
      response.text = response.voice = result;
      deferred.resolve(response);
    }
    if (result.constructor === Object) {
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
    return deferred.promise;
  };

  return BaseModule;

})();

module.exports = BaseModule;