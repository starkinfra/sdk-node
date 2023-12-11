const issuingToken = require('./issuingToken.js');

exports.log = require('./log');
exports.get = issuingToken.get;
exports.query = issuingToken.query;
exports.page = issuingToken.page;
exports.update = issuingToken.update;
exports.cancel = issuingToken.cancel;
exports.parse = issuingToken.parse;
exports.responseAuthorization = issuingToken.responseAuthorization;
exports.responseActivation = issuingToken.responseActivation;
exports.IssuingToken = issuingToken.IssuingToken;
