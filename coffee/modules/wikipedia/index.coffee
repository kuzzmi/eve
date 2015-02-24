BaseModule  = require '../base'
request     = require 'request'
Q           = require 'q'
WikiScraper = require 'wikiscraper'
colors      = require 'colors'

class Wiki extends BaseModule
    constructor: (@params, @action) ->
        super @params

        @query = @getEntity 'wikipedia_search_query', null
        @action = @getEntity 'wikipedia_action', null

    reportFromJson: (properName, description, data) ->
        reportData = data.infobox.fields;

        prependWithSpaces = (string, total) ->
            spaces = new Array(total - string.length + 1)
                .join ' '
            spaces + string

        longest = 0

        for k, v of reportData
            if longest < k.length
                longest = k.length

        strings = ['']
        strings.push prependWithSpaces('Title', longest).yellow + ': ' + (properName + '').yellow.bold
        strings.push prependWithSpaces('Description', longest).yellow + ': ' + description
        strings.push '';

        for k, v of reportData
            desc = prependWithSpaces k.replace(/\n/g, ''), longest
            strings.push (desc + ': ').yellow + 
                (v.replace /\n\nList\n\n/g, ''
                    .replace /\n/g, '; '
                    .replace /^; /g, ''
                    .replace /(; ){2,}/g, '')

        strings.join '\n'
        

    exec: ->
        deferred = Q.defer()

        response = {
            text    : null,
            voice   : null,
            actions : null
        }

        url = 'http://en.wikipedia.org/w/api.php'

        qs =
            action    : 'opensearch'
            search    : @query
            limit     : 1
            namespace : 0
            format    : 'json'

        request {
            url: url,
            qs: qs
        }, (err, res, body) =>
            if err then deferred.reject err

            data = JSON.parse body

            if data[2].length is 0 then deferred.reject 'Sorry, nothing found about' + @query

            properName = data[1]

            description = data[2][0]

            wikiscraper = new WikiScraper [properName]
            
            wikiscraper.scrape (err, element) =>

                if err 
                    deferred.reject err

                response.text = @reportFromJson properName, description, element
                response.voice = {
                    phrase: description
                        .replace /(\s*\([^)]*\))/g, ''
                }
            
                super response
                    .then deferred.resolve

        deferred.promise


module.exports = Wiki