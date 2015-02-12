var getPhrase = require('./vocabulary');

function ReferenceIntent(params) {
    this.type = params.reference_type ?
        params.reference_type[0].value :
        undefined;
    this.nameType = params.reference_name_type ?
        params.reference_name_type[0].value :
        'neutral';
};

ReferenceIntent.prototype.toString = function() {
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
    switch (this.type) {
        case 'greeting':
            return getPhrase('greeting', timeOfDay);
        case 'farewell':
            return getPhrase('farewell', timeOfDay);
        case 'attraction':
            return getPhrase('attraction');
    }
}

ReferenceIntent.prototype.exec = function(callback) {
    callback(this.toString());
}

module.exports = function(params) {
    return new ReferenceIntent(params);
}