Q     = require 'q'
wit   = require 'node-wit'

exports.getIntent = (token, text) ->
    return Q.nfapply wit.captureTextIntent, [config.serverToken, text]
        .then (response) ->
            if not response
                throw new Error 'Empty response'
            else if response.outcomes is undefined
                throw new Error 'Empty outcomes array'

            return response.outcomes[0]

        , (error) ->
            console.log error