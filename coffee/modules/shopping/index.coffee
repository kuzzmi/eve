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
            keywords        : [ @query            ]
            outputSelector  : [ 'AspectHistogram' ]
            # sortOrder       : [ 'PricePlusShippingLowest' ]
            
            'paginationInput.entriesPerPage' : 5

        filters =
            itemFilter   : [ new ebay.ItemFilter 'AvailableTo', 'CH'          ]
            domainFilter : [ new ebay.ItemFilter 'domainName' , 'Electronics' ]

        request = 
            serviceName : 'FindingService'
            opType      : 'findItemsByKeywords'
            appId       : 'IgorKuzm-e6eb-4580-8a63-f7a888125783'
            params      : params
            filters     : filters
            parser      : ebay.parseItemsFromResponse

                
        request2 = 
            serviceName : 'Shopping'
            opType      : 'GetShippingCosts'
            appId       : 'IgorKuzm-e6eb-4580-8a63-f7a888125783'
            params      : 
                ItemId: 251864346746

        ebay.ebayApiGetRequest request2, (err, data) ->
            console.log err
            console.log err.stack
            console.log data
            super 'aaa'
                .then deferred.resolve
        # ebay.ebayApiGetRequest request
        #     , (error, items) =>
        #         if error then deferred.reject error

        #         phrase = 'I\'ve found some good deals about ' + @query

        #         response =
        #             text: phrase + '\r\n',
        #             voice: 
        #                 phrase: phrase

        #         models = items.map (item) ->
        #             modelName = Categories[item.primaryCategory.categoryName]
        #             try
        #                 Model = require './models/' + modelName
        #             catch e
        #                 Model = require './models/base'
                    
        #             model = new Model item
        #             return model

        #         models[0].getShippingInfo()
                
        #         for model in models
        #             model.summarize()
        #                 .then (summary) ->
        #                     response.text += summary

        #         super response
        #             .then deferred.resolve

        deferred.promise
        
module.exports = Shopping