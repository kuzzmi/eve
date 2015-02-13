var expect = require('chai').expect,
    sinon = require('sinon'),
    mockery = require('mockery');

var sandbox = sinon.sandbox.create(),
    vocabularyMock = require('./mocks/vocabulary'),
    speechApparatusMock = require('./mocks/speechApparatus'),
    Speech;

describe('Speech', function() {
    describe('#exec()', function() {
        before(function() {
            mockery.enable({
                useCleanCache: true
            });
        });

        beforeEach(function() {
            mockery.registerMock('./vocabulary', vocabularyMock);
            mockery.registerMock('./speechApparatus', speechApparatusMock);

            mockery.registerAllowables([
                'util',
                'fs',
                'q',
                'stream',
                '../src/brain/speech'
            ]);

            Speech = require('../src/brain/speech');
        });

        afterEach(function() {
            sandbox.verifyAndRestore();
            mockery.deregisterAll();
        });

        after(function() {
            mockery.disable();
        });

        it('should exist', function() {
            expect(Speech.exec).to.be.ok;
        });

        describe('check types', function() {
            it('should throw Error if no arguments passed', function() {
                expect(function() {
                    Speech.exec();
                }).to.throw(/arguments/);
            });

            it('should throw Error if more then 4 arguments passed', function() {
                expect(function() {
                    Speech.exec(null, null, null, null, null);
                }).to.throw(/arguments/);
            });

            var func = function() {};

            it('should throw Error if args[0] is not a {String}', function() {
                expect(function() {
                    Speech.exec(1);
                }).to.throw(/Expected type/);
            });

            it('should not throw Error if args[0] is a {String}', function() {
                expect(function() {
                    Speech.exec('string');
                }).not.to.throw(/Expected type/);
            });

            it('should throw Error if args[1] is not a {String|Object|Function}', function() {
                expect(function() {
                    Speech.exec('string', 1);
                    Speech.exec('string', 1, 1);
                    Speech.exec('string', 1, {}, func);
                }).to.throw(/Expected type/);
            });

            it('should not throw Error if args[1] is a {String|Object|Function}', function() {
                expect(function() {
                    Speech.exec('string', func);
                    Speech.exec('string', {}, func);
                    Speech.exec('string', 'string', {}, func);
                    Speech.exec('string', {}, {}, func);
                }).not.to.throw(/Expected type/);
            });

            it('should throw Error if args[2] is not a {Object|Function}', function() {
                expect(function() {
                    Speech.exec('string', {}, 1);
                    Speech.exec('string', {}, 1, func);
                }).to.throw(/Expected type/);
            });

            it('should not throw Error if args[2] is a {Object|Function}', function() {
                expect(function() {
                    Speech.exec('string', {}, func);
                    Speech.exec('string', {}, {}, func);
                }).not.to.throw(/Expected type/);
            });

            it('should throw Error if args[3] is not a {Function}', function() {
                expect(function() {
                    Speech.exec('string', {}, 1, func);
                }).to.throw(/Expected type/);
            });

            it('should not throw Error if args[3] is a {Function}', function() {
                expect(function() {
                    Speech.exec('string', {}, {}, func);
                }).not.to.throw(/Expected type/);
            });
        });

        describe('flow', function() {
            it('should return string in callback', function(done) {
                Speech.exec('Test').then(function(phrase) {
                    expect(phrase).to.be.a('string');
                    done();
                });
            });
        });
    });
});