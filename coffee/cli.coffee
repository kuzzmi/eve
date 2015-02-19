readline = require 'readline'
colors = require 'colors'

class CLI
    constructor: (@core, @params) ->
        @core.brain.on 'output', (output) =>
            if output.text
                @print output.text
            if output.voice
                @say output.voice
        
        @rl = readline.createInterface 
            input: process.stdin,
            output: process.stdout
        
        @rl.on 'line', (line) =>
            @core.brain.emit 'input', line
            @rl.prompt true

        @rl.setPrompt 'Igor: '.green
        @rl.prompt true

    say: (data) ->
        @core.speech.exec data

    print: (data) ->
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        console.log 'Eve: '.magenta + data

        @rl.prompt true
    

module.exports = CLI