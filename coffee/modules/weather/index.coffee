request = require 'request'
BaseModule = require '../base'
Forecast = require './forecast'
q = require 'q'

class Weather extends BaseModule
    constructor: (@params) ->
        super @params

        @location = @getEntity 'location', 'Basel'
        @details = @getEntity 'weather_details', null
        @verbosity =  @getEntity 'weather_verbosity', null
        if @entities.datetime         
            @datetime = @entities.datetime[0]
        else 
            @datetime = {
                type: 'value',
                grain: 'second',
                value: new Date()
            }

    forecast: (callback) ->

        if @datetime.type is 'value' 
            type = @datetime.grain
        if @datetime.type is 'interval' 
            type = 'interval'

        url = 'http://api.openweathermap.org/data/2.5/'
        params = {
            q: @location,
            units: 'metric',
            cnt: '7'
        }

        switch type
            when 'second' 
                url += 'weather'
            when 'hour' or 'interval' 
                url += 'forecast'
            when 'day' 
                url += 'forecast/daily'

        request {
            url: url,
            qs: params
        }, (err, resp, data) =>
            data = JSON.parse resp.body

            switch type
                when 'second'
                    weather = new Forecast data, type

                when 'day'
                    today = new Date();

                    day = new Date @datetime.value
                    diff = new Date(day - today)

                    daysFromNow = diff / 1000 / 60 / 60 // 24

                    weather = data.list.map((item) ->
                        item.city = data.city;
                        item;
                    )[daysFromToday];

                    weather = new Forecast weather, type;

                when 'hour'
                    ut = new Date @datetime.value 
                        .getTime() // 1000

                    weather = data.list.filter((item) ->
                        item.dt <= ut && ut - item.dt < 10800;
                    )[0]

                    weather = new Forecast weather, 'second';
                
                when 'interval'
                    interval = {
                        from: new Date @datetime.from.value 
                            .getTime() // 1000,                            
                        to: new Date @datetime.to.value 
                            .getTime() // 1000
                    }

                    weather = data.list.filter((item) ->
                        item.dt > interval.from && item.dt < interval.to;
                    )[0]

                    weather = new Forecast weather, 'second';

            callback weather

    exec: ->
        deferred = q.defer()

        @forecast (weather) =>
            output = weather.toString {
                details: @details,
                verbosity: @verbosity
            }

            BaseModule.pickPhrase output
                .then (result) ->
                    super result
                .then deferred.resolve

        deferred.promise
        
module.exports = Weather