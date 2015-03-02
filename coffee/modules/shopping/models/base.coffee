class BaseModel
    constructor: (obj) ->
        @parsed = @parse obj.title
        @link = obj.viewItemURL
        if obj.sellingStatus.convertedCurrentPrice
            currency = Object.keys(obj.sellingStatus.convertedCurrentPrice)[0]
            @price = obj.sellingStatus.convertedCurrentPrice[currency] + ' ' + currency
        
    parse: ->

module.exports = BaseModel