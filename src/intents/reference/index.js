var getPhrase = require('./vocabulary');

function ReferenceIntent(params) {
    console.log(params);
    this.type = params.reference_type ?
        params.reference_type[0].value :
        undefined;
    this.nameType = params.reference_name_type ?
        params.reference_name_type[0].value :
        undefined;
};

ReferenceIntent.prototype.exec = function(callback) {
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
            callback(getPhrase('greeting', timeOfDay));
            break;
        case 'farewell':
            callback(getPhrase('farewell', timeOfDay));
            break;
        case 'attraction':
            callback(getPhrase('attraction'));
            break;
    }
}

module.exports = function(params) {
    return new ReferenceIntent(params);
}