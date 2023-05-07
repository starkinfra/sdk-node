const rest = require('../utils/rest.js');
const check = require('../utils/check.js');
const Resource = require('../utils/resource.js').Resource


class BrcodePreview extends Resource {
    /**
     * 
     * BrcodePreview object
     * 
     * @description A BrcodePreview is used to get information from a BR Code 
     * you received to check the information before paying it.
     * 
     * Parameters (required):
     * @param id [string]: BR Code from a Pix payment. This is also de information directly encoded in a QR Code. ex: "00020126580014br.gov.bcb.pix0136a629532e-7693-4846-852d-1bbff817b5a8520400005303986540510.005802BR5908T'Challa6009Sao Paulo62090505123456304B14A"
     * @param payerId [string]: tax id (CPF/CNPJ) of the individual or business requesting the PixKey information. This id is used by the Central Bank to limit request rates. ex: "20.018.183/0001-80"
     * 
     * Parameters (optional):
     * @param endToEndId [string]: central bank's unique transaction ID. ex: "E79457883202101262140HHX553UPqeq"
     * 
     * Attributes (return-only):
     * @param accountNumber [string]: Payment receiver account number. ex: "1234567"
     * @param accountType [string]: Payment receiver account type. Options: "checking", "savings" and "salary"
     * @param amount [integer]: Value in cents that this payment is expecting to receive. If 0, any value is accepted. ex: 123 (= R$1,23)
     * @param amountType [string]: amount type of the Brcode. If the amount type is "custom" the Brcode's amount can be changed by the sender at the moment of payment. Options: "fixed" or "custom"
     * @param bankCode [string]: Payment receiver bank code. ex: "20018183"
     * @param branchCode [string]: Payment receiver branch code. ex: "0001"
     * @param cashAmount [integer]: Amount to be withdrawn from the cashier in cents. ex: 1000 (= R$ 10.00)
     * @param cashierBankCode [string]: Cashier's bank code. ex: "20018183"
     * @param cashierType [string]: Cashier's type. Options: "merchant", "participant" and "other"
     * @param discountAmount [integer]: Discount value calculated over nominalAmount. ex: 3000
     * @param fineAmount [integer]: Fine value calculated over nominalAmount. ex: 20000
     * @param interestAmount [integer]: Interest value calculated over nominalAmount. ex: 10000
     * @param keyId [string]: Receiver's PixKey id. ex: "+5511989898989"
     * @param name [string]: Payment receiver name. ex: "Tony Stark"
     * @param nominalAmount [integer]: Brcode emission amount, without fines, fees and discounts. ex: 1234 (= R$ 12.34)
     * @param reconciliationId [string]: Reconciliation ID linked to this payment. If the brcode is dynamic, the reconciliationId will have from 26 to 35 alphanumeric characters, ex: "cd65c78aeb6543eaaa0170f68bd741ee". If the brcode is static, the reconciliationId will have up to 25 alphanumeric characters "ah27s53agj6493hjds6836v49"
     * @param reductionAmount [integer]: Reduction value to discount from nominalAmount. ex: 1000
     * @param scheduled [string]: date of payment execution. ex: "2020-03-10"
     * @param status [string]: Payment status. ex: "active", "paid", "canceled" or "unknown"
     * @param taxId [string]: Payment receiver tax ID. ex: "012.345.678-90"
     * 
     */
    constructor({
                    id, payerId, endToEndId=null, accountNumber=null, accountType=null, amount=null, 
                    amountType=null, bankCode=null, branchCode=null, cashAmount=null, 
                    cashierBankCode=null, cashierType=null, discountAmount=null,
                    fineAmount=null, interestAmount=null, keyId=null, name=null, 
                    nominalAmount=null, reconciliationId=null, reductionAmount=null, 
                    scheduled=null, status=null, taxId=null
                }) {
        super(id);

        this.payerId = payerId
        this.endToEndId = endToEndId
        this.accountNumber = accountNumber
        this.accountType = accountType
        this.amount = amount
        this.amountType = amountType
        this.bankCode = bankCode
        this.branchCode = branchCode
        this.cashAmount = cashAmount
        this.cashierBankCode = cashierBankCode
        this.cashierType = cashierType
        this.discountAmount = discountAmount
        this.fineAmount = fineAmount
        this.interestAmount = interestAmount
        this.keyId = keyId
        this.name = name
        this.nominalAmount = nominalAmount
        this.reconciliationId = reconciliationId
        this.reductionAmount = reductionAmount
        this.scheduled = check.datetimeOrDate(scheduled)
        this.status = status
        this.taxId = taxId
    }
}

exports.BrcodePreview = BrcodePreview;
let resource = {'class': exports.BrcodePreview, 'name': 'BrcodePreview'};

exports.create = async function (previews, {user} = {}) {
    /**
     *
     * Retrieve BrcodePreviews
     *
     * @description Process BR Codes before paying them.
     *
     * Parameters (required):
     * @param previews [list of BrcodePreview objects]: List of BrcodePreview objects to preview. ex: [starkinfra.BrcodePreview("00020126580014br.gov.bcb.pix0136a629532e-7693-4846-852d-1bbff817b5a8520400005303986540510.005802BR5908T'Challa6009Sao Paulo62090505123456304B14A")]
     *
     * Parameters (optional):
     * @param user [Organization/Project object]: Organization or Project object. Not necessary if starkinfra.user was set before function call
     *
     * Return:
     * @returns list of BrcodePreview objects with updated attributes
     *
     */
    return rest.post(resource, previews, user);
};
