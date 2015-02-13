var IIntent = require('../interface');

function ReferenceIntent(params) {
    if (!params) {
        throw new Error('Constructor expected 1 argument but was called with 0.');
    }

    this.type = params.reference_type ?
        params.reference_type[0].value :
        'greeting';
    this.nameType = params.reference_name_type ?
        params.reference_name_type[0].value :
        'neutral';

    this.vocabulary = __dirname + '/' + 'vocabulary.json';
};

IIntent.implementOn(ReferenceIntent);

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

    return {
        vocabulary: this.vocabulary,
        code: this.type,
        args: [timeOfDay]
    };
}

ReferenceIntent.prototype.exec = function(callback) {
    callback(this.toString());
}

module.exports = function(params) {
    return new ReferenceIntent(params);
}