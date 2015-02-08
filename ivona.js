var Ivona = require('ivona-node');
var fs = require('fs');
var args = process.argv.slice(2);

var ivona = new Ivona({
    accessKey: 'GDNAI76SALPR4SUR7M2Q',
    secretKey: 'T7KnJwnw80hC+nhrTpDxdts5gC2dtiSeuTBP4fUp'
});

ivona.createVoice(args[0]).pipe(fs.createWriteStream('temp.mp3'));
