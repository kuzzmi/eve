class GenericForecast
    constructor: (params, type) ->
        
        SpecificForecast = require './forecasts/' + type + 'Forecast'

        @item       = new SpecificForecast params
        @vocabulary = __dirname + '/vocabulary.json'

    toString: (params) ->

        result = @item.toString params

        
        {
            voice:
                vocabulary: @vocabulary
                code: result[0].code
                args: result[0].args
            text:
                result[1]
        }

module.exports = GenericForecast