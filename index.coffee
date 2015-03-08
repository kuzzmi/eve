Brain      = require './src/brain'
Memory     = require './src/memory'
Speech     = require './src/speech'
Stimulus   = require './src/stimulus'
Module     = require './src/module'
Response   = require './src/response'

module.exports = {
    Brain
    Speech
    Module
    Stimulus
}

module.exports.load = ->
    return new Brain()