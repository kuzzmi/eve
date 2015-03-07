exports.capitalize = (string) ->
    string[0].toUpperCase() + string.slice(1)

exports.randomInt = (min, max) ->
    Math.floor(Math.random() * (max - min)) + min

exports.file2json = (file, cwd = process.cwd()) ->
    fs = require 'fs'
    return JSON.parse(fs.readFileSync cwd + '/' + file)
    
exports.json2file = (file, data, cwd = process.cwd()) ->
    fs = require 'fs'
    fs.writeFileSync cwd + '/' + file, JSON.stringify data, null, 4

exports.getCallersDir = ->
    Path = require 'path'
    Stack = require 'callsite'

    stack = Stack()
    caller = stack[1].getFileName()
    return Path.dirname(caller)