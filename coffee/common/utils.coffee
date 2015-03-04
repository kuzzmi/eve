exports.capitalize = (string) ->
    string[0].toUpperCase() + string.slice(1)

exports.randomInt = (min, max) ->
    Math.floor(Math.random() * (max - min + 1)) + min

exports.file2json = (file) ->
    fs = require 'fs'
    return JSON.parse(fs.readFileSync process.cwd() + '/' + file)
    
exports.json2file = (file, data) ->
    fs = require 'fs'
    fs.writeFileSync process.cwd() + '/' + file, JSON.stringify data, null, 4