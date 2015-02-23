// Generated by CoffeeScript 1.9.1
var BaseModule, Planning, Q, colors, config, request, todoist,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

BaseModule = require('../base');

request = require('request');

Q = require('q');

colors = require('colors');

todoist = require('node-todoist');

config = require('./config');

Planning = (function(superClass) {
  extend(Planning, superClass);

  function Planning(params, selection) {
    this.params = params;
    this.selection = selection;
    Planning.__super__.constructor.call(this, this.params);
    this.action = this.getEntity('planning_action', null);
    this.item = this.getEntity('agenda_entry', null);
    this.priority = this.getEntity('planning_priority', 1);
    if (this.entities && this.entities.datetime) {
      this.datetime = this.entities.datetime[0];
    } else {
      this.datetime = {
        value: 'tomorrow'
      };
    }
    console.log(this.datetime);
    this.loggedIn = false;
  }

  Planning.prototype.login = function() {
    var credentials, deferred;
    deferred = Q.defer();
    credentials = {
      email: config.email,
      password: config.password
    };
    todoist.login(credentials).then((function(_this) {
      return function(user) {
        _this.token = user.api_token;
        return user;
      };
    })(this)).then(deferred.resolveТа);
    return deferred.promise;
  };

  Planning.prototype.getProjects = function() {
    var deferred;
    deferred = Q.defer();
    todoist.request('getProjects').then(deferred.resolve);
    return deferred.promise;
  };

  Planning.prototype.addItem = function() {
    var deferred, item;
    deferred = Q.defer();
    if (typeof this.item === 'string') {
      item = {
        content: this.item,
        token: this.token,
        priority: this.priority,
        date_string: this.datetime.value
      };
      todoist.request('addItem', item).then(deferred.resolve);
    } else {

    }
    return deferred.promise;
  };

  Planning.prototype.exec = function() {
    var deferred;
    deferred = Q.defer();
    if (!this.loggedIn) {
      this.login().then((function(_this) {
        return function() {
          return _this.addItem();
        };
      })(this)).then(function(response) {
        return Planning.__super__.exec.call(this, {
          voice: {
            phrase: 'Reminder added'
          }
        }).then(deferred.resolve);
      });
    }
    return deferred.promise;
  };

  return Planning;

})(BaseModule);

module.exports = Planning;
