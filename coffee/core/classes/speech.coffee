Ivona = require 'ivona-node'
child = require 'child_process'
Q = require 'q'

ivona = new Ivona {
    accessKey: 'GDNAI76SALPR4SUR7M2Q',
    secretKey: 'T7KnJwnw80hC+nhrTpDxdts5gC2dtiSeuTBP4fUp'    
}        

module.exports = 
    exec: (params) ->
        sox = child.spawn 'sox', ['-t', 'mp3', '-', '-d', '-q']

        if typeof params is 'string'
            phrase = params
        else
            phrase = params.phrase
            lang = switch params.lang
                when 'en' then 'en-US'
                when 'fr' then 'fr-FR'
                when 'ru' then 'ru-RU'
                when 'de' then 'de-DE'
            

        

        body = {
            body: {
                voice: {
                    language: lang,
                    gender: 'Female'
                }
            }
        }

        ivona.createVoice phrase, body
            .pipe sox.stdin