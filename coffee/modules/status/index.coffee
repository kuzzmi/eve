BaseModule = require '../base'
Q          = require 'q'
colors     = require 'colors'

class Status extends BaseModule
    constructor: (@params) ->
        super @params

        @action = @getEntity 'status_action', null
        @type   = @getEntity 'status_type', null
        @value  = @getEntity 'status_value', null

        @vocabulary = __dirname + '/vocabulary.json';

    exec: -> 
        hours = new Date().getHours()

        timeOfDay = switch
            when hours >= 4 and hours < 12 then 'morning'
            when hours >= 12 and hours < 18 then 'afternoon'
            when hours >= 18 and hours < 23 then 'evening'
            else 'night'

        response = {
            voice: {
                vocabulary: this.vocabulary,
                code: [this.action, this.type, this.value].join('.'),
                args: ['sir', timeOfDay]
            }
        }

        super response

module.exports = Status