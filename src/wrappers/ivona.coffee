Ivona  = require 'ivona-node'
Utils  = require '../common/utils'
config = Utils.file2json('.everc').ivona

client = new Ivona
    accessKey : config.accessKey
    secretKey : config.secretKey
    proxy     : 
        host: config.proxyHost
        port: config.proxyPort

module.exports =
    createVoice: (phrase, body) ->
        return client.createVoice phrase, body