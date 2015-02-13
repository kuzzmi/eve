function pick(file, phraseObj, callback) {
    setTimeout(function() {
        callback('Hello Tester');
    }, 5);
};

module.exports = pick;