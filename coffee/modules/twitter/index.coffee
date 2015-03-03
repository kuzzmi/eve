BaseModule = require '../base'

class TwitterModule extends BaseModule
    constructor: (@params) ->
        super @params

    tweetAboutNewModule: (module) ->
        moduleJSON = require '../' + module + '/module.json'

        @exec 'I should tweet that now I can ' + moduleJSON.skill

    exec: ->

module.exports = TwitterModule