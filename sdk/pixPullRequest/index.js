const pixPullRequest = require('./pixPullRequest.js');

exports.log = require('./log');
exports.create = pixPullRequest.create;
exports.query = pixPullRequest.query;
exports.get = pixPullRequest.get;
exports.page = pixPullRequest.page;
exports.update = pixPullRequest.update;
exports.cancel = pixPullRequest.cancel;
exports.PixPullRequest = pixPullRequest.PixPullRequest;
