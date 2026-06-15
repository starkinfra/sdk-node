const issuingStockRule = require('./issuingStockRule.js');

exports.create = issuingStockRule.create;
exports.get = issuingStockRule.get;
exports.query = issuingStockRule.query;
exports.page = issuingStockRule.page;
exports.update = issuingStockRule.update;
exports.cancel = issuingStockRule.cancel;
exports.IssuingStockRule = issuingStockRule.IssuingStockRule;
