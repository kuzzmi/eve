colors = require 'colors'

class BaseModel
    constructor: (obj) ->
        @parsed = @parse obj.title
        @link = obj.viewItemURL
        if obj.sellingStatus.convertedCurrentPrice
            currency = Object.keys(obj.sellingStatus.convertedCurrentPrice)[0]
            @price = obj.sellingStatus.convertedCurrentPrice[currency] + ' ' + currency
        
    parse: ->

    summarize: (details) ->
        report = ['']

        report.push '        Price: '.yellow + @price.yellow.bold
        report.push '         Link: '.yellow + @link

        report = report.concat details

        report.join '\r\n'

module.exports = BaseModel