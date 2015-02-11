function ReferenceIntent(params) {
    console.log(params);
    this.type = params.reference_type ?
        params.reference_type[0].value :
        undefined;
};

ReferenceIntent.prototype.exec = function(callback) {
    console.log(this.type);
    switch (this.type) {
        case 'greeting':
            callback('Hello to you too');
            break;
    }
}

module.exports = function(params) {
    return new ReferenceIntent(params);
}