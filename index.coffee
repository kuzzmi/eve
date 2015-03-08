Brain      = require './src/brain'
Memory     = require './src/memory'
Speech     = require './src/speech'
Stimulus   = require './src/stimulus'
Module     = require './src/module'
Client     = require './src/client'
Response   = require './src/response'

module.exports = {
    Brain
    Speech
    Module
    Client
    Stimulus
}

module.exports.load = ->
    return new Brain()