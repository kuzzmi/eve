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
        subject: [{
            type: 'pronoun',
            attributes: {
                role: 'subject',
                number: 'singular',
                person: 'neuter'
            }
        }],
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

var I = new Pronoun({
    role: 'subject',
    number: 'singular',
    person: 'first'
});

var me = new Pronoun({
    role: 'objective',
    number: 'singular',
    person: 'first'
});

I.toString() === 'I'; // true;
me.toString() === 'me'; // true;

/*

 I and my friend.
 I  +  I  friend
 p  +  p(n)

 Who are you?
    
 Are you hungry?

 ,_, you be hungry ?
  ^   ^       ^
  |   |    state of
  |   |  hunger level
  |   |
  |  2nd <- Eve
  |
 No q. word + ? <- Yes/no q. 

 [Eve, hunger level, _, ?] -> [No]


*/

var sentence3 = new Sentence({
    type: 'interrogative',
    structure: {
        // it
        subject: [{
            pos: 'pronoun',
            attributes: {
                role: 'subject',
                number: 'singular',
                type: 'neuter',
                person: 'third'
            }
        }, {
            pos: 'conjunction',
            attributes: {
                type: 'coordinating'
            }
        }],
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

sentence1.toString(); // 'It is raining.'
sentence2.toString(); // 'Is it raining?'
sentence3.toString(); // 'I and my friend went to a party last night.'