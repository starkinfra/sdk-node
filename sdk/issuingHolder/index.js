const issuingHolder = require('./issuingHolder.js');

exports.log = require('./log');
exports.create = issuingHolder.create;
exports.get = issuingHolder.get;
exports.query = issuingHolder.query;
exports.page = issuingHolder.page;
exports.update = issuingHolder.update;
exports.cancel = issuingHolder.cancel;
exports.IssuingHolder = issuingHolder.IssuingHolder;
