const starkinfra = require('../../index.js');
const uniqueId = require("./uniqueId.js");
const {bankCode} = require("./user");

function generateBacenId(code) {
    const now = new Date();
    const datePart = String(now.getFullYear()) +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0');
    const randomPart = String(Math.floor(1000000 + Math.random() * 9000000));
    return 'RR' + code + datePart + randomPart;
}

exports.examplePixPullSubscription = function () {
    return new starkinfra.pixPullSubscription.PixPullSubscription({
    bacenId: generateBacenId(bankCode),
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

