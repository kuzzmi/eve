{ Module } = require '../../'

class Reference extends Module

    exec: ->
        now   = new Date()
        hours = now.getHours()
        
        timeOfDay = switch
            when 4  <= hours < 12 then 'morning'
            when 12 <= hours < 18 then 'afternoon'
            when 18 <= hours < 23 then 'evening'
            else 'night'

        code = [ @params.reference_type.value ]
        args = [ 
            timeOfDay,
            [ 'sir', 'Igor' ] 
        ]

        phrase = @pick code, args

        @response
            .addText phrase
            .addVoice phrase
            .send()        

module.exports = Reference