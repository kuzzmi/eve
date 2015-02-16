var infobox = require('wiki-infobox'),
    fs = require('fs'),
    Q = require('q');

function WikiIntent(params) {
    console.log(require('util').inspect(params, true, 10, true))

    this.query = params.wikipedia_search_query ?
        params.wikipedia_search_query[0].value :
        undefined;

    this.detail = params.search_query ?
        params.search_query[0].value :
        undefined;

    this.action = params.wikipedia_action ?
        params.wikipedia_action[0].value :
        undefined;
};

WikiIntent.prototype.exec = function() {
    var deferred = Q.defer();
    var me = this;

    switch (me.action) {
        case 'get':
            infobox(this.query, 'en', function(err, data) {
                if (err) {
                    deferred.resolve('Error or the data you\'ve asked is not found');
                }

                fs.writeFile(
                    'temp.json',
                    JSON.stringify(data, data, 4),
                    function(err) {
                        deferred.resolve('I have found some information about ' + me.query);
                    });

            });
            break;
        case 'read':
                fs.readFile(
                    'temp.json',
                    function(err, data) {
                        if (err) {
                            deferred.resolve('I can\'t understand where to look info');
                        }
                        var info = JSON.parse(data);

                        for(var key in info) {
                            var property = info[key];

                            if (!!~key.indexOf(me.detail)) {
                                console.log(property.value);
                                deferred.resolve(property.value);
                            }
                        }
                    });

            break;
    }



    return deferred.promise;
};

WikiIntent.prototype.methodName = function() {

};

module.exports = WikiIntent;