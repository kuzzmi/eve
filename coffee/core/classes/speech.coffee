Ivona = require 'ivona-node'
child = require 'child_process'
Q = require 'q'

ivona = new Ivona {
    accessKey: 'GDNAI76SALPR4SUR7M2Q',
    secretKey: 'T7KnJwnw80hC+nhrTpDxdts5gC2dtiSeuTBP4fUp'    
}

module.exports = 
    exec: (phrase) ->
        sox = child.spawn 'sox', ['-t', 'mp3', '-', '-d', '-q']

        ivona.createVoice phrase
            .pipe sox.stdin