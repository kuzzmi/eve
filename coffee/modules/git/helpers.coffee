Utils = require '../../common/utils'
fs    = require 'fs'

exports.getDirs = (rootDir) ->
    files = fs.readdirSync(rootDir)
    dirs = []

    for file in files
        if file[0] != '.'
            filePath = "#{rootDir}/#{file}"
            stat = fs.statSync(filePath)

            if stat.isDirectory()
                dirs.push(file)

    return dirs

exports.getCurrentModules = ->
    return @getDirs(process.cwd() + '/coffee/modules')

exports.getNewModule = ->
    modulesDirs = @getDirs(process.cwd() + '/coffee/modules')

    modules = Utils.file2json 'modules.json'

    newModule = null

    if modulesDirs.length isnt modules.list.length
        for dir in modulesDirs
            found = !!~modules.list.indexOf dir
            if not found
                newModule = dir
                break

    return newModule

exports.addNewModule = (module) ->
    modules = Utils.file2json 'modules.json'

    modules.list.push module
    modules.list = modules.list.sort()
    
    Utils.json2file 'modules.json', modules