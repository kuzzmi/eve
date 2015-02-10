function ReferenceIntent(params) {
    this.phrase = params.greeting_phrase ?
        params.greeting_phrase[0].value :
        undefined;
};

ReferenceIntent.prototype.exec = function(callback) {
    callback(this.phrase);
}

module.exports = function(params) {
    return new ReferenceIntent(params);
}