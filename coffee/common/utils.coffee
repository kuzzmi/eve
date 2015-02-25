exports.capitalize = (string) ->
	string[0].toUpperCase() + string.slice(1)

exports.randomInt = (min, max) ->
	Math.floor(Math.random() * (max - min + 1)) + min