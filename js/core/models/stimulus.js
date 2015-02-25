(function() {
  var Stimulus;

  Stimulus = (function() {
    function Stimulus(params) {
      this._text = params._text;
      this.intent = params.intent;
      this.entities = params.entities;
      this.confidence = params.confidence;
    }

    return Stimulus;

  })();

  module.exports = Stimulus;

}).call(this);
