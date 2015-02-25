fs    = require 'fs'
Q     = require 'q'
utils = require '../../common/utils'

exports.pick = (params) ->
    deferred = Q.defer()

    if not params.vocabulary and not params.phrase
        deferred.reject new Error('Vocabulary file is `undefined`')

    if not params.code and not params.phrase
        deferred.reject new Error('Phrase code is `undefined`')

    if params.phrase and params.lang
        deferred.resolve params

    else if params.phrase
        deferred.resolve params.phrase

    else if typeof params.vocabulary is 'string'
        fs.readFile params.vocabulary, (err, data) ->
            if err
                deferred.reject new Error('Error in loading a vocabulary. ' +
                    params.vocabulary + ' \r\n' + err)

            vocabulary = JSON.parse data
            splittedCode = params.code.split '.'
            args = params.args

            phrases = vocabulary

            for i in splittedCode
                phrases = phrases[i]

            random = utils.randomInt 0, phrases.length - 1
            phrase = phrases[random]

            result = phrase.replace /\{(\d+)\}/g, (match, number) ->
                if typeof args[number] isnt 'undefined'
                    return args[number] 
                else 
                    return match

            deferred.resolve result

    deferred.promise