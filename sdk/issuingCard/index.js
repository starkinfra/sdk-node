const issuingCard = require('./issuingCard.js');

exports.log = require('./log');
exports.create = issuingCard.create;
exports.get = issuingCard.get;
exports.query = issuingCard.query;
exports.page = issuingCard.page;
exports.update = issuingCard.update;
exports.cancel = issuingCard.cancel;
exports.IssuingCard = issuingCard.IssuingCard;
