{ Module } = require '../../'

Time = require '../time'
Test = require '../test'

class Reference extends Module

    exec: ->
        now   = new Date()
        hours = now.getHours()
        
        timeOfDay = switch
            when 4  <= hours < 12 then 'morning'
            when 12 <= hours < 18 then 'afternoon'
            when 18 <= hours < 23 then 'evening'
            else 'night'

        code = [ 'farewell' ]
        args = [ timeOfDay, [ 'sir', 'Igor' ] ]

        phrase = @pick code, args

        timeResponse = Time.exec().response
        testResponse = Test.exec().response

        @response
            .addText phrase
            .addVoice phrase
            .addResponse timeResponse    
            .addResponse testResponse    
            .send()        

module.exports = Reference