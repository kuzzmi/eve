BaseModule = require '../base'
git        = require 'git-promise'
gitUtils   = require 'git-promise/util'
versiony   = require 'versiony'
fs         = require 'fs'

class Git extends BaseModule
    constructor: (@params) ->
        super @params
        @action = @getEntity 'git_action', 'status'
        @repo   = @getEntity 'git_repo',   'eve'

    getDirs = (rootDir) ->
        files = fs.readdirSync(rootDir)
        dirs = []

        for file in files
            if file[0] != '.'
                filePath = "#{rootDir}/#{file}"
                stat = fs.statSync(filePath)

                if stat.isDirectory()
                    dirs.push(file)

        return dirs

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
                            super 
                                text: 'Everything is up-to-date, sir'
                                notification: 
                                    text: 'Everything is up-to-date, sir'
                        else 
                            super 
                                text: report
                                notification: 
                                    text: report

            when 'pull'
                git 'pull origin master'
                    .then (output) ->
                        pkg = require process.cwd() + '/package.json'
                        phrase = 'Updated to v.' + pkg.version
                        super
                            text: phrase
                            voice: 
                                phrase: 'Update completed'
                            notification:
                                text: phrase

            when 'push'
                modulesCount = getDirs(process.cwd() + '/coffee/modules').length

                versiony
                    .from 'package.json'
                    .patch()
                    .minor(modulesCount)
                    .to 'package.json'

                git 'add -A'
                    .then ->
                        git 'commit -m "[Eve] Uploaded at ' + new Date() + '"'
                    .then ->
                        git 'push origin master'
                    .then ->
                        pkg = require process.cwd() + '/package.json'
                        phrase = 'Uploaded v.' + pkg.version
                        super 
                            text: phrase
                            voice: 
                                phrase: 'Upload completed'
                            notification:
                                text: phrase
                
module.exports = Git