BaseModule = require '../base'

class Test extends BaseModule
    exec: ->
    	actions = [{
    		code: '1',
    		fn: (response) ->    			
    			delete response.actions
    			response.text = 'Hello'
    			response.voice = { phrase: 'Hello' }
		}, {
    		code: '2',
    		fn: (response) ->    			
    			delete response.actions
    			response.text = 'Bye'
    			response.voice = { phrase: 'Bye' }
		}]

    	response = {
            text: 'Please make a choice:\r\n1. Say "Hello"\r\n2. Say "Bye"',
            actions: actions
        }

    	if @action 
    	    act = actions.filter((action) =>
    	    	action.code is @action
	    	)[0]
    	   	act.fn(response)

    	super response

module.exports = Test