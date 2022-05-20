const pixChargeback = require('./pixChargeback.js');

exports.log = require('./log');
exports.create = pixChargeback.create;
exports.get = pixChargeback.get;
exports.query = pixChargeback.query;
exports.page = pixChargeback.page;
exports.update = pixChargeback.update;
exports.cancel = pixChargeback.cancel;
exports.PixChargeback = pixChargeback.PixChargeback;
