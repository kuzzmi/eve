todoist = require 'node-todoist'
config  = require './config'
Q       = require 'q'

exports.query = (query) ->
    deferred = Q.defer()

    queries = query.split ',' 
        .map (q) -> q.trim()

    params = 
        queries: JSON.stringify(queries)

    todoist.request 'query', params
        .then (response) -> deferred.resolve response

    deferred.promise

exports.getProjects: ->
    deferred = Q.defer()
    todoist.request 'getProjects'
        .then (result) -> deferred.resolve
    deferred.promise

exports.login = ->
    deferred = Q.defer()

    credentials =
        email    : config.email
        password : config.password

    todoist.login credentials
        .then deferred.resolve

    deferred.promise

exports.addItem = (item) ->
	deferred = Q.defer()

	todoist.request 'addItem', item
	    .then deferred.resolve

	deferred.promise


getUncompletedItems: (id) ->
    deferred = Q.defer()

    params =
        project_id: id || config.projects.PROJECTS

    todoist.request 'getUncompletedItems', params
        .then (response) -> deferred.resolve response

    deferred.promise
