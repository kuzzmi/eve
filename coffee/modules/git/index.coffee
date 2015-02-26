BaseModule = require '../base'
git        = require 'git-promise'
gitUtils   = require 'git-promise/util'

class Git extends BaseModule
    constructor: (@params) ->
        super @params
        @action = @getEntity 'git_action', 'status'
        @repo   = @getEntity 'git_repo',   'eve'
        # @name = @getEntity 'reference_name_type', 'neutral'
        # @vocabulary = __dirname + '/vocabulary.json'

    exec: ->
        params = 
            cwd: process.cwd()

        switch @action
            when 'status'
                git 'status --porcelain'
                    .then (output) ->
                        parsedOutput = gitUtils.extractStatus output

                        console.log JSON.stringify parsedOutput, null, 4

                        super 
                            text: parsedOutput

            when 'push'
                git 'add -A'
                    .then ->
                        git 'commit -m "[Eve] Uploaded at ' + new Date() + '"'
                    .then ->
                        git 'push origin master'
                    .then (output) ->
                        super output
                
module.exports = Git