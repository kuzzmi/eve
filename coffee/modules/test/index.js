// Generated by CoffeeScript 1.9.0
var BaseModule, Test,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __hasProp = {}.hasOwnProperty;

BaseModule = require('../base');

Test = (function(_super) {
  __extends(Test, _super);

  function Test() {
    return Test.__super__.constructor.apply(this, arguments);
  }

  Test.prototype.exec = function() {
    var act, actions, response;
    actions = [
      {
        code: '1',
        fn: function(response) {
          delete response.actions;
          response.text = 'Hello';
          return response.voice = {
            phrase: 'Hello'
          };
        }
      }, {
        code: '2',
        fn: function(response) {
          delete response.actions;
          response.text = 'Bye';
          return response.voice = {
            phrase: 'Bye'
          };
        }
      }
    ];
    response = {
      text: 'Please make a choice:\r\n1. Say "Hello"\r\n2. Say "Bye"',
      actions: actions
    };
    if (this.action) {
      act = actions.filter((function(_this) {
        return function(action) {
          return action.code === _this.action;
        };
      })(this))[0];
      act.fn(response);
    }
    return Test.__super__.exec.call(this, response);
  };

  return Test;

})(BaseModule);

module.exports = Test;
