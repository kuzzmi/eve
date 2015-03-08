{ Module } = require '../'

class Test extends Module
    
    exec: ->

        @response
            .addText  'It works!'
            .addVoice 'Yes!'
            .send()

module.exports = Test