(function() {
  var Brain, EventEmitter, Q, Reflex, Stimulus, wit,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  wit = require('node-wit');

  Q = require('q');

  EventEmitter = require('events').EventEmitter;


  /* EVE PARTS */

  Stimulus = require('../models/stimulus');

  Reflex = require('./reflex');

  Brain = (function(superClass) {
    extend(Brain, superClass);

    Brain.prototype.memoryFile = __dirname + '/memory.json';

    function Brain(params) {
      this.params = params;
      this.subscribe();
    }

    Brain.prototype.subscribe = function() {
      return this.on('input', (function(_this) {
        return function(stimulus) {
          var reflex;
          if (_this.memory && _this.memory.length > 0) {
            reflex = _this.memory.pop();
            _this.process(reflex, stimulus);
            return;
          }
          return _this.understand(stimulus).then(function(reflex) {
            return _this.process(reflex);
          }).fail(function(e) {
            console.log(e);
            return console.log(e.stack);
          })["catch"](function(e) {
            console.log(e);
            return console.log(e.stack);
          }).done();
        };
      })(this));
    };

    Brain.prototype.understand = function(stimulus) {
      var deferred;
      deferred = Q.defer();
      if (stimulus.constructor === String) {
        wit.captureTextIntent('OLTQRQAU6E4K5N2JJWZZJ7HAOHJV72XA', stimulus, function(err, res) {
          if (err) {
            return deferred.reject(err);
          } else if (!res) {
            return deferred.reject(new Error('Empty response'));
          } else if (res.outcomes === void 0) {
            return deferred.reject(new Error('Empty outcomes array'));
          } else {
            return deferred.resolve(new Reflex(new Stimulus(res.outcomes[0])));
          }
        });
      } else {
        deferred.resolve(new Reflex(stimulus));
      }
      return deferred.promise;
    };

    Brain.prototype.process = function(reflex, action) {
      return reflex.exec(action).then((function(_this) {
        return function(response) {
          if (response) {
            _this.emit('output', response);
          }
          if (response.actions) {
            _this.memory = [reflex];
          }
          return response;
        };
      })(this)).fail(function(e) {
        console.log(e);
        return console.log(e.stack);
      })["catch"](function(e) {
        console.log(e);
        return console.log(e.stack);
      }).done();
    };

    return Brain;

  })(EventEmitter);

  module.exports = Brain;

}).call(this);
