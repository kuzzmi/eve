BaseModule = require '../base'
git        = require 'git-promise'
gitUtils   = require 'git-promise/util'
versiony   = require 'versiony'
fs         = require 'fs'

TwitterModule = require '../twitter'

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
                            phrase = 'Everything is up-to-date, sir'
                            super 
                                text: phrase
                                voice: 
                                    phrase: phrase
                                notification: 
                                    text: phrase
                        else 
                            super 
                                text: report
                                voice: 
                                    phrase: report
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
                modulesDirs = getDirs(process.cwd() + '/coffee/modules')

                modulesFile = process.cwd() + '/modules.json'
                modules = require modulesFile

                if modulesDirs.length isnt modules.list.length
                    newModule = null
                    for dir in modulesDirs
                        found = !!~modules.list.indexOf dir
                        if not found
                            newModule = dir
                            break

                    twitter = new TwitterModule()
                    twitter.tweetAboutNewModule newModule

                    modules.list.push newModule
                    modules.list = modules.list.sort()
                    
                    fs.writeFileSync modulesFile, JSON.stringify modules, null, 4
                    
                    versiony
                        .from 'package.json'
                        .minor modulesDirs.length
                        .patch 0
                        .to 'package.json'
                else 
                    versiony
                        .from 'package.json'
                        .patch()
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