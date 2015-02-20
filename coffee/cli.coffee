readline = require 'readline'
colors   = require 'colors'

class CLI
    constructor: (@core, @argv) ->
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

        @rl.setPrompt 'Igor: '
        @rl.prompt true

        if @argv.c
            @core.brain.emit 'input', {
                intent: @argv.c
            }

    say: (data) ->
        @core.speech.exec data

    print: (data) ->
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        console.log 'Eve: ' + data

        @rl.prompt true
    

module.exports = CLI