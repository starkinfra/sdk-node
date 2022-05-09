const pixKey = require('./pixKey.js');

exports.log = require('./log');
exports.create = pixKey.create;
exports.get = pixKey.get;
exports.query = pixKey.query;
exports.page = pixKey.page;
exports.update = pixKey.update;
exports.delete = pixKey.delete;
exports.PixKey = pixKey.PixKey;
