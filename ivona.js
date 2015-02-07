var Ivona = require('ivona-node');
var fs = require('fs');
var Player = require('player');

var ivona = new Ivona({
    accessKey: 'GDNAI76SALPR4SUR7M2Q',
    secretKey: 'T7KnJwnw80hC+nhrTpDxdts5gC2dtiSeuTBP4fUp'
});

// // ivona.listVoices().on('complete', function(voices) {
// //     console.log(voices);
// // });

//  [string] text - the text to be spoken
//  [object] config (optional) - override Ivona request via 'body' value
ivona.createVoice('Hello').on('complete', function() {
    var player = new Player(__dirname + '/text.mp3');
    player.play();

    player.on('playing', function(song) {
        console.log('Playing... ');
        console.log(song);
    });

    player.on('error', function(err) {
        console.log('Opps...!')
        console.log(err);
    });
});