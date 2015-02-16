var Q = require('q');

function StatusIntent(params) {
    this.action = params.status_action ?
        params.status_action[0].value :
        undefined;
    this.type = params.status_type ?
        params.status_type[0].value :
        undefined;
    this.value = params.status_value ?
        params.status_value[0].value :
        undefined;

    this.vocabulary = __dirname + '/vocabulary.json';
};

StatusIntent.prototype._getHumanLikeTime = function(date) {
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

StatusIntent.prototype.exec = function(callback) {
    var deferred = Q.defer();

    var timeOfDay = function() {
        var now = new Date();
        var hours = now.getHours();
        if (hours >= 4 && hours < 12) {
            return 'morning';
        } else if (hours >= 12 && hours < 18) {
            return 'afternoon';
        } else if (hours >= 18 && hours < 23) {
            return 'evening';
        } else {
            return 'night';
        }
    }();

    var phrase = {
        vocabulary: this.vocabulary,
        code: [this.action, this.type, this.value].join('.'),
        args: ['sir', timeOfDay]
    }

    // switch (this.action) {
    //     case 'update':
    //         switch (this.type) {
    //             case 'awake':
    //                 if (this.value === 'true') {
    //                     deferred.resolve('Good morning');
    //                 } else {
    //                     deferred.resolve('Good night');
    //                 }
    //                 break;
    //             case 'athome':
    //                 if (this.value === 'true') {
    //                     deferred.resolve('Welcome home');
    //                 } else {
    //                     deferred.resolve('Have good times');
    //                 }
    //                 break;
    //         }
    //         break;
    // }

    deferred.resolve(phrase)

    return deferred.promise;
}

module.exports = function(params) {
    return new StatusIntent(params);
}