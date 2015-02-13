var assert = require('assert');
var Stimulus = require('../src/brain/stimulus');

describe('Stimulus', function() {
    describe('#constructor()', function() {
        it('should create an {Stimulus} with all params', function() {
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
            assert.ok(stimulus);
            assert.ok(stimulus.intent);
        });
        it('should create an empty {Stimulus} with empty params', function() {
            var stimulus = new Stimulus();
            assert.ok(stimulus);
        });
        it('should create an {Stimulus} with some params', function() {
            var stimulus = new Stimulus({
                _text: 'Hello',
                intent: 'reference',
                confidence: 0.724
            });
            assert.ok(stimulus);
            assert.ok(stimulus.intent);
        });
        it('should create an {Stimulus} from string intent', function() {
            var stimulus = new Stimulus('reference');
            assert.ok(stimulus);
            assert.ok(stimulus.intent);
        });
        it('should create an {Stimulus} from string intent and object entity',
            function() {
                var stimulus = new Stimulus('reference', {
                    type: 'greeting'
                });
                assert.ok(stimulus);
                assert.ok(stimulus.intent);
            });
        it('should create an {Stimulus} from string intent and object entity which is equal to one that is created from object',
            function() {
                var stimulus1 = new Stimulus('reference', {
                    type: 'greeting'
                });
                var stimulus2 = new Stimulus({
                    _text: 'reference.greeting',
                    intent: 'reference',
                    entities: {
                        reference_type: [{
                            value: 'greeting'
                        }]
                    },
                    confidence: 1
                });
                assert.deepEqual(stimulus1, stimulus2);
            });
    });
});