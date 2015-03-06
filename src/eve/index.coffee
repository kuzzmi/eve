{ Brain, Speech } = require './core'
{ EventEmitter  } = require 'events'

io = require('socket.io')

class Eve 
    constructor: () ->
        @brain = new Brain @

        @socket = io port

    subscribe: () ->
        @socket.on 'connection', ->
            console.log 'Hello!'

    say: (phrase) ->
        console.log phrase

eve = new Eve()