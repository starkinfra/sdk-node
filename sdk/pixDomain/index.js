const pixDomain = require('./pixDomain.js');

exports.query = pixDomain.query;
exports.PixDomain = pixDomain.PixDomain;
exports.Certificate = require('./certificate.js').Certificate;
