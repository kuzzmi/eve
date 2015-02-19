// Generated by CoffeeScript 1.9.1
var BaseModule, q, vocabulary;

q = require('q');

vocabulary = require('../core/classes/vocabulary');

BaseModule = (function() {
  BaseModule.pickPhrase = vocabulary.pick;

  function BaseModule(stimulus) {
    this.stimulus = stimulus;
    this.entities = this.stimulus.entities;
  }

  BaseModule.prototype.getEntity = function(name, def) {
    if (this.entities[name]) {
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
    console.log(result);
    if (result.constructor === String) {
      response.text = response.voice = result;
    }
    deferred.resolve(response);
    return deferred.promise;
  };

  return BaseModule;

})();

module.exports = BaseModule;
