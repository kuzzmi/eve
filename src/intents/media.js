var request = require('request');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getFirstValue(arr) {
    if (arr) {
        return arr[0].value;
    } else {
        return false;
    }
}

function MediaIntent(params) {
    this.apiUrl = 'http://192.168.0.4:3000';
    this.type = getFirstValue(params.media_type);
    this.action = getFirstValue(params.action);
    this.properties = params.media_property ?
        params.media_property.map(function(a) {
            return a.value;
        }) : false;

    this._is = function(property) {
        if (this.properties) {
            return !!~this.properties.indexOf(property);
        } else {
            return false;
        }
    };
};

MediaIntent.prototype._makeRequest = function(callback) {
    var me = this;

    var buildUrl = function() {
        var base = me.apiUrl + '/media/' + me.type + '/query/';

        if (me._is('unwatched')) {
            base += 'unwatched=1&';
        }

        console.log(base);

        return base;
    }

    request(buildUrl(), function(req, resp) {
//        console.log(buildUrl(), resp.body);
        var movies = JSON.parse(resp.body).video;
        callback(movies);
    });
};

MediaIntent.prototype.count = function(callback) {
    this._makeRequest(function(movies) {
        var result = 'You have ' + movies.length + ' movies to watch';

        callback(result);
    });
};

MediaIntent.prototype.read = function(callback) {
    var me = this;
    this._makeRequest(function(movies) {
        var result;
        var titles = movies.map(function(a) {
            return a.attributes.title;
        });

        if (me._is('random')) {
            var random = titles[getRandomInt(0, movies.length)];
            result = 'You can watch ' + random;
        } else {
            result = 'You have these movies: ' + titles;
        }

        callback(result);
    });

};

MediaIntent.prototype.exec = function(callback) {
    if (this.action) {
        this[this.action](callback);
    } else {
        callback('I didn\'t get you');
    }
};

module.exports = function(params) {
    return new MediaIntent(params);
}
