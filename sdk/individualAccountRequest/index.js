const individualAccountRequest = require('./individualAccountRequest.js');

exports.log = require('./log');
exports.Address = require('./address.js').Address;
exports.create = individualAccountRequest.create;
exports.get = individualAccountRequest.get;
exports.query = individualAccountRequest.query;
exports.page = individualAccountRequest.page;
exports.update = individualAccountRequest.update;
exports.IndividualAccountRequest = individualAccountRequest.IndividualAccountRequest;
