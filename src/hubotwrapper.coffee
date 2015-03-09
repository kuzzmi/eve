Module = require './module'

class HubotWrapper extends Module
    @wrap: (module, Eve) ->
        robot         = extend {}, Eve
        robot.brain   = Eve.memory
        robot.respond = (regexp, callback) =>
            re = regexp.toString().split('/')
            re.shift()
            modifiers = re.pop()

            if re[0] and re[0][0] is '^'
                @logger.warning \
                    "Anchors don't work well with respond, perhaps you want to use 'hear'"
                @logger.warning "The regexp in question was #{regexp.toString()}"

            pattern = re.join('/')
            name = Eve.name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

            if @alias
                alias = @alias.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
                newRegex = new RegExp(
                    "^\\s*[@]?(?:#{alias}[:,]?|#{name}[:,]?)\\s*(?:#{pattern})"
                    modifiers
                )
            else
                newRegex = new RegExp(
                    "^\\s*[@]?#{name}[:,]?\\s*(?:#{pattern})",
                    modifiers
                )
            Eve.parser.addListener(newRegex, callback)
        robot.hear    = (regexp, callback) =>
            Eve.parser.addListener(regexp, callback)

        module robot

extend = (obj, sources...) ->
    for source in sources
        obj[key] = value for own key, value of source
    obj

module.exports = HubotWrapper