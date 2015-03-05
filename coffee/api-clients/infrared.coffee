exec = require 'ssh-exec'

params = 
    user     : 'pi'
    host     : '192.168.0.9'
    password : 'raspberry'

connection = exec.connection params

module.exports = 
    led: (command) ->
        root = '/home/pi/bin/'

        com = switch command
            when 'bright' then 'led-bright'
            when 'dim' then 'led-dim'
            else 'led ' + command
        
        exec root + com, connection
            .pipe(process.stdout)