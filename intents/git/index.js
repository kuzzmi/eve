var child = require('child_process');

function GitIntent(params) {
    this.action = params.git_action ?
        params.git_action[0].value :
        undefined;
};

GitIntent.prototype.exec = function(callback) {
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
                                callback('Done');
                            } else {
                                callback('Problem occured');
                            }
                        })
                    } else {
                        callback('Problem occured');
                    }
                });
            break;
        case 'status':
            child.exec('git diff --stat | tail -n 1', {
                cwd: '.'
            }, function(error, stdout, stderr) {
                if (!error) {
                    callback(stdout.trim() + ' in current state');
                } else {
                    callback('Problem occured');
                }
            });
            break;
        default:
            callback('Unrecognized command - ' + this.action);
            break;
    }
}

module.exports = function(params) {
    return new GitIntent(params);
}