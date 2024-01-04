const check = require('core-node').check;
const Resource = require('core-node').Resource;


class Transfer extends Resource {
    /**
     *
     * CreditNote Transfer object
     *
     * @description Transfer sent to the credit receiver after the contract is signed.
     *
     * Parameters (required):
     * @param name [string]: receiver full name. ex: 'Anthony Edward Stark'
     * @param taxId [string]: receiver tax ID (CPF or CNPJ) with or without formatting. ex: '01234567890' or '20.018.183/0001-80'
     * @param bankCode [string]: code of the receiver bank institution in Brazil. ex: '20018183'
     * @param branchCode [string]: receiver bank account branch. Use '-' in case there is a verifier digit. ex: '1357-9'
     * @param accountNumber [string]: receiver bank account number. Use '-' before the verifier digit. ex: '876543-2'
     *
     * Parameters (optional):
     * @param accountType [string, default 'checking']: Receiver's bank account type. This parameter only has effect on Pix Transfers. ex: 'checking', 'savings', 'salary' or 'payment'
     * @param tags [list of strings, default null]: list of strings for reference when searching for transfers. ex: ['employees', 'monthly']
     *
     * Attributes (return-only):
     * @param id [string]: unique id returned when the transfer is created. ex: '5656565656565656'
     * @param amount [integer]: amount in cents to be transferred. ex: 1234 (= R$ 12.34)
     * @param externalId [string]: url safe string that must be unique among all your transfers. Duplicated external_ids will cause failures. By default, this parameter will block any transfer that repeats amount and receiver information on the same date. ex: 'my-internal-id-123456'
     * @param scheduled [string]: date or datetime when the transfer will be processed. May be pushed to next business day if necessary. ex: '2020-03-10 10:30:00.000'
     * @param description [string]: optional description to override default description to be shown in the bank statement. ex: 'Payment for service #1234'
     * @param fee [integer]: fee charged when the Transfer is processed. ex: 200 (= R$ 2.00)
     * @param status [string]: current transfer status. ex: 'success' or 'failed'
     * @param transactionIds [list of strings]: ledger Transaction IDs linked to this Transfer (if there are two, the second is the chargeback). ex: ['19827356981273']
     * @param created [string]: creation datetime for the CreditNote. ex: '2020-03-10 10:30:00.000'
     * @param updated [string]: latest update datetime for the CreditNote. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({ 
                    taxId, name, bankCode, branchCode, accountNumber, amount = null, 
                    accountType = null, externalId = null, scheduled = null, description = null, 
                    tags = null, fee = null, status = null, transactionIds = null, 
                    created = null, updated = null, id = null 
                }) {
        super(id);

        this.taxId = taxId;
        this.name = name;
        this.bankCode = bankCode;
        this.branchCode = branchCode;
        this.accountNumber = accountNumber;
        this.amount = amount;
        this.accountType = accountType;
        this.externalId = externalId;
        this.scheduled = check.dateTimeOrDate(scheduled);
        this.description = description;
        this.tags = tags;
        this.fee = fee;
        this.status = status;
        this.transactionIds = transactionIds;
        this.created = check.datetime(created);
        this.updated = check.datetime(updated);
    }
}

exports.Transfer = Transfer;
exports.resource = {'class': exports.Transfer, 'name': 'Transfer'};
