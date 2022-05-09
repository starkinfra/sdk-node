const infractionReport = require('./infractionReport.js');

exports.log = require('./log');
exports.create = infractionReport.create;
exports.get = infractionReport.get;
exports.query = infractionReport.query;
exports.page = infractionReport.page;
exports.update = infractionReport.update;
exports.delete = infractionReport.delete;
exports.InfractionReport = infractionReport.InfractionReport;
