var expect = require('chai').expect;

var IIntent = require('../../src/intents/interface'),
    TestIntent;

describe('IIntent', function() {
    var Interface;

    describe('#constructor()', function() {
        it('should create {IIntent} object', function() {
            Interface = new IIntent();
            expect(Interface).to.be.ok;
        });
    });

    describe('#toString()', function() {
        it('should be defined', function() {
            Interface = new IIntent();
            expect(Interface.toString).to.be.a('function');
        });

        it('should throw Error by default', function() {
            Interface = new IIntent();
            expect(Interface.toString).to.throw(/defined/);
        });
    });

    describe('#exec()', function() {
        var fn = function() {},
            Interface = new IIntent();

        it('should be defined', function() {
            expect(Interface.exec).to.be.a('function');
        });

        it('should throw Error on call', function() {
            expect(function() {
                Interface.exec(fn)
            }).to.throw(/defined/);
        });

        it('should throw Error if no arguments provided', function() {
            expect(function() {
                Interface.exec();
            }).to.throw(/arguments/);
        });

        it('should throw Error if more then 1 argument provided', function() {
            expect(function() {
                Interface.exec(fn, fn);
            }).to.throw(/arguments/);
        });
    });

    describe('#implementOn()', function() {

        it('should be defined', function() {
            expect(IIntent.implementOn).to.be.a('function');
        });

        it('should throw Error if less then 1 argument provided', function() {
            expect(function() {
                IIntent.implementOn();
            }).to.throw(/arguments/);
        });

        it('should throw Error if more then 1 arguments provided', function() {
            expect(function() {
                IIntent.implementOn({}, {}, {});
            }).not.to.throw(/arguments/);
        });

        it('should not throw Error if 1 argument provided', function() {
            expect(function() {
                IIntent.implementOn({});
            }).not.to.throw(/arguments/);
        });

        describe('should implement IIntent on another object', function() {
            var testIntent;

            before(function() {});

            it('#exec() should exist', function() {
                function TestIntent() {};
                IIntent.implementOn(TestIntent);

                testIntent = new TestIntent();

                expect(testIntent.exec).to.be.ok;
            });

            it('#exec() should throw error if not overridden', function() {
                function TestIntent() {};
                IIntent.implementOn(TestIntent);

                testIntent = new TestIntent();

                expect(function() {
                    testIntent.exec(function() {});
                }).to.throw(/defined/);
            });

            it('#exec() should not throw error if overridden', function() {
                function TestIntent() {};
                TestIntent.prototype.exec = function(fn) {};
                IIntent.implementOn(TestIntent);

                testIntent = new TestIntent();

                expect(function() {
                    testIntent.exec(function() {});
                }).to.throw(/defined/);
            });

            it('#toString() should exist', function() {
                function TestIntent() {};
                IIntent.implementOn(TestIntent);

                testIntent = new TestIntent();

                expect(testIntent.toString).to.be.ok;
            });

            it('#toString() should throw error if not overridden', function() {
                function TestIntent() {};
                IIntent.implementOn(TestIntent);

                testIntent = new TestIntent();

                expect(function() {
                    testIntent.toString(function() {});
                }).to.throw(/defined/);
            });

            it('#toString() should not throw error if overridden', function() {
                function TestIntent() {};
                TestIntent.prototype.toString = function(fn) {};
                IIntent.implementOn(TestIntent);

                testIntent = new TestIntent();

                expect(function() {
                    testIntent.toString(function() {});
                }).to.throw(/defined/);
            });
        });

    });
});