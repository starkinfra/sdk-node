const individualDocument = require('./individualDocument.js');

exports.log = require('./log');
exports.create = individualDocument.create;
exports.get = individualDocument.get;
exports.query = individualDocument.query;
exports.page = individualDocument.page;
exports.update = individualDocument.update;
exports.IndividualDocument = individualDocument.IndividualDocument;
