BaseModule  = require '../base'
request     = require 'request'
Q           = require 'q'
colors      = require 'colors'
fs          = require 'fs'
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
                when 'second' || 'hour'
                    @datetime = moment @datetime.value
                        .format 'MMM DD h:mm a'
                when 'interval'
                    @datetime = moment @datetime.to.value
                        .format 'MMM DD h:mm a'
                when 'day' 
                    @datetime = moment @datetime.value
                        .format 'DD MMM'
            
        else
            @datetime = 'tomorrow'

    login: ->
        deferred = Q.defer()

        filename = __dirname + '/todoist_token'

        if fs.exists filename
            @token = fs.readFileSync filename
            deferred.resolve()
        else 
            API.login()
                .then (user) ->
                    fs.writeFileSync filename, user.api_token
                    @token = user.api_token
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
                .then (item) ->
                    deferred.resolve
                        voice:
                            phrase: 'Reminder added'
                        notification:
                            text: 'Task "' + utils.capitalize(@item) + '" added'
            
        else
            console.log @item

        deferred.promise

    count: (query) ->
        @query query
            .then (response) =>
                response.reduce (a, b) -> 
                        a + b.data.length
                    , 0
            .then (amount) ->
                if amount is 0
                    voice:
                        phrase: 'You have no tasks, sir'
                else
                    voice: 
                        phrase: 'You have ' + amount + ' tasks'

    report: ->
        query = []

        if @datetime is 'tomorrow'
            query.push 'today'
        else
            query.push @datetime

        query.push 'overdue'

        if @tag
            query.push '@' + @tag

        @query query
            .then (response) =>
                list = []
                tasks = []
                report = ['']

                response.map (item) ->
                    tasks = tasks.concat item.data

                if tasks.length is 0
                    return voice:
                            phrase: 'You have no tasks'

                tasks.map (task) ->
                    taskString = ''

                    if task.due_date
                        duedate = moment new Date(task.due_date)

                        if task.has_notification
                            taskString += duedate.format 'MM/DD h:mm a' + ' '
                        else
                            taskString += duedate.format 'MM/DD' + ' '
                        
                        if duedate < new Date()
                            taskString = taskString.red
                        else
                            taskString = taskString.green

                    taskString += task.content

                    report.push '    ' + taskString
                    list.push task.content

                report.push '    Total: '.yellow + tasks.length.toString().yellow.bold

                text:
                    report.join '\r\n'
                voice:
                    phrase: 'Here is a list of your tasks, sir'
                notification:
                    list: list

    exec: ->
        deferred = Q.defer()
        
        if not @loggedIn
            @login()
                .then () =>
                    switch @action
                        when 'report'
                            @report()
                        when 'count_at_home'
                            @count ['overdue', 'today', '@home']
                        when 'remind'
                            @addItem()
                        when 'count'
                            @count ['overdue', 'today']
                .then (response) ->
                    super 
                        .then deferred.resolve
                .catch (e) ->
                    console.log e
                    deferred.reject e

        deferred.promise

module.exports = Planning