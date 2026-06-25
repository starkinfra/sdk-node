const businessIdentity = require('./businessIdentity.js');

exports.log = require('./log');
exports.create = businessIdentity.create;
exports.get = businessIdentity.get;
exports.query = businessIdentity.query;
exports.page = businessIdentity.page;
exports.update = businessIdentity.update;
exports.cancel = businessIdentity.cancel;
exports.BusinessIdentity = businessIdentity.BusinessIdentity;
