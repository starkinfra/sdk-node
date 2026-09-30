const bacenId = require('./bacenId.js');


exports.create = function (bankCode, prefix) {
    return prefix + bacenId.create(bankCode, 'yyyyMMdd');
}
