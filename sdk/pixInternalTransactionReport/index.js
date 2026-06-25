const pixInternalTransactionReport = require('./pixInternalTransactionReport.js');

exports.log = require('./log');
exports.create = pixInternalTransactionReport.create;
exports.get = pixInternalTransactionReport.get;
exports.query = pixInternalTransactionReport.query;
exports.page = pixInternalTransactionReport.page;
exports.PixInternalTransactionReport = pixInternalTransactionReport.PixInternalTransactionReport;
