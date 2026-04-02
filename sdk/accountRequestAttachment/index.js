const accountRequestAttachment = require('./accountRequestAttachment.js');

exports.log = require('./log');
exports.create = accountRequestAttachment.create;
exports.get = accountRequestAttachment.get;
exports.query = accountRequestAttachment.query;
exports.page = accountRequestAttachment.page;

exports.AccountRequestAttachment = accountRequestAttachment.AccountRequestAttachment;
