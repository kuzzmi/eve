BaseModule = require '../base'

class Reference extends BaseModule
    constructor: (@params) ->
        super @params
        @type = @getEntity 'reference_type', 'greeting'
        @name = @getEntity 'reference_name_type', 'neutral'
        @vocabulary = __dirname + '/vocabulary.json'

    exec: ->
        now = new Date()
        hours = now.getHours()
        timeOfDay = switch
            when hours >= 4 and hours < 12 then 'morning'
            when hours >= 12 and hours < 18 then 'afternoon'
            when hours >= 18 and hours < 23 then 'evening'
            else 'night'

        super {
            voice: {
                vocabulary: @vocabulary,
                code: @type,
                args: [timeOfDay, 'sir']
            }
        }

module.exports = Reference