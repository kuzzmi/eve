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

exports.humanLikeTime = function(date) {
    date = date || new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    
    if (minutes > 0) {
        if (minutes < 15) {
            return minutes + ' minutes past ' + hours;
        } else if (minutes === 15) {
            return 'Quarter past ' + hours;
        } else if (minutes < 30) {
            return minutes + ' minutes past ' + hours;
        } else if (minutes === 30) {
            return 'Half past ' + hours;
        } else if (minutes < 45) {
            return (60 - minutes) + ' to ' + (hours + 1);
        } else if (minutes === 45) {
            return 'Quarter to ' + (hours + 1);
        } else if (minutes < 60) {
            return (60 - minutes) + ' to ' + (hours + 1);
        }
    } else {
        return hours + ' o\'clock';
    }
}