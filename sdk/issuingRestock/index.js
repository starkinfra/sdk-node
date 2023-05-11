const issuingRestock = require('./issuingRestock.js');

exports.log = require('./log');
exports.create = issuingRestock.create;
exports.get = issuingRestock.get;
exports.query = issuingRestock.query;
exports.page = issuingRestock.page;
exports.IssuingRestock = issuingRestock.IssuingRestock;
