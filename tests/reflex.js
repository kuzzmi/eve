var expect = require('chai').expect,
    sinon = require('sinon'),
    mockery = require('mockery');

var Reflex = require('../src/brain/reflex'),
    Stimulus = require('../src/brain/stimulus');

describe('Reflex', function() {
    describe('#constructor', function() {
        it('should throw on empty params', function() {
            expect(function() {
                new Reflex();
            }).to.throw(/was called/)
        });
        it('should throw on more then 1 params', function() {
            expect(function() {
                new Reflex(null, null);
            }).to.throw(/was called/)
        });
        it('should not throw on wrong param', function() {
            expect(function() {
                new Reflex(undefined);
            }).to.throw(/but received/);
        });
        it('should not throw on {Stimulus|String} param', function() {
            expect(function() {
                new Reflex(new Stimulus());
                new Reflex('a');
            }).not.to.throw(/but received/);
        });
        it('should create {Reflex} object with {Stimulus} property', function() {
            var reflex1 = new Reflex(new Stimulus());
            var reflex2 = new Reflex('string');

            expect(reflex1.stimulus).to.be.ok;
            expect(reflex2.stimulus).to.be.ok;
        });
        it('should be instance of EventEmitter', function() {
            expect(new Reflex(new Stimulus()) instanceof require('events').EventEmitter)
                .to.be.ok;
        });
    });

    describe('#exec', function() {
        var reflex,
            mockedIntent = require('./mocks/testIntent');

        before(function() {
            mockery.enable({
                useCleanCache: true
            });
            mockery.resetCache();
        });

        beforeEach(function() {
            mockery.registerMock('../intents/test', mockedIntent);

            mockery.registerAllowables([
                'util',
                'q',
                'events',
                './stimulus',
                '../src/brain/reflex'
            ]);

            Reflex = require('../src/brain/reflex');
            reflex = new Reflex(new Stimulus({
                intent: 'test'
            }));
        });

        afterEach(function() {
            mockery.deregisterAll();
        });

        after(function() {
            mockery.disable();
        });

        it('should return {Promise}', function() {
            expect(reflex.exec().then).to.be.ok;
        });

        it('should return {Promise} with response as result', function(done) {
            reflex.exec().then(function(result) {
                expect(result).to.be.ok;
                done();
            });
        });

        it('should handle unknown behavior of intents', function() {
            var reflex = new Reflex('unknown');

            expect(function() {
                reflex.exec();
            }).to.throw;
        });

        it('should return {Promise} with response as result for reference intent', function(done) {
            mockery.registerAllowable('../intents/reference', true);

            var reflex = new Reflex('reference');

            reflex.exec().then(function(result) {
                expect(result).to.include.keys('vocabulary');
                done();
            });
        });
    });
});