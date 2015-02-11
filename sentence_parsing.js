/*

Types of sentences:
    declarative
    interrogative
    imperative 
    exclamatory

    Declarative
        Sharon and Paul found a lost puppy.
        We get lots of snow in the winter .

    Interrogative
        May I borrow pencil sharpener ?
        What time do you get up in the morning ?

    Imperative
        Pick up the book .
        Clean your room .

    Exclamatory
        It's a beautiful day!
        I won a million dollars!

simple predicate:
    verb
    verb string
    compound verb

    E.g. 
    The glacier melted (verb)
    The glacier has been melting (verb string)
    The glacier melted, broke apart, and slipped into the sea (compound verb)

compound predicate:

    The glacier began to slip down the mountainside and 
    eventually crushed some of the village's outlying buildings.

complete predicate
predicate adjective
predicate nominative

 */

var sentence1 = new Sentence({
    type: 'declarative',
    structure: {
        // it
        subject: {
            type: 'pronoun',
            singular: true,
            attributes: {
                person: 3
            }
        },
        // is raining
        predicate: {
            type: 'simple',
            matrix: [{
                // is
                verb: 'be',
                form: 'present'
            }, {
                // raining
                verb: 'rain',
                form: 'gerund'
            }]
        }
    }
});

var sentence2 = new Sentence({
    type: 'interrogative',
    structure: {
        // it
        subject: {
            type: 'pronoun',
            attributes: {
                number: 'singular',
                person: 3
            }
        },
        // is raining
        predicate: {
            type: 'simple',
            matrix: [{
                // is
                verb: 'be',
                form: 'present'
            }, {
                // raining
                verb: 'rain',
                form: 'gerund'
            }]
        }
    }
});

var sentence3 = new Sentence({
    type: 'imperative',
    structure: {
        // clean room
        predicate: {
            type: 'compound',
            matrix: [{
                // clean
                verb: 'clean',
                form: 'present'
            }, {
                // room
                noun: 'room',
                attributes: {
                    number: 'singular'
                }
            }]
        }
    }
});

sentence1.toString(); // 'It is raining.'
sentence2.toString(); // 'Is it raining?'
sentence3.toString(); // 'Clean room.'