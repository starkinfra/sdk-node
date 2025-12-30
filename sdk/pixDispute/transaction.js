const check = require('starkcore').check;
const SubResource = require('starkcore').SubResource;

class Transaction extends SubResource {
    /**
     * PixDispute.Transaction object
     *
     * Transaction object related to the PixDispute.
     *
     * Attributes (return-only):
     * @param endToEndId [string]: Central Bank's unique transaction id. ex: "E79457883202101262140HHX553UPqeq"
     * @param amount [integer]: refundable amount. ex: 11234 (= R$ 112.34)
     * @param nominalAmount [integer]: transaction amount. ex: 11234 (= R$ 112.34)
     * @param receiverType [string]: receiver person type. Options: "individual", "business"
     * @param receiverTaxIdCreated [string]: receiver's taxId creation date. For business type only.
     * @param receiverAccountCreated [string]: receiver's account creation date.
     * @param receiverBankCode [string]: receiver's bank code. ex: "20018183"
     * @param receiverId [string]: identifier of accountholder in the graph.
     * @param senderType [string]: sender person type. Options: "individual", "business"
     * @param senderTaxIdCreated [string]: sender's taxId creation date. For business type only.
     * @param senderAccountCreated [string]: sender's account creation date.
     * @param senderBankCode [string]: sender's bank code. ex: "20018183"
     * @param senderId [string]: identifier of accountholder in the graph.
     * @param settled [string]: settled datetime of the transaction in ISO format. ex: "2020-03-10 10:30:00.000000+00:00"
     */
    constructor({ 
                    endToEndId, amount, nominalAmount, receiverType, receiverTaxIdCreated, receiverAccountCreated,
                    receiverBankCode, receiverId, senderType, senderTaxIdCreated, senderAccountCreated,
                    senderBankCode, senderId, settled
                }) {
        super();
        this.endToEndId = endToEndId;
        this.amount = amount;
        this.nominalAmount = nominalAmount;
        this.receiverType = receiverType;
        this.receiverTaxIdCreated = receiverTaxIdCreated;
        this.receiverAccountCreated = receiverAccountCreated;
        this.receiverBankCode = receiverBankCode;
        this.receiverId = receiverId;
        this.senderType = senderType;
        this.senderTaxIdCreated = senderTaxIdCreated;
        this.senderAccountCreated = senderAccountCreated;
        this.senderBankCode = senderBankCode;
        this.senderId = senderId;
        this.settled = check.datetime(settled);
    }
}

exports.Transaction = Transaction;
exports.subResource = {'class': exports.Transaction, 'name': 'Transaction'};
