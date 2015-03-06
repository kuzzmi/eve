BaseModule = require '../base'
Utils      = require '../../common/utils'
git        = require 'git-promise'
gitUtils   = require 'git-promise/util'
versiony   = require 'versiony'
fs         = require 'fs'
Helper     = require './helpers'
Infrared   = require '../../api-clients/infrared'

TwitterModule = require '../twitter'

class Git extends BaseModule
    push: ->
        Infrared.led 'green'
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
            .then -> git 'commit -m "[Eve] Uploaded at ' + new Date() + '"'
            .then -> git 'push origin master'
            .then ->
                Infrared.led 'white'
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
                pkg = Utils.file2json 'package.json'
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
                tree = gitUtils.extractStatus output
                    .workingTree

                modified = tree.modified.length
                added    = tree.added.length
                deleted  = tree.deleted.length
                renamed  = tree.renamed.length
                copied   = tree.copied.length

                report   = ''

                formatChange = (change, text) ->
                    if change is 0 then return                    
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
        switch @params.git_action.value
            when 'status' then @status().then super
            when 'pull'   then   @pull().then super
            when 'push'   then   @push().then super

module.exports = Git