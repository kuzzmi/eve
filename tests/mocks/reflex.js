var sinon = require('sinon');

function ReflexMock () {
    return sinon.spy();
};

ReflexMock.prototype.exec = sinon.spy();

ReflexMock.prototype.on = function() {
    return this;
};

module.exports = ReflexMock;