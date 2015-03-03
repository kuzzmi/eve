BaseModule = require '../base'

Twitter = require 'twitter'

class TwitterModule extends BaseModule
    constructor: (@params) ->
        super @params

    tweetAboutNewModule: (module) ->
        moduleJSON = require '../' + module + '/module.json'

        client = new Twitter({
            consumer_key: 'N2Uziu4NiYee3WWgTo1JhLoZw',
            consumer_secret: 'dDSaxWgnn32KruTqGlv7vAA4iYcxqLAW41CLoIUbMitZG1pQCB',
            access_token_key: '3068660717-cSjynWRTymTbYpH8BE9nyvMXlcoZ36iBELEhe6n',
            access_token_secret: '7JPtv3bj4mBSZeeICV4mIBEdntq3luiImdifhUlMUs4cj'
        })

        client.post 'statuses/update', 
            status: '#hooray! I\'m getting smarter. Now I can ' + moduleJSON.skill + '. Exciting!'
        , ->
    exec: ->

module.exports = TwitterModule