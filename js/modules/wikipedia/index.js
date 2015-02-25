(function() {
  var BaseModule, Q, Wiki, WikiScraper, colors, request,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BaseModule = require('../base');

  request = require('request');

  Q = require('q');

  WikiScraper = require('wikiscraper');

  colors = require('colors');

  Wiki = (function(superClass) {
    extend(Wiki, superClass);

    function Wiki(params, action) {
      this.params = params;
      this.action = action;
      Wiki.__super__.constructor.call(this, this.params);
      this.query = this.getEntity('wikipedia_search_query', null);
      this.action = this.getEntity('wikipedia_action', null);
    }

    Wiki.prototype.reportFromJson = function(properName, description, data) {
      var desc, k, longest, prependWithSpaces, reportData, strings, v;
      reportData = data.infobox.fields;
      prependWithSpaces = function(string, total) {
        var spaces;
        spaces = new Array(total - string.length + 1).join(' ');
        return spaces + string;
      };
      longest = 0;
      for (k in reportData) {
        v = reportData[k];
        if (longest < k.length) {
          longest = k.length;
        }
      }
      strings = [''];
      strings.push(prependWithSpaces('Title', longest).yellow + ': ' + (properName + '').yellow.bold);
      strings.push(prependWithSpaces('Description', longest).yellow + ': ' + description);
      strings.push('');
      for (k in reportData) {
        v = reportData[k];
        desc = prependWithSpaces(k.replace(/\n/g, ''), longest);
        strings.push((desc + ': ').yellow + (v.replace(/\n\nList\n\n/g, '').replace(/\n/g, '; ').replace(/^; /g, '').replace(/(; ){2,}/g, '')));
      }
      return strings.join('\n');
    };

    Wiki.prototype.exec = function() {
      var deferred, qs, response, url;
      deferred = Q.defer();
      response = {
        text: null,
        voice: null,
        actions: null
      };
      url = 'http://en.wikipedia.org/w/api.php';
      qs = {
        action: 'opensearch',
        search: this.query,
        limit: 1,
        namespace: 0,
        format: 'json'
      };
      request({
        url: url,
        qs: qs
      }, (function(_this) {
        return function(err, res, body) {
          var data, description, properName, wikiscraper;
          if (err) {
            deferred.reject(err);
          }
          data = JSON.parse(body);
          if (data[2].length === 0) {
            deferred.reject('Sorry, nothing found about' + _this.query);
          }
          properName = data[1];
          description = data[2][0];
          wikiscraper = new WikiScraper([properName]);
          return wikiscraper.scrape(function(err, element) {
            if (err) {
              deferred.reject(err);
            }
            response.text = _this.reportFromJson(properName, description, element);
            response.voice = {
              phrase: description.replace(/(\s*\([^)]*\))/g, '')
            };
            return Wiki.__super__.exec.call(_this, response).then(deferred.resolve);
          });
        };
      })(this));
      return deferred.promise;
    };

    return Wiki;

  })(BaseModule);

  module.exports = Wiki;

}).call(this);
