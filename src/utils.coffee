Path = require 'path'
Stack = require 'callsite'
Fs = require 'fs'
Path = require 'path'

exports.capitalize = (string) ->
    string[0].toUpperCase() + string.slice(1)

exports.randomInt = (min, max) ->
    if max?
        Math.floor( Math.random() * (max - min) ) + min
    else
        Math.floor( Math.random() * min )

exports.file2json = (file, path = process.cwd()) ->
    full = Path.join path, file
    if Fs.existsSync(full)
        return JSON.parse(Fs.readFileSync full)
    
exports.json2file = (file, data, path = process.cwd()) ->
    full = Path.join path, file
    Fs.writeFileSync full, JSON.stringify data, null, 4

exports.getCallersDir = ->
    stack = Stack()
    caller = stack[2].getFileName()
    return Path.dirname(caller)