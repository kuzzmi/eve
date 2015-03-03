colors = require 'colors'

class BaseModel
    constructor: (obj) ->
        @title = obj.title
        @category = obj.primaryCategory.categoryName
        @parsed = @parse obj.title
        @link = obj.viewItemURL
        if obj.sellingStatus.convertedCurrentPrice
            currency = Object.keys(obj.sellingStatus.convertedCurrentPrice)[0]
            @price = obj.sellingStatus.convertedCurrentPrice[currency] + ' ' + currency
        
    parse: ->

    formatProperty: (key, value) ->

        prependWithSpaces = (string, total) ->
            spaces = new Array(total - string.length + 1)
                .join ' '
            spaces + string

        formatted = (prependWithSpaces(key, 15) + ': ').yellow + value

    summarize: (details) ->
        report = ['']

        report.push @formatProperty 'Title', @title
        report.push @formatProperty 'Category', @category

        if details
            report = report.concat details

        report.push @formatProperty 'Price', @price.yellow.bold
        report.push @formatProperty 'Link', @link

        report.push ''

        report.join '\r\n'

module.exports = BaseModel