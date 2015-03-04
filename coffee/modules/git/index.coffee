BaseModule = require '../base'
Utils      = require '../../common/utils'
git        = require 'git-promise'
gitUtils   = require 'git-promise/util'
versiony   = require 'versiony'
fs         = require 'fs'
Helper     = require './helpers'

TwitterModule = require '../twitter'

class Git extends BaseModule
    constructor: (@params) ->
        super @params
        @action = @getEntity 'git_action', 'status'
        @repo   = @getEntity 'git_repo',   'eve'

    push: ->
        newModule = Helper.getNewModule()

        if newModule
            # twitter = new TwitterModule()
            # twitter.tweetAboutNewModule newModule

            Helper.addNewModule newModule
            modules = Helper.getCurrentModules()

            console.log newModule
            
            versiony
                .from 'package.json'
                .minor modules.length
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
                pkg = Utils.file2json 'package.json'
                phrase = 'Uploaded v' + pkg.version
                response =
                    text: phrase
                    voice: 
                        phrase: 'Upload completed'
                    notification:
                        text: phrase
                return response

    pull: -> 
        git 'pull origin master'
            .then (output) ->
                pkg = require process.cwd() + '/package.json'
                phrase = 'Updated to v' + pkg.version
                response =
                    text: phrase
                    voice: 
                        phrase: 'Update completed'
                    notification:
                        text: phrase
                return response

    status: ->
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

                formatChange = (change, text) ->
                    if change > 0
                        report += text + ' ' + change + ' file'
                        if change > 1 then report += 's'
                        report += '. '

                formatChange modified, 'Modified'
                formatChange    added, 'Added'
                formatChange  deleted, 'Deleted'
                formatChange  renamed, 'Renamed'
                formatChange   copied, 'Copied'

                if report.length is 0
                    report = 'Everything is up-to-date, sir'

                response = 
                    text: report
                    voice: 
                        phrase: report
                    notification: 
                        text: report
                return response

    exec: ->
        switch @action
            when 'status'
                @status()
                    .then super

            when 'pull'
                @pull()
                    .then super

            when 'push'
                @push()
                    .then super
                
module.exports = Git