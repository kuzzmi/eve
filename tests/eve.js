var assert = require('assert');
var Eve = require('../eve');

describe('Eve', function() {
    it('should be launched without errors', function() {
        assert.ok(Eve.cli);
    });
});