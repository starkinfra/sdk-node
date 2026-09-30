const {bacenId} = require('../../index');


exports.create = function (bankCode, prefix) {
    return prefix + bacenId.create(bankCode, 'yyyyMMdd');
}
