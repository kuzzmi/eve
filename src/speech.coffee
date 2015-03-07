Ivona = require 'ivona-node'
child = require 'child_process'
Utils  = require './utils'
# spawn = require('child_process').spawn
Q     = require 'q'
config = Utils.file2json('.everc').ivona

# ivona = require '../../api-clients/ivona'

ivona = new Ivona
    accessKey : config.accessKey
    secretKey : config.secretKey
    # proxy     : config.proxy

sox = null

module.exports = 
    exec: (params) ->
        if sox and sox.kill
            sox.kill 'SIGKILL'

        sox = child.spawn 'sox', ['-t', 'mp3', '-', '-d', '-q']

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
        console.log phrase, body
        ivona.createVoice phrase, body
            .pipe sox.stdin