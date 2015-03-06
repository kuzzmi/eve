readline = require 'readline'
colors   = require 'colors'
socket   = require 'socket.io-client'

class CLI
    constructor: (@argv) ->
        Eve = socket('http://localhost:3000')

        Eve.emit 'register', 'cli'

        # socket.on('connect', function(){});
        # socket.on('event', function(data){});
        # socket.on('disconnect', function(){});

        # `process.stdout.write('\033c')`

        Eve.on 'output', (output) =>
            if output.text
                @print output.text
        
        @rl = readline.createInterface 
            input: process.stdin,
            output: process.stdout
        
        @rl.on 'line', (line) =>
            Eve.emit 'input', line
            @rl.prompt true

        @rl.setPrompt 'Igor: '
        @rl.prompt true

        if @argv.c
            Eve.emit 'input', {
                intent: @argv.c
            }

    print: (data) ->
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        console.log 'Eve: '.bold.cyan + data

        @rl.prompt true
    

cli = new CLI({})