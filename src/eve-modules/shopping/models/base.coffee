Q      = require 'q'
colors = require 'colors'
ebay   = require 'ebay-api'

class BaseModel
    constructor: (obj) ->
        @id          = obj.itemId
        @title       = obj.title
        @category    = obj.primaryCategory.categoryName if obj.primaryCategory
        @condition   = obj.condition.conditionDisplayName if obj.condition
        @link        = obj.viewItemURL
        @listingType = obj.listingInfo.listingType if obj.listingInfo
        @parsed      = @parse obj.title
        
        @type        = 'Other'
        @price       = '$' + obj.sellingStatus.convertedCurrentPrice.USD

        switch @listingType
            when 'Auction'
                @type  = @listingType
                @price = '$' + obj.sellingStatus.convertedCurrentPrice.USD
            when 'AuctionWithBIN'
                @type     = 'Auction with Buy It Now'
                @price    = '$' + obj.sellingStatus.convertedCurrentPrice.USD
                @BINprice = '$' + obj.listingInfo.convertedBuyItNowPrice.USD
            when 'FixedPrice'
                @type  = 'Fixed price'
                @price = '$' + obj.sellingStatus.convertedCurrentPrice.USD
            when 'StoreInventory'
                @type  = 'Store inventory'
                @price = '$' + obj.sellingStatus.convertedCurrentPrice.USD

    parse: ->

    formatProperty: (key, value) ->
        prependWithSpaces = (string, total) ->
            if total - string.length + 1 < 0
                return
                
            spaces = new Array(total - string.length + 1)
                .join ' '
            spaces + string

        if value
            formatted = (prependWithSpaces(key, 15) + ': ').yellow + value
        else
            formatted = prependWithSpaces(key, 15).yellow

    getShippingInfo: ->
        # ebay.ebayApiGetRequest {
        #     'serviceName': 'Shopping',
        #     'opType': 'GetSingleItem',
        #     'appId': 'IgorKuzm-e6eb-4580-8a63-f7a888125783',

        #     params: {
        #         'ItemId': '1234567890'
        #     }
        # }, (error, data) ->
        #     if error then throw error
        #     console.dir(data);
        console.log @id
        # request = 
        #     serviceName : 'Shopping'
        #     opType      : 'GetShippingCosts'
        #     appId       : 'IgorKuzm-e6eb-4580-8a63-f7a888125783'
        #     params      : 
        #         ItemId: @id

        # ebay.ebayApiGetRequest request, (err, data) ->
        #     console.log data

    summarize: (details) ->
        deferred = Q.defer()

        report = ['']

        report.push @formatProperty 'Title', @title
        report.push @formatProperty 'Category', @category
        report.push @formatProperty 'Condition', @condition

        if details
            report = report.concat details
        
        report.push @formatProperty '====='
        report.push @formatProperty 'Type', @type.bold
        if @BINprice
            report.push @formatProperty 'Price', @price.green.bold
            report.push @formatProperty 'Buy It Now', @BINprice.yellow.bold
        else
            if @listingType is 'Auction'
                report.push @formatProperty 'Price', @price.green.bold
            else
                report.push @formatProperty 'Price', @price.yellow.bold
        report.push @formatProperty 'Link', @link

        report.push ''

        deferred.resolve report.join '\r\n'

        deferred.promise

module.exports = BaseModel