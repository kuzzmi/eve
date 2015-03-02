Q          = require 'q'
colors     = require 'colors'
ebay       = require 'ebay-api'
BaseModule = require '../base'
Categories = require './categories.json'

class Shopping extends BaseModule
    constructor: (@params) ->
        super @params

        @query = @getEntity 'search_query', ''

    exec: ->
        deferred = Q.defer()

        params =
            keywords        : [ @query ]
            outputSelector  : [ 'AspectHistogram' ]
            
            'paginationInput.entriesPerPage' : 10

        filters = {}
            # itemFilter   : [ new ebay.ItemFilter 'FreeShippingOnly', true ]
            # domainFilter : [ new ebay.ItemFilter 'domainName', 'Digital_Cameras' ]

        request = 
            serviceName : 'FindingService'
            opType      : 'findItemsByKeywords'
            appId       : 'IgorKuzm-e6eb-4580-8a63-f7a888125783'
            params      : params
            filters     : filters
            parser      : ebay.parseItemsFromResponse

        ebay.ebayApiGetRequest request
            , (error, items) ->
                if error then deferred.reject error

                console.log()
                console.log items.length + ' items found:'

                items = items.sort (a, b) ->
                    a.sellingStatus.convertedCurrentPrice - 
                        b.sellingStatus.convertedCurrentPrice

                for item in items
                    modelName = Categories[item.primaryCategory.categoryName]

                    Model = require './models/' + modelName

                    model = new Model item

                    console.log()
                    console.log '         Color: '.yellow + model.parsed.color
                    console.log '       Storage: '.yellow + model.parsed.storage
                    console.log '  Subscription: '.yellow + model.parsed.subscr
                    console.log '         Price: '.yellow + model.price.bold
                    console.log '          Link: '.yellow + model.link

                    # if item.sellingStatus.convertedCurrentPrice
                    #     currency = Object.keys(item.sellingStatus.convertedCurrentPrice)[0]
                    #     price = item.sellingStatus.convertedCurrentPrice[currency] + ' ' + currency

                    #     console.log '- (' + price + ') ' + item.title

                super 'Done'
                    .then deferred.resolve

        deferred.promise
        
module.exports = Shopping