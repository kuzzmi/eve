BaseModule = require '../base'

class SystemTools extends BaseModule
    constructor: (@params) ->
        super @params
        @action = @getEntity 'action', null

    exec: ->
        switch @action
            when 'clear'
                `process.stdout.write('\033c')`
                super 'Done'
                
            when 'version'
                pkg = require process.cwd() + '/package.json'

                super pkg.version

            when 'randomTweet'
                Twitter = require '../twitter'

                module = new Twitter()

                module.retweetRandomPopularTweet()

                super 'Something messy...'


module.exports = SystemTools