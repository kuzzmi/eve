var Ivona = require('ivona-node');
var child = require('child_process');

var ivona = new Ivona({
    accessKey: 'GDNAI76SALPR4SUR7M2Q',
    secretKey: 'T7KnJwnw80hC+nhrTpDxdts5gC2dtiSeuTBP4fUp'
});

function Talker(params) {
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

Talker.prototype.say = function(what) {
    var sox = child.spawn('sox', ['-t', 'mp3', '-', '-d', '-q']);

    return ivona.createVoice(what, this.body).pipe(sox.stdin);
}

module.exports = function(params) {
    return new Talker(params);
};