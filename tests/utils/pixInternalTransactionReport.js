const starkinfra = require('../../index.js');
const endToEndId = require('../../sdk/utils/endToEndId.js');
const returnId = require('../../sdk/utils/returnId.js');
const random = require('./random.js');

const senderBankCode = process.env.SANDBOX_BANK_CODE;

const receiverBankCodes = ['18236120', '60701190', '20018183'];

function pickReceiverBankCode() {
    return receiverBankCodes[random.randomInt(0, receiverBankCodes.length - 1)];
}

exports.generateExamplePixInternalTransactionReportRequest = function () {
    return new starkinfra.PixInternalTransactionReport({
        amount: random.randomInt(5, 1000),
        created: random.pastDate(2),
        endToEndId: endToEndId.create(senderBankCode),
        method: 'manual',
        referenceType: 'request',
        senderAccountNumber: '00000-0',
        senderBranchCode: '0000',
        senderAccountType: 'checking',
        senderBankCode: senderBankCode,
        senderTaxId: '012.345.678-90',
        receiverAccountNumber: '00000-1',
        receiverBranchCode: '0001',
        receiverAccountType: 'checking',
        receiverBankCode: pickReceiverBankCode(),
        receiverTaxId: '012.345.678-90',
        receiverKeyId: '+5511989898989',
    });
};

exports.generateExamplePixInternalTransactionReportReversal = function () {
    return new starkinfra.PixInternalTransactionReport({
        amount: random.randomInt(5, 1000),
        created: random.pastDate(2),
        endToEndId: endToEndId.create(senderBankCode),
        method: 'dict',
        referenceType: 'reversal',
        senderAccountNumber: '00000-0',
        senderBranchCode: '0000',
        senderAccountType: 'checking',
        senderBankCode: senderBankCode,
        senderTaxId: '012.345.678-90',
        receiverAccountNumber: '00000-1',
        receiverBranchCode: '0001',
        receiverAccountType: 'checking',
        receiverBankCode: pickReceiverBankCode(),
        receiverTaxId: '012.345.678-90',
        returnId: returnId.create(senderBankCode),
    });
};

exports.generateExamplePixInternalTransactionReportsJson = function (n = 1) {
    let reports = [];
    for (let i = 0; i < n; i++) {
        reports.push(
            i % 2 === 0
                ? exports.generateExamplePixInternalTransactionReportRequest()
                : exports.generateExamplePixInternalTransactionReportReversal()
        );
    }
    return reports;
};
