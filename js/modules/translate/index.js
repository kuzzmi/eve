(function() {
  var BaseModule, Q, Translate, colors, googleTranslate,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  googleTranslate = require('google-translate')('AIzaSyCub2LsWQwbEqji0SjVSMGlty0siQ7Fess');

  BaseModule = require('../base');

  Q = require('q');

  colors = require('colors');

  Translate = (function(superClass) {
    extend(Translate, superClass);

    function Translate(params) {
      this.params = params;
      Translate.__super__.constructor.call(this, this.params);
      this.phrase = this.getEntity('phrase_to_translate', null);
      this.from = this.getEntity('from', 'english');
      this.to = this.getEntity('to', 'english');
    }

    Translate.prototype.getLanguageCode = function(lang) {
      var langs;
      langs = {
        afrikaans: 'af',
        albanian: 'sq',
        arabic: 'ar',
        azerbaijani: 'az',
        basque: 'eu',
        bengali: 'bn',
        belarusian: 'be',
        bulgarian: 'bg',
        catalan: 'ca',
        croatian: 'hr',
        czech: 'cs',
        danish: 'da',
        dutch: 'nl',
        english: 'en',
        esperanto: 'eo',
        estonian: 'et',
        filipino: 'tl',
        finnish: 'fi',
        french: 'fr',
        galician: 'gl',
        georgian: 'ka',
        german: 'de',
        greek: 'el',
        gujarati: 'gu',
        hebrew: 'iw',
        hindi: 'hi',
        hungarian: 'hu',
        icelandic: 'is',
        indonesian: 'id',
        irish: 'ga',
        italian: 'it',
        japanese: 'ja',
        kannada: 'kn',
        korean: 'ko',
        latin: 'la',
        latvian: 'lv',
        lithuanian: 'lt',
        macedonian: 'mk',
        malay: 'ms',
        maltese: 'mt',
        norwegian: 'no',
        persian: 'fa',
        polish: 'pl',
        portuguese: 'pt',
        romanian: 'ro',
        russian: 'ru',
        serbian: 'sr',
        slovak: 'sk',
        slovenian: 'sl',
        spanish: 'es',
        swahili: 'sw',
        swedish: 'sv',
        tamil: 'ta',
        telugu: 'te',
        thai: 'th',
        turkish: 'tr',
        ukrainian: 'uk',
        urdu: 'ur',
        vietnamese: 'vi',
        welsh: 'cy',
        yiddish: 'yi'
      };
      return langs[lang];
    };

    Translate.prototype.exec = function() {
      var deferred, from, response, to;
      deferred = Q.defer();
      response = {
        text: null,
        voice: null,
        actions: null
      };
      to = this.getLanguageCode(this.to);
      from = this.getLanguageCode(this.from);
      googleTranslate.translate(this.phrase, from, to, (function(_this) {
        return function(err, translation) {
          if (err) {
            console.log(err);
            deferred.reject(err);
          }
          response.text = '\n' + ' [' + from.yellow.bold + '] ' + translation.originalText + '\n' + ' [' + to.yellow.bold + '] ' + translation.translatedText;
          response.voice = {
            phrase: translation.translatedText,
            lang: to
          };
          return Translate.__super__.exec.call(_this, response).then(deferred.resolve);
        };
      })(this));
      return deferred.promise;
    };

    return Translate;

  })(BaseModule);

  module.exports = Translate;

}).call(this);
