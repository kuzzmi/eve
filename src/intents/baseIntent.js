function Intent(params) {

};

Intent.prototype.toString = function() {
    throw new Error('Method toString has to be defined');
}
Intent.prototype.exec = function() {
    throw new Error('Method exec has to be defined');
}

module.exports = Intent;