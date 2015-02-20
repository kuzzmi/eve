Brain = require './classes/brain'
speech = require './classes/speech'

class Core
    constructor: (params) ->
        @speech = speech
        @brain = new Brain()
    
    @init: (params) ->
        new Core(params)


module.exports = Core