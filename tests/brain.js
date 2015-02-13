var expect  = require('chai').expect,
    sinon   = require('sinon'),
    mockery = require('mockery');

var SpeechMock = require('./mocks/speech'),
    ReflexMock = require('./mocks/reflex'),
    Stimulus   = require('../src/brain/stimulus'),
    witMock    = {
        captureTextIntent: function(key, input, cb) {
            var res = {
                outcomes: [{
                    _text: 'Hello',
                    intent: 'reference',
                    entities: {
                        reference_type: [{
                            value: 'greeting'
                        }]
                    },
                    confidence: 0.724
                }]
            }
            cb(null, res);
        }
    },

    Brain;

describe('Brain', function() {
    before(function() {
        mockery.enable({
            useCleanCache: true
        });
    });

    beforeEach(function() {
        mockery.registerMock('./speech', SpeechMock);
        mockery.registerMock('./reflex', ReflexMock);
        mockery.registerMock('node-wit', witMock);

        mockery.registerAllowables([
            'util',
            'fs',
            'q',
            'events',
            './stimulus',
            '../src/brain'
        ]);

        Brain = require('../src/brain');
    });

    afterEach(function() {
        mockery.deregisterAll();
    });

    after(function() {
        mockery.disable();
    });

    describe('#instance', function() {
        it('should be inherited from EventEmitter', function() {
            expect(Brain instanceof require('events').EventEmitter).to.be.true;
        });
    });

    describe('#process()', function() {
        it('should be defined', function() {
            expect(Brain.process).to.be.ok;
        });

        it('should throw on empty args', function() {
            expect(function() {
                Brain.process();
            }).to.throw(/arguments/);
        });

        it('should throw on non {String|Stimulus} args', function() {
            expect(function() {
                Brain.process({});
            }).to.throw(/Expected type/);
        });

        it('should not throw on {String|Stimulus} argument', function() {
            expect(function() {
                Brain.process('Hello');
                Brain.process(new Stimulus());
            }).not.to.throw(/arguments/);
        });

        it('should process a {String} and return a {Promise} with response', function(done) {
            Brain.process('Hello').then(function(response) {
                expect(response).to.be.ok;
                done();
            });
        });

        it('should process a {Stimulus} and return a {Promise} with response', function(done) {
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

            Brain.process(stimulus).then(function(response) {
                expect(response).to.be.ok;
                done();
            });
        });        

        it('should create a {Reflex} while processing', function(done) {
            Brain.process('String').then(function() {
                done();
            });
        });
    });
});