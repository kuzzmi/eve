googleTranslate = require('google-translate')('AIzaSyCub2LsWQwbEqji0SjVSMGlty0siQ7Fess')

BaseModule = require '../base'
Q = require 'q'

colors = require 'colors'

class Translate extends BaseModule
    constructor: (@params) ->
        super @params

        @phrase = @getEntity 'phrase_to_translate', null
        @from = @getEntity 'from', 'english'
        @to = @getEntity 'to', 'english'

    getLanguageCode: (lang) ->
        langs = {
            afrikaans: 'af',
            albanian: 'sq',
            arabic: 'ar',
            azerbaijani: 'az',
            basque: 'eu',
            bengali: 'bn',
            belarusian: 'be',
            bulgarian: 'bg',
            catalan: 'ca',
            croatian: 'hr',
            czech: 'cs',
            danish: 'da',
            dutch: 'nl',
            english: 'en',
            esperanto: 'eo',
            estonian: 'et',
            filipino: 'tl',
            finnish: 'fi',
            french: 'fr',
            galician: 'gl',
            georgian: 'ka',
            german: 'de',
            greek: 'el',
            gujarati: 'gu',
            hebrew: 'iw',
            hindi: 'hi',
            hungarian: 'hu',
            icelandic: 'is',
            indonesian: 'id',
            irish: 'ga',
            italian: 'it',
            japanese: 'ja',
            kannada: 'kn',
            korean: 'ko',
            latin: 'la',
            latvian: 'lv',
            lithuanian: 'lt',
            macedonian: 'mk',
            malay: 'ms',
            maltese: 'mt',
            norwegian: 'no',
            persian: 'fa',
            polish: 'pl',
            portuguese: 'pt',
            romanian: 'ro',
            russian: 'ru',
            serbian: 'sr',
            slovak: 'sk',
            slovenian: 'sl',
            spanish: 'es',
            swahili: 'sw',
            swedish: 'sv',
            tamil: 'ta',
            telugu: 'te',
            thai: 'th',
            turkish: 'tr',
            ukrainian: 'uk',
            urdu: 'ur',
            vietnamese: 'vi',
            welsh: 'cy',
            yiddish: 'yi'
        }
        langs[lang]

    exec: ->
        deferred = Q.defer()

        response = {
            text: null,
            voice: null,
            actions: null
        }

        to = @getLanguageCode @to
        from = @getLanguageCode @from

        googleTranslate.translate @phrase, from, to, (err, translation) =>
            if err 
                console.log err
                deferred.reject err

            response.text = '\n' +
                ' [' + from.yellow.bold + '] ' + translation.originalText + '\n' +
                ' [' + to.yellow.bold + '] ' + translation.translatedText

            response.voice = {
                phrase: translation.translatedText,
                lang: to
            }

            super response
                .then deferred.resolve

        deferred.promise


module.exports = Translate