(function() {
  var API, BaseModule, Planning, Q, colors, config, moment, request, todoist, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BaseModule = require('../base');

  request = require('request');

  Q = require('q');

  colors = require('colors');

  todoist = require('node-todoist');

  config = require('./config');

  moment = require('moment');

  utils = require('../../common/utils');

  API = require('./todoist-api');

  Planning = (function(superClass) {
    extend(Planning, superClass);

    function Planning(params, selection) {
      var type;
      this.params = params;
      this.selection = selection;
      Planning.__super__.constructor.call(this, this.params);
      this.action = this.getEntity('planning_action', null);
      this.item = this.getEntity('agenda_entry', null);
      this.priority = this.getEntity('planning_priority', 1);
      this.tag = this.getEntity('planning_tag', '');
      if (this.entities && this.entities.datetime) {
        this.datetime = this.entities.datetime[0];
        if (this.datetime.type === 'value') {
          type = this.datetime.grain;
        }
        if (this.datetime.type === 'interval') {
          type = 'interval';
        }
        switch (type) {
          case 'second':
            this.datetime = moment(this.datetime.value).format('MMM Do h:mm a');
            break;
          case 'hour':
            this.datetime = moment(this.datetime.value).format('MMM Do h:mm a');
            break;
          case 'interval':
            this.datetime = moment(this.datetime.to.value).format('MMM Do h:mm a');
            break;
          case 'day':
            this.datetime = moment(this.datetime.value).format('MMM Do');
        }
      } else {
        this.datetime = 'tomorrow';
      }
      this.loggedIn = false;
    }

    Planning.prototype.login = function() {
      var deferred;
      deferred = Q.defer();
      API.login().then((function(_this) {
        return function(user) {
          _this.token = user.api_token;
          return user;
        };
      })(this)).then(deferred.resolve);
      return deferred.promise;
    };

    Planning.prototype.getProjects = function() {
      var deferred;
      deferred = Q.defer();
      API.getProjects().then(function(result) {
        console.log(result);
        return deferred.resolve({
          voice: {
            phrase: 'Reminder added'
          }
        });
      });
      return deferred.promise;
    };

    Planning.prototype.query = function(query) {
      var deferred;
      deferred = Q.defer();
      API.query(query).then(function(response) {
        return deferred.resolve(response);
      });
      return deferred.promise;
    };

    Planning.prototype.addItem = function() {
      var deferred, item;
      deferred = Q.defer();
      if (typeof this.item === 'string') {
        item = {
          content: utils.capitalize(this.item),
          token: this.token,
          priority: this.priority,
          date_string: this.datetime
        };
        if (this.tag) {
          item.labels = JSON.stringify([config.labels[this.tag].id]);
        }
        API.addItem(item).then(function() {
          return deferred.resolve({
            voice: {
              phrase: 'Reminder added'
            }
          });
        });
      } else {
        console.log(this.item);
      }
      return deferred.promise;
    };

    Planning.prototype.count = function(response) {
      return response.reduce(function(a, b) {
        return a + b.data.length;
      }, 0);
    };

    Planning.prototype.exec = function() {
      var deferred;
      deferred = Q.defer();
      if (!this.loggedIn) {
        this.login().then((function(_this) {
          return function() {
            switch (_this.action) {
              case 'print':
                return _this.query('(@datetime, &home)').then(function(response) {
                  return console.log(response);
                });
              case 'count_at_home':
                return _this.query('(overdue, today) & @home').then(function(response) {
                  console.log(response);
                  return _this.count(response);
                }).then(function(amount) {
                  return {
                    voice: {
                      phrase: 'You have ' + amount + ' tasks'
                    }
                  };
                });
              case 'remind':
                return _this.addItem();
              case 'count':
                return _this.query('overdue, today').then(function(response) {
                  return _this.count(response);
                }).then(function(amount) {
                  return {
                    voice: {
                      phrase: 'You have ' + amount + ' tasks'
                    }
                  };
                });
            }
          };
        })(this)).then(function(response) {
          return Planning.__super__.exec.apply(this, arguments).then(deferred.resolve);
        })["catch"](function(e) {
          console.log(e);
          return deferred.reject(e);
        });
      }
      return deferred.promise;
    };

    return Planning;

  })(BaseModule);

  module.exports = Planning;

}).call(this);