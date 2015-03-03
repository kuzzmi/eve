BaseModule = require '../base'

class SystemTools extends BaseModule
    constructor: (@params) ->
        super @params
        @action = @getEntity 'action', null

    exec: ->
        switch @action
            when 'clear'
                `process.stdout.write('\033c')`

        super 'Done'

module.exports = SystemTools