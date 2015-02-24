BaseModule  = require '../base'
request     = require 'request'
Q           = require 'q'
colors      = require 'colors'
todoist     = require 'node-todoist'
config      = require './config'
moment      = require 'moment'
utils       = require '../../common/utils'

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

        credentials =
            email    : config.email
            password : config.password

        todoist.login credentials
            .then (user) =>
                @token = user.api_token
                user
            .then deferred.resolve

        deferred.promise

    getProjects: ->
        deferred = Q.defer()
        todoist.request 'getProjects'
            .then (result) ->
                console.log result
                deferred.resolve
                    voice:
                        phrase: 'Reminder added'
        deferred.promise

    getUncompletedItems: ->
        deferred = Q.defer()

        params =
            project_id: config.projects.PROJECTS


        todoist.request 'getUncompletedItems', params
            .then (response) ->
                console.log response
                deferred.resolve 
                    voice: 
                        phrase: 'You have ' + response.length + ' tasks'

        deferred.promise

    query: (query) ->
        deferred = Q.defer()

        queries = query.split ','
            .map (q) ->
                q.trim()

        params = 
            queries: JSON.stringify(queries)

        # console.log params

        todoist.request 'query', params
            .then (response) ->
                # console.log response
                deferred.resolve response

        deferred.promise

    addItem: ->
        deferred = Q.defer()

        if typeof @item is 'string'

            item = 
                content     : utils.capitalize @item
                token       : @token
                priority    : @priority
                date_string : @datetime
            

            todoist.request 'addItem', item
                .then ->
                    deferred.resolve
                        voice:
                            phrase: 'Reminder added'
            
        else
            console.log @item

        deferred.promise

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
                                .then (response) ->
                                    response.reduce (a, b) ->
                                        a + b.data.length
                                    , 0
                                .then (amount) ->
                                    voice: 
                                        phrase: 'You have ' + amount + ' tasks'
                .then (response) ->
                    super 
                        .then deferred.resolve
                .catch (e) ->
                    console.log e

        deferred.promise

module.exports = Planning