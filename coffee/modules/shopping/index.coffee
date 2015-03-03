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
            , (error, items) =>
                if error then deferred.reject error

                # console.log()
                # console.log items.length + ' items found:'

                items = items.sort (a, b) ->
                    a.sellingStatus.convertedCurrentPrice - 
                        b.sellingStatus.convertedCurrentPrice

                response =
                    text: '',
                    voice: 
                        phrase: 'I\'ve found some good deals for ' + @query
                

                for item in items
                    modelName = Categories[item.primaryCategory.categoryName]

                    try
                        Model = require './models/' + modelName
                    catch e
                        Model = require './models/base'
                    
                    model = new Model item

                    response.text += model.summarize()

                super response
                    .then deferred.resolve

        deferred.promise
        
module.exports = Shopping