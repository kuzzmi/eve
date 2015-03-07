{ Module } = require '../'

class Test extends Module
    
    exec: ->

        @response
            .addText  'It works!'
            .addVoice 'Yes!'

        @Eve.logger.log @response.body

            .send()

module.exports = Test