BaseModule = require '../base'
Utils = require '../../common/utils'

Twitter = require 'twitter'

class TwitterModule extends BaseModule
    constructor: (@params) ->
        super @params

        @client = new Twitter({
            consumer_key: 'NYO7u1Z0NN6QB0nNHV2gPAJgE',
            consumer_secret: 'jnFr526Ft6mcLerbvtMCV5lSB6d7a1a8SeoBGjCEBTqWf4QBml',
            access_token_key: '3068660717-kqxOpcqpIdDJElgdZNlE8dvBwtvpdNPV255B2ud',
            access_token_secret: 'fCxmpScnunLC8X3cTmnU7MtOCxHrsohvc2LFaYSSYdvPG'
        })

    tweetAboutNewModule: (module) ->
        moduleJSON = require '../' + module + '/module.json'

        @client.post 'statuses/update', 
            status: '#hooray! I\'m getting smarter. Now I can ' + moduleJSON.skill + '. Exciting! #bot #eve'
        , ->

    tweetAboutYesterday: (amount) ->
        @client.post 'statuses/update', 
            status: "I feel myself useful. Yesterday I completed #{amount} tasks from my boss. That's impressive, isn't it? ;) #bot #eve #sweetfeeling"
        , ->

    postRandomPositiveTweet: ->
        positiveTags = [ '#good', '#goodnews', '#positive', '#hooray' ]
        rand = Utils.randomInt 0, positiveTags.length

        @client.get 'search/tweets', 
                q: positiveTags[rand], 
                lang: 'en' 
            , (err, tweets, resp) =>
                statuses = tweets.statuses 

                rand = Utils.randomInt 0, statuses.length
                tweet = statuses[rand].text

                @client.post 'statuses/update', 
                    status: "#{tweet} #bot #eve"
                , ->
                    console.log tweet


    getRandomPositiveTweet: ->
        positiveTags = [ '#good', '#goodnews', '#positive', '#hooray', '#love', '#happiness' ]
        rand = Utils.randomInt 0, positiveTags.length

        @client.get 'search/tweets', 
                q: positiveTags[rand], 
                lang: 'en' 
            , (err, tweets, resp) =>
                statuses = tweets.statuses 

                rand = Utils.randomInt 0, statuses.length

                console.log statuses[rand].text
            
    retweetRandomPopularTweet: ->

        @client.get 'trends/place', { id: 1 }, (err, answ, resp) =>

            trends = answ[0].trends
            rand = Utils.randomInt 0, trends.length

            @client.get 'search/tweets', 
                q: trends[rand].name, 
                lang: 'en' 
            , (err, tweets, resp) =>
                statuses = tweets.statuses 

                rand = Utils.randomInt 0, statuses.length

                @client.get 'statuses/retweet/' + statuses[rand].id, (err) ->
                    console.log err
                    console.log statuses[rand].text + ' was retweeted...'

    exec: ->

module.exports = TwitterModule