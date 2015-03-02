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

        filters =
            # itemFilter   : [ new ebay.ItemFilter 'FreeShippingOnly', true ]
            domainFilter : [ new ebay.ItemFilter 'domainName', 'Electronics' ]

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

                    try
                        Model = require './models/' + modelName                        
                    catch e
                        console.log item.title
                        console.log item.primaryCategory.categoryName
                        continue
                    
                    model = new Model item

                    console.log model.summarize()
                    # console.log()
                    # console.log '      Color: '.yellow + model.parsed.color
                    # console.log '    Storage: '.yellow + model.parsed.storage
                    # console.log '   Unlocked: '.yellow + model.parsed.unlocked
                    # console.log '      Price: '.yellow + model.price.yellow.bold
                    # console.log '       Link: '.yellow + model.link

                    # if item.sellingStatus.convertedCurrentPrice
                    #     currency = Object.keys(item.sellingStatus.convertedCurrentPrice)[0]
                    #     price = item.sellingStatus.convertedCurrentPrice[currency] + ' ' + currency

                    #     console.log '- (' + price + ') ' + item.title

                super 'Done'
                    .then deferred.resolve

        deferred.promise
        
module.exports = Shopping