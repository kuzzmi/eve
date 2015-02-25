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
        @tag      = @getEntity 'planning_tag', ''

        if @entities and @entities.datetime
            @datetime = @entities.datetime[0]
            if @datetime.type is 'value' 
                type = @datetime.grain
            if @datetime.type is 'interval' 
                type = 'interval'

            switch type
                when 'second' 
                    @datetime = moment @datetime.value
                        .format 'MMM Do h:mm a'
                when 'hour'
                    @datetime = moment @datetime.value
                        .format 'MMM Do h:mm a'
                when 'interval'
                    @datetime = moment @datetime.to.value
                        .format 'MMM Do h:mm a'
                when 'day' 
                    @datetime = moment @datetime.value
                        .format 'MMM Do'
            
        else
            @datetime = 'tomorrow'


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
                content     : utils.capitalize(@item)
                token       : @token
                priority    : @priority
                date_string : @datetime

            if @tag
                item.labels = JSON.stringify [config.labels[@tag].id]


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
                    console.log @action + ' ? count_at_home'
                    switch @action
                        when 'count_at_home'
                            @query '(overdue, today) & @home'
                                .then (response) =>
                                    console.log response
                                    @count response
                                .then (amount) ->
                                    voice: 
                                        phrase: 'You have ' + amount + ' tasks'
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