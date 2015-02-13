var expect = require('chai').expect;

var IIntent = require('../../src/intents/interface'),
    ReferenceIntent = require('../../src/intents/reference'),
    referenceIntent,
    params;

describe('ReferenceIntent', function() {
    describe('#constructor()', function() {
        it('should throw Error without params', function() {
            expect(function() {
                referenceIntent = new ReferenceIntent();
            }).to.throw(/argument/);
        });
        it('should not throw Error with params', function() {
            params = {};

            expect(function() {
                referenceIntent = new ReferenceIntent(params);
            }).not.to.throw(/argument/);
        });

        it('should have a default nameType and type', function() {
            params = {};

            referenceIntent = new ReferenceIntent(params);
            expect(referenceIntent.type).not.to.be.undefined;
            expect(referenceIntent.nameType).not.to.be.undefined;
        });

        it('should have a vocabulary property', function() {
            params = {};

            referenceIntent = new ReferenceIntent(params);
            expect(referenceIntent.vocabulary).not.to.be.undefined;
        });

        it('should represent actual nameType and type', function() {
            params = {
                reference_type: [{
                    value: 'foo'
                }],

                reference_name_type: [{
                    value: 'bar'
                }]
            };

            referenceIntent = new ReferenceIntent(params);
            expect(referenceIntent.type).to.equal('foo');
            expect(referenceIntent.nameType).to.equal('bar');
        });
    });

    describe('#toString()', function() {
        it('should return a phrase object', function() {
            params = {
                reference_type: [{
                    value: 'greeting'
                }]
            };

            referenceIntent = new ReferenceIntent(params);
            var phraseObj = referenceIntent.toString();

            expect(phraseObj.code).to.be.ok;
            expect(phraseObj.args).to.be.ok;
            expect(phraseObj.vocabulary).to.be.ok;
        });
    });
});