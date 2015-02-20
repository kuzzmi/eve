BaseModule = require '../base'
q = require 'q'

class Wiki extends BaseModule
	constructor: (@params, @action) ->
		super @params

		@query = @getEntity 'wikipedia_search_query', null
		@action = @getEntity 'wikipedia_action', null

	exec: ->
        deferred = q.defer()

		response = {
			text: null,
			voice: null,
			actions: null
		}

		super response

        deferred.promise

module.exports = Wiki