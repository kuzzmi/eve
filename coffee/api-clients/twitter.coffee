Q       = require 'q'
Utils   = require '../common/utils'
Twitter = require 'twitter'
config  = Utils.file2json('.everc').twitter

client  = new Twitter
    consumer_key        : config.consumer_key
    consumer_secret     : config.consumer_secret
    access_token_key    : config.access_token_key
    access_token_secret : config.access_token_secret

exports.get = (endpoint, params) ->
    get = Q.nbind client.get, client

    return get endpoint, params
        .then (resp) ->
            {
                data   : resp[0],
                body   : resp[1]
            }
        .catch (err) ->
            console.log err.stack

exports.post = (endpoint, params) ->
    post = Q.nbind client.post, client

    return post endpoint, params
        .then (resp) ->
            {
                data   : resp[0],
                body   : resp[1]
            }
        .catch (err) ->
            console.log err.stack