const individualIdentity = require('./individualIdentity.js');

exports.log = require('./log');
exports.create = individualIdentity.create;
exports.get = individualIdentity.get;
exports.query = individualIdentity.query;
exports.page = individualIdentity.page;
exports.update = individualIdentity.update;
exports.cancel = individualIdentity.cancel;
exports.IndividualIdentity = individualIdentity.IndividualIdentity;
