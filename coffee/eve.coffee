Core = require './core'
CLI  = require './cli'
WS   = require './webserver'
argv = require('minimist')(process.argv.slice(2))

core = new Core()

cli  = new CLI core, argv
ws   = new WS  core

# { Brain } = require './core'
# { EventEmitter } = require 'events'

# class Eve
# 	constructor: () ->

