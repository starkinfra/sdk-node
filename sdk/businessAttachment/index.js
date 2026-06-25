const businessAttachment = require('./businessAttachment.js');

exports.log = require('./log');
exports.create = businessAttachment.create;
exports.get = businessAttachment.get;
exports.query = businessAttachment.query;
exports.page = businessAttachment.page;
exports.cancel = businessAttachment.cancel;
exports.BusinessAttachment = businessAttachment.BusinessAttachment;
