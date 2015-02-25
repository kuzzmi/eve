BaseModule = require '../base'
Q          = require 'q'
colors     = require 'colors'

Planning   = require '../planning'
Weather    = require '../weather'

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

        response = 
            voice: 
                vocabulary: @vocabulary
                code: [@action, @type, @value].join('.')
                args: ['sir', timeOfDay]

        if @action is 'update' and @type is 'awake' and @value is 'true'
            deferred = Q.defer()
        
            new Weather
                entities:
                    datetime: [{
                        type: 'value',
                        grain: 'day',
                        value: new Date()
                    }]
            .exec()
                .then (forecast) =>
                    super response
                        .then (res) ->
                            res.text = res.text + '. ' + forecast.text
                            res.voice = res.voice + '. ' + forecast.voice
                            res
                .then deferred.resolve

            deferred.promise

        if @action is 'update' and @type is 'athome' and @value is 'true'
            deferred = Q.defer()
        
            new Planning
                entities:
                    planning_action: [{
                        value: 'count_at_home'
                    }]
            .exec()
                .then (tasks) =>
                    console.log tasks
                    super response
                        .then (res) ->
                            res.text = res.text + '. ' + tasks.text
                            res.voice = res.voice + '. ' + tasks.voice
                            res
                .then deferred.resolve

            deferred.promise

        else
            super response

module.exports = Status