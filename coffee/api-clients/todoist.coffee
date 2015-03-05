todoist = require 'node-todoist'
Q       = require 'q'
Utils   = require '../common/utils'

config  = Utils.file2json('.everc').todoist

exports.query = (query) ->

    convertedQuery = JSON.stringify(query)

    params = 
        queries: convertedQuery
    todoist.request 'query', params
        .then (result) -> deferred.resolve result

    deferred.promise

exports.getProjects = ->
    todoist.request 'getProjects'
        .then (result) -> deferred.resolve result
    deferred.promise

exports.getLabels = ->
    todoist.request 'getLabels'
        .then (result) -> deferred.resolve result
    deferred.promise

exports.login = ->

    credentials =
        email    : config.email
        password : config.password

    todoist.login credentials
        .then deferred.resolve

    deferred.promise

exports.addItem = (item) ->
	return todoist.request 'addItem', item