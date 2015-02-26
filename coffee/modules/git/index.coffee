BaseModule = require '../base'
git        = require 'git-promise'

class Git extends BaseModule
    constructor: (@params) ->
        super @params
        @action = @getEntity 'git_action', 'status'
        @repo   = @getEntity 'git_repo',   'eve'
        # @name = @getEntity 'reference_name_type', 'neutral'
        # @vocabulary = __dirname + '/vocabulary.json'

    exec: ->
        # now = new Date()
        # hours = now.getHours()
        # timeOfDay = switch
        #     when hours >= 4 and hours < 12 then 'morning'
        #     when hours >= 12 and hours < 18 then 'afternoon'
        #     when hours >= 18 and hours < 23 then 'evening'
        #     else 'night'
        params = 
            cwd: process.cwd()

        switch @action
            when 'status'
                git 'status -sb'
                    .then (output) ->
                        super output

            when 'push'
                git 'add -A'
                    .then ->
                        git 'commit -m "[Eve] Uploaded at ' + new Date() + '"'
                    .then ->
                        git 'push origin/master'
                    .then (output) ->
                        super output
                

        # {
        #     text: {
        #         vocabulary: @vocabulary,
        #         code: @type,
        #         args: [timeOfDay, 'sir']
        #     }
        # }

module.exports = Git