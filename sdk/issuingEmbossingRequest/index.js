const issuingEmbossingRequest = require('./issuingEmbossingRequest.js');

exports.log = require('./log');
exports.create = issuingEmbossingRequest.create;
exports.get = issuingEmbossingRequest.get;
exports.query = issuingEmbossingRequest.query;
exports.page = issuingEmbossingRequest.page;
exports.IssuingEmbossingRequest = issuingEmbossingRequest.IssuingEmbossingRequest;
