/*

  {
      _text: 'Hello',
      intent: 'reference',
      entities: {
          reference_type: [{
              value: 'greeting'
          }]
      },
      confidence: 0.724
  }

*/

function Stimulus() {
    var args = arguments;
    if (args.length === 0) {
        this._text = undefined;
        this.intent = undefined;
        this.entities = undefined;
        this.confidence = undefined;
    } else if (args.length === 1) {
        if (typeof args[0] === 'object') {
            this._text = args[0]._text;
            this.intent = args[0].intent;
            this.entities = args[0].entities || [];
            this.confidence = args[0].confidence;
        } else if (typeof args[0] === 'string') {
            this._text = args[0];
            this.intent = args[0];
            this.entities = [];
            this.confidence = 1;
        }
    } else if (args.length === 2) {
        var entitiesString = '';
        var tempEntities, entities = {};

        if (args[1].constructor.name === 'Array') {
            for (var i = 0; i < args[1].length; i++) {
                for (var k in args[1][i]) {
                    entitiesString += '.' + args[1][i][k];
                }
            }
            tempEntities = args[1];
        } else {
            for (var k in args[1]) {
                entitiesString += '.' + args[1][k];
            }
            tempEntities = [args[1]];
        }

        for (var i = 0; i < tempEntities.length; i++) {
            var key = Object.keys(tempEntities[i]);
            entities[args[0] + '_' + key] = [{
                value: tempEntities[i][key]
            }];
        }

        this._text = args[0] + entitiesString;
        this.intent = args[0];
        this.entities = entities;
        this.confidence = 1;
    }
};

module.exports = Stimulus;