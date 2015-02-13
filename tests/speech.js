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
        var stream = require('stream').PassThrough();

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
                Speech.exec('string', stream, func);
                Speech.exec('string', 'string', {}, func);
                Speech.exec('string', {}, {}, func);
            }).not.to.throw(/Expected type/);
        });

        it('should throw Error if args[2] is not a {Object|Function}', function() {

            // console.log('__________________________________________________ stream instanceof Stream: ' + (stream instanceof Stream));

            expect(function() {
                Speech.exec('string', stream, 1);
                Speech.exec('string', stream, 1, func);
            }).to.throw(/Expected type/);
        });

        it('should not throw Error if args[2] is a {Object|Function}', function() {
            expect(function() {
                Speech.exec('string', stream, func);
                Speech.exec('string', stream, {}, func);
            }).not.to.throw(/Expected type/);
        });

        // it('should throw Error if args[1] is not a {String|Object}', function() {
        //     expect(function() {
        //         Speech.exec('string', 1);
        //     }).to.throw(/Expected type/);
        // });

        // it('should throw Error if args[1] is a {String|Object}', function() {
        //     expect(function() {
        //         Speech.exec('string', 'filepath');
        //         Speech.exec('string', stream);
        //         Speech.exec('string', {});
        //     }).to.throw(/Expected type/);
        // });

        // it('not throw Error if args[0] is a {String}', function() {
        //     expect(function() {
        //         Speech.exec('string');
        //     }).not.to.throw(/Expected type/);
        // });

        // it('throw Error if args[1] is not a {Function}', function() {
        //     expect(function() {
        //         Speech.exec('string', 1);
        //     }).to.throw(/Expected type/);
        // });

        // it('do not throw Error if args[1] is a {Function}', function() {
        //     expect(function() {
        //         Speech.exec('string', func);
        //     }).not.to.throw(/Expected type/);
        // });

        // });

        // it('should throw Error if types of arguments are missmatching', function() {
        //     expect(function() {
        //         // Without vocabulary
        //         Speech.exec(1);
        //         Speech.exec(1, 1);
        //         // With vocabulary
        //         Speech.exec(1, 1, 1);
        //         Speech.exec(1, 1, 1, 1);
        //     }).to.throw(/Expected type/);
        // });

        // it('should not throw Error if types of arguments correct', function() {
        //     var fun = function() {};
        //     var stream = require('stream').Stream();
        //     expect(function() {
        //         // Without vocabulary
        //         Speech.exec('string');
        //         Speech.exec('string', fun);
        //         // With vocabulary
        //         // vocabulary is a filepath
        //         Speech.exec('string', 'filepath', {});
        //         Speech.exec('string', 'filepath', {}, fun);
        //         // vocabulary is a Stream
        //         Speech.exec('string', stream, {});
        //         Speech.exec('string', stream, {}, fun);
        //         // vocabulary is an Object
        //         Speech.exec('string', {}, {});
        //         Speech.exec('string', {}, {}, fun);
        //     }).not.to.throw(/Expected type/);
        // });

        // it('should be executed with', function(done) {

        //     Speech.exec(undefined, undefined, function(phrase) {
        //         expect(phrase).to.contain('Hello');
        //         done();
        //     });

        // });
    });
});