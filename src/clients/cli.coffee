readline = require 'readline'
colors   = require 'colors'

class CLI
    constructor: (Eve, @argv) ->
        # `process.stdout.write('\033c')`

        Eve.brain.on 'output', (output) =>
            if output.text
                @print output.text
        
        @rl = readline.createInterface 
            input: process.stdin,
            output: process.stdout
        
        @rl.on 'line', (line) =>
            Eve.brain.emit 'input', line
            @rl.prompt true

        @rl.setPrompt 'Igor: '
        @rl.prompt true

        if @argv.c
            Eve.brain.emit 'input', {
                intent: @argv.c
            }

    print: (data) ->
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        console.log 'Eve: '.bold.cyan + data

        @rl.prompt true
    

module.exports = CLI