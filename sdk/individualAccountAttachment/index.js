const individualAccountAttachment = require('./individualAccountAttachment.js');

exports.log = require('./log');
exports.create = individualAccountAttachment.create;
exports.get = individualAccountAttachment.get;
exports.query = individualAccountAttachment.query;
exports.page = individualAccountAttachment.page;
exports.delete = individualAccountAttachment.delete;

exports.IndividualAccountAttachment = individualAccountAttachment.IndividualAccountAttachment;
