const reversalRequest = require('./reversalRequest.js');

exports.log = require('./log');
exports.create = reversalRequest.create;
exports.get = reversalRequest.get;
exports.query = reversalRequest.query;
exports.page = reversalRequest.page;
exports.update = reversalRequest.update;
exports.delete = reversalRequest.delete;
exports.ReversalRequest = reversalRequest.ReversalRequest;
