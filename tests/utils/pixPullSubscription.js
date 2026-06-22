const starkinfra = require('../../index.js');
const uniqueId = require("./utils/uniqueId.js");
const bacenId = require("./utils/bacenId.js");
const {bankCode} = require("./utils/user");

exports.examplePixPullSubscription = function () {
    return new starkinfra.pixPullSubscription.PixPullSubscription({
    bacenId: bacenId.create(bankCode),
    externalId: uniqueId.create(),
    installmentStart: new Date().toISOString().replace("Z", "+00:00"),
    interval: "month",
    receiverBankCode: bankCode,
    receiverName: "Stark Bank",
    receiverTaxId: "39.908.427/0001-28",
    referenceCode: "36135971",
    senderAccountNumber: "55213",
    senderBankCode: bankCode,
    senderBranchCode: "356",
    senderFinalName: "STARK SCD S.A.",
    senderFinalTaxId: "39908427000128",
    senderTaxId: "99.999.919/9999-79",
    type: "push",
    amount: 52064,
    pullRetryLimit: 3,
    description: "A Lannister always pays his debts",
    tags: ["test", "pix-pull"],
    });
}

