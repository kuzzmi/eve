BaseModule  = require '../base'
request     = require 'request'
Q           = require 'q'
colors      = require 'colors'
todoist     = require 'node-todoist'
config      = require './config'
moment      = require 'moment'
utils       = require '../../common/utils'

API         = require './todoist-api'

class Planning extends BaseModule
    constructor: (@params, @selection) ->
        super @params

        @action   = @getEntity 'planning_action', null
        @item     = @getEntity 'agenda_entry', null
        @priority = @getEntity 'planning_priority', 1

        if @entities and @entities.datetime
            @datetime = @entities.datetime[0]
        else
            @datetime = {
                type  : 'value',
                grain : 'second',
                value : moment().add 1, 'days'
                    .hours 23
                    .minutes 59 
                    .seconds 59
            }

        @datetime = moment @datetime.value
            .format 'MMM Do h:mm a'

        @loggedIn = no

    login: ->
        deferred = Q.defer()
        
        API.login()
            .then (user) =>
                @token = user.api_token
                user
            .then deferred.resolve

        deferred.promise

    getProjects: ->
        deferred = Q.defer()

        API.getProjects()
            .then (result) ->
                console.log result
                deferred.resolve
                    voice:
                        phrase: 'Reminder added'

        deferred.promise

    query: (query) ->
        deferred = Q.defer()

        API.query query
            .then (response) -> deferred.resolve response

        deferred.promise

    addItem: ->
        deferred = Q.defer()

        if typeof @item is 'string'

            item = 
                content     : utils.capitalize @item
                token       : @token
                priority    : @priority
                date_string : @datetime

            API.addItem item
                .then -> deferred.resolve
                    voice:
                        phrase: 'Reminder added'
            
        else
            console.log @item

        deferred.promise

    count: (response) ->
        response.reduce (a, b) -> 
                a + b.data.length
            , 0

    exec: ->
        deferred = Q.defer()

        if not @loggedIn
            @login()
                .then () =>
                    switch @action
                        when 'remind'
                            @addItem()
                        when 'count'
                            @query 'overdue, today'
                                .then (response) =>
                                    @count response
                                .then (amount) ->
                                    voice: 
                                        phrase: 'You have ' + amount + ' tasks'
                .then (response) ->
                    super 
                        .then deferred.resolve
                .catch (e) ->
                    console.log e
                    deferred.reject e

        deferred.promise

module.exports = Planning