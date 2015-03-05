spawn = require('child_process').spawn
Q     = require 'q'

ivona = require '../../api-clients/ivona'

sox = null

module.exports = 
    exec: (params) ->
        if sox and sox.kill
            sox.kill 'SIGKILL'

        sox = spawn 'sox', ['-t', 'mp3', '-', '-d', '-q']

        sox.stdin.on 'error', (error) ->
            if error.code is 'EPIPE'
                () ->

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