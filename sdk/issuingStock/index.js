const issuingStock = require('./issuingStock.js');

exports.log = require('./log');
exports.get = issuingStock.get;
exports.query = issuingStock.query;
exports.page = issuingStock.page;
exports.IssuingStock = issuingStock.IssuingStock;
