const individualAccountAttachment = require('./individualAccountAttachment.js');

exports.log = require('./log');
exports.create = individualAccountAttachment.create;
exports.get = individualAccountAttachment.get;
exports.query = individualAccountAttachment.query;
exports.page = individualAccountAttachment.page;
exports.cancel = individualAccountAttachment.cancel;

exports.IndividualAccountAttachment = individualAccountAttachment.IndividualAccountAttachment;
