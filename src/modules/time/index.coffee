BaseModule = require '../base'

class Time extends BaseModule
    constructor: (@params) ->
        super @params

    humanLikeTime: (date) ->
        date = date || new Date()
        hours = date.getHours()
        minutes = date.getMinutes()
        
        text = ''
        if hours < 10
            text = '0' + hours
        else
            text = hours

        text += ':'

        if minutes < 10
            text += '0' + minutes
        else
            text += minutes

        if (minutes > 0) 
            if minutes < 15
                voice = minutes + ' minutes past ' + hours
            else if minutes is 15
                voice = 'Quarter past ' + hours
            else if minutes < 30
                voice = minutes + ' minutes past ' + hours
            else if minutes is 30
                voice = 'Half past ' + hours
            else if minutes < 45
                voice = (60 - minutes) + ' to ' + (hours + 1)
            else if minutes is 45
                voice = 'Quarter to ' + (hours + 1)
            else if minutes < 60
                voice = (60 - minutes) + ' to ' + (hours + 1)
        else
            voice = hours + ' o\'clock'

        return {
            text: text,
            voice: {
                phrase: voice
            }
        }

    exec: ->
        super @humanLikeTime()


module.exports = Time