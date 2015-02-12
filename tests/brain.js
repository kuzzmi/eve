var assert = require('assert');
var Brain = require('../src/brain/');

var Stimulus = require('../src/brain/stimulus');

describe('Brain', function() {
    describe('#process()', function() {
        it.skip('should process a string', function(done) {
            Brain.process('Hello', function(result) {
                assert.ok(result);
                done();
            });
        });

        it('should process a Object<Stimulus()>', function(done) {
            var stimulus = new Stimulus({
                _text: 'Hello',
                intent: 'reference',
                entities: {
                    reference_type: [{
                        value: 'greeting'
                    }]
                },
                confidence: 0.724
            });

            Brain.process(stimulus, function(result) {
                assert.ok(result);
                done();
            });
        });
    });

    describe('#reflex()', function() {
        it('should react on Object<Stimulus()>', function(done) {
            var stimulus = new Stimulus({
                _text: 'Hello',
                intent: 'reference',
                entities: {
                    reference_type: [{
                        value: 'greeting'
                    }]
                },
                confidence: 0.724
            });

            Brain.reflex({
                stimulus: stimulus,
                output: function(result) {
                    assert.ok(result);
                    done();
                }
            })
        });

        it('should react on Object<Stimulus()> and return string', function(done) {
            var stimulus = new Stimulus({
                _text: 'Hello',
                intent: 'reference',
                entities: {
                    reference_type: [{
                        value: 'greeting'
                    }]
                },
                confidence: 0.724
            });

            Brain.reflex({
                stimulus: stimulus,
                output: function(result) {
                    assert.ok('string', typeof result);
                    done();
                }
            })
        });
    });
});