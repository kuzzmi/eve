/*

{ _text: 'Hello',
  intent: 'reference',
  entities: { reference_type: [ { value: 'greeting' }, [length]: 1 ] },
  confidence: 0.724 }
{ reference_type: [ { value: 'greeting' } ] }

*/

function Stimulus(params) {
    this._text = params._text;
    this.intent = params.intent;
    this.entities = params.entities || [];
    this.confidence = params.confidence;
}

module.exports = Stimulus;