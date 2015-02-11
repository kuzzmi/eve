function StatusIntent(params) {
    this.action = params.status_action ?
        params.status_action[0].value :
        undefined;
    this.type = params.status_type ?
        params.status_type[0].value :
        undefined;
    this.value = params.status_value ?
        params.status_value[0].value :
        undefined;
};

StatusIntent.prototype._getHumanLikeTime = function(date) {
    date = date || new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    if (minutes > 0) {
        if (minutes < 30) {
            return minutes + ' minutes past ' + hours;
        } else {
            return (60 - minutes) + ' to ' + (hours + 1);
        }
    } else {
        return hours + ' hours';
    }
}

StatusIntent.prototype.exec = function(callback) {
    switch (this.action) {
        case 'update':
            switch (this.type) {
                case 'awake':
                    if (this.value === 'true') {
                        callback('Good morning');
                    } else {
                        callback('Good night');
                    }
                    break;
            }
            break;
    }
}

module.exports = function(params) {
    return new StatusIntent(params);
}