BaseModule = require '../base'
Utils      = require '../../common/utils'

Twitter    = require '../../api-clients/twitter'

class TwitterModule extends BaseModule
    constructor: (@params) ->
        super @params

    tweetAboutNewModule: (module) ->
        moduleJSON = require '../' + module + '/module.json'

        Twitter.post 'statuses/update', 
            status: '#hooray! I\'m getting smarter. Now I can ' + moduleJSON.skill + '. Exciting! #bot #eve'

    tweetAboutYesterday: (amount) ->
        Twitter.post 'statuses/update', 
            status: "I feel myself useful. Yesterday I completed #{amount} tasks from my boss. That's impressive, isn't it? ;) #bot #eve #sweetfeeling"
        .then (resp) ->
            console.log resp.data

    postRandomPositiveTweet: ->
        positiveTags = [ '#goodnews', '#positive', '#happiness' ]
        rand         = Utils.randomInt 0, positiveTags.length

        Twitter.get 'search/tweets', 
            q    : positiveTags[rand], 
            lang : 'en' 
        .then (resp) ->
            statuses = resp.data.statuses
            rand     = Utils.randomInt 0, statuses.length
            tweet    = statuses[rand].text

            Twitter.post 'statuses/update', 
                status: "#{tweet} #bot #eve"
            .then ->
                console.log tweet


    getRandomPositiveTweet: ->
        positiveTags = [ '#goodnews', '#positive', '#happiness' ]
        rand         = Utils.randomInt 0, positiveTags.length

        Twitter.get 'search/tweets', 
            q    : positiveTags[rand], 
            lang : 'en'

        .then (resp) ->
            statuses = resp.data.statuses 

            rand = Utils.randomInt 0, statuses.length

            console.log statuses[rand].text

            
    retweetRandomPopularTweet: ->

        Twitter.get 'trends/place', { id: 1 }, (err, answ, resp) =>

            trends = answ[0].trends
            rand   = Utils.randomInt 0, trends.length

            Twitter.get 'search/tweets', 
                q    : trends[rand].name, 
                lang : 'en' 
            .then (resp) ->
                statuses = tweets.statuses 

                rand = Utils.randomInt 0, statuses.length

                Twitter.get 'statuses/retweet/' + statuses[rand].id
                .then ->
                    console.log statuses[rand].text + ' was retweeted...'

    exec: ->

module.exports = TwitterModule