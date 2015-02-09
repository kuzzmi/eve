function TimeIntent(params) {

};

TimeIntent.prototype._getHumanLikeTime = function(date) {
    date = date || new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    if (minutes > 0) {
        if (minutes < 30) {
            return minutes + ' minutes past ' + hours;
        } else {
            return (60 - minutes) + ' to ' + (hours + 1);
        }
    } else {
        return hours + ' hours';
    }
}

TimeIntent.prototype.exec = function(params) {
    return this._getHumanLikeTime();
}

module.exports = function(params) {
    return new TimeIntent(params);
}