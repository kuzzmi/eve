Utils      = require './utils'
Response   = require './response'

class Module
    # This class is for adding basic functionality to modules
    # 
    # In: Eve: Brain, client: Socket, stimulus: Stimulus
    constructor: (@Eve, @client, @stimulus, @metadata) ->
        
        @response = new Response @Eve, @client

        if @stimulus
            for name, entity of @stimulus.entities
                @[name] = entity[0]

        @vocabulary = Utils.file2json 'phrasebook.json', Utils.getCallersDir()

    # This method allows to receive a response from module without
    # actual execution. Useful for linking modules.
    # 
    # Returns Response or Promise<Response>
    # 
    # E.g.:
    #       We have module A and B. If we want to get response from 
    #    A in B to concatenate them, we need to call A.exec() instead 
    #    of creating an object instanceof A.
    @exec: (entities, metadata) ->
        transformed = {}
        for k, v of entities
            transformed[k] = [{ value: v }]

        module = new @(null, null, { entities: transformed }, metadata)
        result = module.exec()

        return result
    
    getValue: (name, def) ->
        if @[name] then @[name].value else def

    # This method allows to pick a random phrase from phrasebook by a
    # code and by replacing arguments.
    # 
    # Returns ready-to-output phrase.
    # 
    # E.g.:
    #       phrasebook: {
    #           foo: {
    #               bar: "{0}"
    #           }
    #       }
    #       code: "foo.bar" (or ['foo', 'bar'])
    #       args: ["baz"] (or [ ['baz', 'qux'] ] to be randomly picked)
    #       
    #       pick code, args:
    #           baz
    pick: (code, args = []) ->
        code = code.split '.' if typeof code is 'string'
        args =         [args] if args not instanceof Array

        phrases = @vocabulary

        for key in code
            phrases = phrases[key]

        r = Utils.randomInt phrases.length
        phrase = phrases[random].replace /\{(\d+)\}/g, (match, number) ->
            if args[number] instanceof Array
                r = Utils.randomInt args[number].length
                return args[number][r]
            else if typeof args[number] isnt 'undefined'
                return args[number] 
            else 
                return match

        return phrase

module.exports = Module