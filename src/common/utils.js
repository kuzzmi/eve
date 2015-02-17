exports.extend = function() {
    var process = function(destination, source) {
        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                destination[key] = source[key];
            }
        }
        return destination;
    };
    var result = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        result = process(result, arguments[i]);
    }
    return result;
};