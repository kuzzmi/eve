Brain  = require './classes/brain'
speech = require './classes/speech'

class Core
    constructor: (params) ->
        @speech = speech
        @brain = new Brain()


module.exports = Core