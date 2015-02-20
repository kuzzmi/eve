Core = require './core'
CLI  = require './cli'
argv = require('minimist')(process.argv.slice(2))

core = Core.init()
cli  = new CLI core, argv