var expect = require('chai').expect,
    sinon = require('sinon'),
    mockery = require('mockery');

var Vocabulary = require('../src/brain/speech/vocabulary');

describe('Vocabulary', function() {
    describe('flow', function() {
        it('should return phrase if only it was passed', function(done) {
            var params = {
                phrase: 'Test'
            };
            Vocabulary.pick(params)
                .then(function(phrase) {
                    expect(phrase).to.equal(params.phrase);
                    done();
                });
        })
    });
});