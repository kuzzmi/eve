Core = require './core'
CLI  = require './cli'
WS   = require './webserver'
argv = require('minimist')(process.argv.slice(2))

core = Core.init()
cli  = new CLI core, argv
ws   = new WS  core