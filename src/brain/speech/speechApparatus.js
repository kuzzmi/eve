var Ivona = require('ivona-node');
var child = require('child_process');
var Q = require('q');

var ivona = new Ivona({
    accessKey: 'GDNAI76SALPR4SUR7M2Q',
    secretKey: 'T7KnJwnw80hC+nhrTpDxdts5gC2dtiSeuTBP4fUp'
});

function SpeechAparatus(params) {
    this.body = {
        body: {
            voice: {
                // name: 'Kimberly',
                // language: 'en-GB',
                gender: 'Female'
            }
        }
    };
};

SpeechAparatus.prototype.exec = function(what) {
    var sox = child.spawn('sox', ['-t', 'mp3', '-', '-d', '-q']);

    return ivona.createVoice(what, this.body).pipe(sox.stdin);
}

module.exports = {
    exec: function(what, lang) {

        var sox = child.spawn('sox', ['-t', 'mp3', '-', '-d', '-q']);

        lang = lang || 'en-US';

        var body = {
            body: {
                voice: {
                    language: lang,
                    gender: 'Female'
                }
            }
        };

        ivona.createVoice(what, body).pipe(sox.stdin);

        return what;
    }
};