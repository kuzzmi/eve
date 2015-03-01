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
                        tree = parsedOutput.workingTree

                        modified = tree.modified.length
                        added    = tree.added.length
                        deleted  = tree.deleted.length
                        renamed  = tree.renamed.length
                        copied   = tree.copied.length

                        report = '';

                        if modified > 0
                            report += 'Modified ' + modified + ' file'
                            if modified > 1 
                                report += 's'
                            report += '. '

                        if added > 0
                            report += 'Added ' + added + ' file'
                            if added > 1 
                                report += 's'
                            report += '. '

                        if deleted > 0
                            report += 'Deleted ' + deleted + ' file'
                            if deleted > 1 
                                report += 's'
                            report += '. '
                        
                        if renamed > 0
                            report += 'Renamed ' + renamed + ' file'
                            if renamed > 1 
                                report += 's'
                            report += '. '
                        
                        if copied > 0
                            report += 'Copied ' + copied + ' file'
                            if copied > 1 
                                report += 's'
                            report += '. '

                        if report.length is 0
                            super 'Everything is up-to-date, sir'
                        else 
                            super report

            when 'pull'
                git 'pull origin master'
                    .then (output) ->
                        super 
                            text: output

            when 'push'
                git 'add -A'
                    .then ->
                        git 'commit -m "[Eve] Uploaded at ' + new Date() + '"'
                    .then ->
                        git 'push origin master'
                    .then ->
                        super 'Upload completed'
                
module.exports = Git