class Stimulus

    constructor: (params) ->
        
        @_text = params._text
        @intent = params.intent
        @entities = params.entities
        @confidence = params.confidence

    
module.exports = Stimulus