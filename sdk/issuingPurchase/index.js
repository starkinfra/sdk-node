const issuingPurchase = require('./issuingPurchase.js');

exports.log = require('./log');
exports.get = issuingPurchase.get;
exports.query = issuingPurchase.query;
exports.page = issuingPurchase.page;
exports.IssuingPurchase = issuingPurchase.IssuingPurchase;
