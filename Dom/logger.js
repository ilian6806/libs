log = function (message, separator, title) {
    var log = '';

    if (separator) console.log(separator);

    try {
        if (message instanceof Array) {
            log = JSON.stringify(message);
        } else if (message instanceof Object) {
            log = JSON.stringify(message, null, 4);
        } else {
            log = message;
        }
    } catch (e) {
        console.log(e);
        console.log(message);
    }

    if (title) {
        console.log(title.toUpperCase() + ': ' + log);
    } else {
        console.log(log);
    }

    if (separator) console.log(separator);
};
