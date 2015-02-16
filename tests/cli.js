var assert = require('assert');
var Brain = require('../src/brain/');
var Cli = require('../src/cli');

describe('Command-line interface', function() {
    describe('#constructor()', function() {
        it('should create an instance of CLI without argv', function() {
            var cli = new Cli(Brain);

            assert.ok(cli);
        });

        it('should throw Error if Brain is undefined', function() {
            assert.throws(
                function() {
                    var cli = new Cli();
                }
            );
        });
    });

    describe('#output()', function() {
        var cli = new Cli(Brain);

        it('should exist', function() {
            assert.ok(cli.output);
        });

        it.skip('should output a message', function() {});
    });
});