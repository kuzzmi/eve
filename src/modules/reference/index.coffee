BaseModule = require '../base'

class Reference extends BaseModule

    exec: ->
        now   = new Date()
        hours = now.getHours()
        
        timeOfDay = switch
            when 4  <= hours < 12 then 'morning'
            when 12 <= hours < 18 then 'afternoon'
            when 18 <= hours < 23 then 'evening'
            else 'night'

        @loadVocabulary __dirname

        code = @params.reference_type.value
        args = [ timeOfDay, 'sir' ]

        @pickPhrase code, args
            .then @Eve.say

module.exports = Reference