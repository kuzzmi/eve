var infobox = require('wiki-infobox'),
    fs = require('fs'),
    request = require('request'),
    Q = require('q');

function WikiIntent(params) {
    this.query = params.wikipedia_search_query ?
        params.wikipedia_search_query[0].value :
        undefined;

    if (this.query && this.query.indexOf('its ') === 0) {
        this.query = this.query.replace('its ', '');
    }

    this.action = params.wikipedia_action ?
        params.wikipedia_action[0].value :
        undefined;
};

WikiIntent.prototype.exec = function() {
    var deferred = Q.defer();
    var me = this;

    if (!this.query) {
        deferred.resolve('Please specify your query');
    }

    switch (me.action) {
        case 'get':
            infobox(this.query, 'en', function(err, data) {
                if (err) {
                    deferred.resolve('Oops, error');
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
            var url = 'http://en.wikipedia.org/w/api.php';
            var params = {
                action: 'opensearch',
                search: me.query,
                limit: 1,
                namespace: 0,
                format: 'json'
            };

            request({
                url: url,
                qs: params
            }, function(err, data, body) {
                if (err) {
                    deferred.resolve('Oops, something happened');
                }
                
                var data = JSON.parse(body);
                if (data[2].length === 0 ||
                    data[2][0] === undefined) {
                    deferred.resolve('Sorry, I found nothing about ' + me.query);
                } else {
                    var desription = data[2][0]
                        .replace(/\/.+\//g, '')
                        .split('.')
                        .slice(0, 2)
                        .join('.');

                    deferred.resolve(desription);                    
                }
            });
            break;
        case 'read_details':
                fs.readFile(
                    'temp.json',
                    function(err, data) {
                        if (err) {
                            deferred.resolve('I can\'t understand where to look info');
                        }

                        var info = JSON.parse(data);

                        console.log(require('util').inspect(info, true, 10, true))

                        for(var key in info) {
                            var property = info[key];

                            if (!!~key.indexOf(me.query)) {
                                console.log(property.value);
                                deferred.resolve(property.value);
                            }
                        }

                        deferred.resolve('Sorry, could not find information about ' + me.query);
                    });

            break;
    }



    return deferred.promise;
};

WikiIntent.prototype.methodName = function() {

};

module.exports = WikiIntent;