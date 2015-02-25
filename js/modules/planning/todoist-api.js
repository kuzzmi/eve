(function() {
  var Q, config, todoist;

  todoist = require('node-todoist');

  config = require('./config');

  Q = require('q');

  exports.query = function(query) {
    var deferred, params;
    deferred = Q.defer();
    params = {
      queries: JSON.stringify([query])
    };
    todoist.request('query', params).then(function(response) {
      return deferred.resolve(response);
    });
    return deferred.promise;
  };

  exports.getProjects = function() {
    var deferred;
    deferred = Q.defer();
    todoist.request('getProjects').then(function(result) {
      return deferred.resolve(result);
    });
    return deferred.promise;
  };

  exports.getLabels = function() {
    var deferred;
    deferred = Q.defer();
    todoist.request('getLabels').then(function(result) {
      return deferred.resolve(result);
    });
    return deferred.promise;
  };

  exports.login = function() {
    var credentials, deferred;
    deferred = Q.defer();
    credentials = {
      email: config.email,
      password: config.password
    };
    todoist.login(credentials).then(deferred.resolve);
    return deferred.promise;
  };

  exports.addItem = function(item) {
    var deferred;
    deferred = Q.defer();
    todoist.request('addItem', item).then(deferred.resolve);
    return deferred.promise;
  };

  ({
    getUncompletedItems: function(id) {
      var deferred, params;
      deferred = Q.defer();
      params = {
        project_id: id || config.projects.PROJECTS
      };
      todoist.request('getUncompletedItems', params).then(function(response) {
        return deferred.resolve(response);
      });
      return deferred.promise;
    }
  });

}).call(this);
