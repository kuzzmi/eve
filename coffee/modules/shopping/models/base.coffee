colors = require 'colors'

class BaseModel
    constructor: (obj) ->
        @title = obj.title
        @category = obj.primaryCategory.categoryName
        @parsed = @parse obj.title
        @condition = obj.condition.conditionDisplayName
        @link = obj.viewItemURL

        @listingType = obj.listingInfo.listingType
        
        @type = 'Other'
        @price = '$' + obj.sellingStatus.convertedCurrentPrice.USD

        switch @listingType
            when 'Auction'
                @type = @listingType
                @price = '$' + obj.sellingStatus.convertedCurrentPrice.USD
            when 'AuctionWithBIN'
                @type = 'Auction with Buy It Now'
                @price = '$' + obj.sellingStatus.convertedCurrentPrice.USD
                @BINprice = '$' + obj.listingInfo.convertedBuyItNowPrice.USD
            when 'FixedPrice'
                @type = 'Fixed price'
                @price = '$' + obj.sellingStatus.convertedCurrentPrice.USD
            when 'StoreInventory'
                @type = 'Store inventory'
                @price = '$' + obj.sellingStatus.convertedCurrentPrice.USD
        
    parse: ->

    formatProperty: (key, value) ->
        prependWithSpaces = (string, total) ->
            if total - string.length + 1 < 0
                return
                
            spaces = new Array(total - string.length + 1)
                .join ' '
            spaces + string

        formatted = (prependWithSpaces(key, 15) + ': ').yellow + value

    summarize: (details) ->
        report = ['']

        report.push @formatProperty 'Title', @title
        report.push @formatProperty 'Category', @category
        report.push @formatProperty 'Condition', @condition

        if details
            report = report.concat details
        
        report.push @formatProperty ': : : : ', ''
        report.push @formatProperty 'Type', @type.bold
        report.push @formatProperty 'Price', @price.yellow.bold
        if @BINprice
            report.push @formatProperty 'Buy It Now', @BINprice.green.bold
        report.push @formatProperty 'Link', @link

        report.push ''

        report.join '\r\n'

module.exports = BaseModel