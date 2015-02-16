var Q = require('q');
var child = require('child_process');

function GitIntent(params) {
    this.action = params.git_action ?
        params.git_action[0].value :
        undefined;
};

GitIntent.prototype.exec = function() {
    var deferred = Q.defer();

    switch (this.action) {
        case 'push':
            var date = new Date();
            child.exec('git add -A && ' +
                'git commit -m "[Eve] Uploaded at ' +
                date.toString() + '"', {
                    cwd: '.'
                }, function(error, stdout, stderr) {
                    if (!error) {
                        child.exec('git push origin master', {
                            cwd: '.'
                        }, function(error, stdout, stderr) {
                            if (!error) {
                                deferred.resolve('Done');
                            } else {
                                deferred.reject('Problem occured');
                            }
                        })
                    } else {
                        deferred.reject('Problem occured');
                    }
                });
            break;
        case 'pull':
            child.exec('git commit -am "[Eve] Commit before pull" && ' +
                'git pull origin master',
                function(error, stdout, stderr) {
                    if (!error) {
                        deferred.resolve('Completed. I need to be restarted');
                    }
                });
            break;
        case 'status':
            child.exec('git diff --stat | tail -n 1', {
                cwd: '.'
            }, function(error, stdout, stderr) {
                if (!error) {
                    var changes = stdout.trim();
                    if (changes) {
                        deferred.resolve(stdout.trim());
                    } else {
                        deferred.resolve('Everything is up-to-date');
                    }
                } else {
                    deferred.reject('Problem occured');
                }
            });
            break;
        default:
            deferred.resolve('Unrecognized command - ' + this.action);
            break;
    }

    return deferred.promise;
}

module.exports = function(params) {
    return new GitIntent(params);
}