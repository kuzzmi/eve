(function() {
  var Ivona, Q, child, ivona;

  Ivona = require('ivona-node');

  child = require('child_process');

  Q = require('q');

  ivona = new Ivona({
    accessKey: 'GDNAI76SALPR4SUR7M2Q',
    secretKey: 'T7KnJwnw80hC+nhrTpDxdts5gC2dtiSeuTBP4fUp'
  });

  module.exports = {
    exec: function(params) {
      var body, lang, phrase, sox;
      sox = child.spawn('sox', ['-t', 'mp3', '-', '-d', '-q']);
      if (typeof params === 'string') {
        phrase = params;
      } else {
        phrase = params.phrase;
        lang = (function() {
          switch (params.lang) {
            case 'en':
              return 'en-US';
            case 'fr':
              return 'fr-FR';
            case 'ru':
              return 'ru-RU';
            case 'de':
              return 'de-DE';
          }
        })();
      }
      body = {
        body: {
          voice: {
            language: lang,
            gender: 'Female'
          }
        }
      };
      return ivona.createVoice(phrase, body).pipe(sox.stdin);
    }
  };

}).call(this);
