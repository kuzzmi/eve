/*{
    cod: '200',
    message: 0.2026,
    city: {
        id: 2661604,
        name: 'Basel',
        coord: {
            lon: 7.57327,
            lat: 47.558399
        },
        country: 'CH',
        population: 0,
        sys: {
            population: 0
        }
    },
    cnt: 7,
    list: [{
        dt: 1424257200,
        temp: {
            day: 2.19,
            min: -3.15,
            max: 2.95,
            night: -2.98,
            eve: -1.89,
            morn: -0.18
        },
        pressure: 962.37,
        humidity: 90,
        weather: [{
            id: 802,
            main: 'Clouds',
            description: 'scattered clouds',
            icon: '03d'
        }],
        speed: 2.11,
        deg: 61,
        clouds: 32
    }, {
        dt: 1424343600,
        temp: {
            day: 5.62,
            min: -4.33,
            max: 7.09,
            night: -4.33,
            eve: 0.65,
            morn: -2.9
        },
        pressure: 956.54,
        humidity: 91,
        weather: [{
            id: 800,
            main: 'Clear',
            description: 'sky is clear',
            icon: '01d'
        }],
        speed: 1.61,
        deg: 183,
        clouds: 0
    }, {
        dt: 1424430000,
        temp: {
            day: 6.64,
            min: -6.61,
            max: 6.97,
            night: -4.05,
            eve: 0.3,
            morn: -6.61
        },
        pressure: 941.58,
        humidity: 84,
        weather: [{
            id: 800,
            main: 'Clear',
            description: 'sky is clear',
            icon: '01d'
        }],
        speed: 2.32,
        deg: 185,
        clouds: 0
    }, {
        dt: 1424516400,
        temp: {
            day: 4.46,
            min: -2.81,
            max: 4.46,
            night: -2.81,
            eve: 1.23,
            morn: -2.01
        },
        pressure: 934.87,
        humidity: 85,
        weather: [{
            id: 600,
            main: 'Snow',
            description: 'light snow',
            icon: '13d'
        }],
        speed: 2.21,
        deg: 248,
        clouds: 56,
        snow: 0.13
    }, {
        dt: 1424602800,
        temp: {
            day: 4.5,
            min: -6.07,
            max: 4.5,
            night: -6.07,
            eve: -0.68,
            morn: -5.37
        },
        pressure: 966.82,
        humidity: 0,
        weather: [{
            id: 500,
            main: 'Rain',
            description: 'light rain',
            icon: '10d'
        }],
        speed: 1.17,
        deg: 308,
        clouds: 7,
        rain: 0.22
    }, {
        dt: 1424689200,
        temp: {
            day: 4.98,
            min: -8.12,
            max: 4.98,
            night: 0.06,
            eve: 1.75,
            morn: -8.12
        },
        pressure: 966.66,
        humidity: 0,
        weather: [{
            id: 800,
            main: 'Clear',
            description: 'sky is clear',
            icon: '01d'
        }],
        speed: 1.54,
        deg: 178,
        clouds: 49
    }, {
        dt: 1424775600,
        temp: {
            day: 5.17,
            min: -0.54,
            max: 5.17,
            night: -0.54,
            eve: 1.26,
            morn: 4.49
        },
        pressure: 973.59,
        humidity: 0,
        weather: [{
            id: 501,
            main: 'Rain',
            description: 'moderate rain',
            icon: '10d'
        }],
        speed: 1.87,
        deg: 284,
        clouds: 99,
        rain: 5.99
    }]
}*/
var extend = require('../../../common/utils').extend;

function DayForecast(params) {
    var model = {
        dt: new Date(params.dt * 1000),
        temp: {
            morning: +(params.temp.morn).toFixed(0),
            day: +(params.temp.day).toFixed(0),
            evening: +(params.temp.eve).toFixed(0),
            night: +(params.temp.night).toFixed(0),
            max: +(params.temp.max).toFixed(0),
            min: +(params.temp.min).toFixed(0)
        },
        description: params.weather[0].description.toLowerCase(),
        humidity: params.humidity,
        wind: +(params.speed).toFixed(1),
        cityName: params.city.name,
        snow: params.snow ? params.snow > 0 : false,
        rain: params.rain ? params.rain > 0 : false
    };

    extend(this, model);
};

DayForecast.prototype.toString = function(params) {
    var phrase = {
        code: 'day',
        args: undefined
    };

    switch (params.details) {
        case 'all':
            phrase.code = ['day', params.details].join('.');
            phrase.args = [
                this.cityName,
                this.temp.morning, 
                this.temp.day, 
                this.temp.evening, 
                this.temp.night, 
                this.description
            ];
            break;
        case 'temperature':
            break;
        case 'precipitation':
            var code = ['day', params.details, 'yes_no'].join('.');
            var asked = params && params.verbosity ?
                params.verbosity.replace('yes_no_', '') : undefined;

            this[asked] ? code += '.yes' : code += '.no';

            phrase.code = code;
            break;
    }

    return phrase;
};

module.exports = DayForecast;