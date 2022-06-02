const SubResource = require('./subResource.js').SubResource


function decamelize(str, separator='-') {
    return str
        .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
        .toLowerCase();
}

exports.endpoint = function (resource, keepDash = false) {
    let decamelized = decamelize(resource);
    if (keepDash) {
        return decamelized;
    }
    return decamelized.replace('-log', '/log')
                      .replace('-attempt', '/attempt');
};

exports.lastName = function (resource) {
    let splitString = decamelize(resource).split('-');
    return splitString[splitString.length - 1];
};

exports.lastPlural = function (resource) {
    lastName = exports.lastName(resource, true);
    if (lastName.endsWith('s')) {
        return lastName;
    }
    if (lastName.endsWith('y') && !lastName.endsWith('ey')) {
        return `${lastName.slice(0, -1)}ies`;
    }
    return `${lastName}s`;
};

exports.removeNullKeys = function(dict) {
   Object.entries(dict).forEach(([key, value]) => {
        if (value === undefined || value === null)
            delete dict[key];
        else if (value.constructor == Object || value instanceof SubResource || value instanceof Array)
            exports.removeNullKeys(value);
   });
}
