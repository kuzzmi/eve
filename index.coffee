Brain      = require './src/brain'
Memory     = require './src/memory'
Speech     = require './src/speech'
Stimulus   = require './src/stimulus'
Module     = require './src/module'
Response   = require './src/response'
Phrasebook = require './src/phrasebook'

module.exports = {
    Brain
    Speech
    Module
    Stimulus
    Phrasebook
}

module.exports.load = ->
    return new Brain()