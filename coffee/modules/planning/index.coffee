BaseModule  = require '../base'
request     = require 'request'
Q           = require 'q'
colors      = require 'colors'
todoist     = require 'node-todoist'
config      = require './config'

class Planning extends BaseModule
    constructor: (@params, @selection) ->
        super @params

        @action = @getEntity 'planning_action', null
        @item = @getEntity 'agenda_entry', null
        @priority = @getEntity 'planning_priority', 1

        if @entities and @entities.datetime         
            @datetime = @entities.datetime[0]
        else 
            @datetime = {
                value : 'tomorrow'
            }

        console.log @datetime

        @loggedIn = no

    login: ->
        deferred = Q.defer()

        credentials = {
            email: config.email,
            password: config.password
        } 

        todoist.login credentials
            .then (user) =>
                @token = user.api_token
                user
            .then deferred.resolve

        deferred.promise

    getProjects: ->
        deferred = Q.defer()
        todoist.request 'getProjects'
            .then deferred.resolve
        deferred.promise

    addTask: ->
        deferred = Q.defer()

        item = {
            content: @item,
            token: @token,
            priority: @priority,
            date_string: @datetime.value
        }

        todoist.request 'addItem', item
            .then deferred.resolve
        deferred.promise

    exec: ->
        deferred = Q.defer()

        if not @loggedIn
            @login()
                .then =>
                    @addTask()
                .then (response) ->
                    super {
                        text: 'Done',
                        voice: {
                            phrase: 'Reminder added'
                        }
                    }
                        .then deferred.resolve

        deferred.promise

module.exports = Planning