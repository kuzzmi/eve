/*{
    coord: {
        lon: 7.57,
        lat: 47.56
    },
    sys: {
        type: 3,
        id: 119935,
        message: 0.0216,
        country: 'CH',
        sunrise: 1424154679,
        sunset: 1424192161
    },
    weather: [{
            id: 802,
            main: 'Clouds',
            description: 'scattered clouds',
            icon: '03d'
        },
        [length]: 1
    ],
    base: 'cmc stations',
    main: {
        temp: 1,
        humidity: 95,
        temp_min: 1,
        temp_max: 1,
        pressure: 1044.31
    },
    wind: {
        speed: 1.61,
        deg: 342.001
    },
    clouds: {
        all: 32
    },
    dt: 1424177469,
    id: 2661604,
    name: 'Basel',
    cod: 200
}*/

var extend = require('../../../common/utils').extend;

function SecondForecast(params) {
    var model = {
        temp: params.main.temp,
        description: params.weather[0].description,
        humidity: params.main.humidity,
        wind: params.wind.speed,
        cityName: params.name
    };

    extend(this, model);
};

SecondForecast.prototype.toString = function(details) {
    var phrase = {
        code: undefined,
        args: undefined
    };

    switch (details) {
        case 'all':
            phrase.code = ['second', details].join('.');
            phrase.args = [this.cityName, this.temp, this.description];
            break;
        case 'temperature':
            break;
        case 'precipitation':
            break;
    }

    return phrase;
};

module.exports = SecondForecast;