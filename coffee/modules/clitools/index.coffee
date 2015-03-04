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

            when 'goodTweet'
                Twitter = require '../twitter'

                module = new Twitter()

                module.getRandomPositiveTweet()

                super '!'

            when 'postGoodTweet'
                Twitter = require '../twitter'

                module = new Twitter()

                module.postRandomPositiveTweet()

                super '!'

            when 'tweetAboutYesterday'
                randomInt = require('../../common/utils').randomInt
                Twitter = require '../twitter'

                module = new Twitter()

                rand = randomInt(58, 255)

                module.tweetAboutYesterday rand

                super 'Tweeted'


module.exports = SystemTools