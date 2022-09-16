const issuingPurchase = require('./issuingPurchase.js');

exports.log = require('./log');
exports.get = issuingPurchase.get;
exports.query = issuingPurchase.query;
exports.page = issuingPurchase.page;
exports.parse = issuingPurchase.parse;
exports.response = issuingPurchase.response;
exports.IssuingPurchase = issuingPurchase.IssuingPurchase;
