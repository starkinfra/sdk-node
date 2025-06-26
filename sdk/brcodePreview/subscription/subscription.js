const check = require('starkcore').check;
const SubResource = require('starkcore').SubResource;


class Subscription extends SubResource {
    /**
     *
     * Subscription object
     *
     * @description Subscription is a recurring payment that can be used to charge a user periodically.
     *
     * Parameters (required):
     * @param amount [number]: amount to be charged in cents. ex: 1000 = R$ 10.00
     * @param amountMinLimit [number]: minimum amount limit for the subscription. ex: 500 = R$ 5.00
     * @param bacenId [string]: BACEN (Brazilian Central Bank) identifier.
     * @param created [string]: creation datetime for the subscription. ex: '2020-03-10 10:30:00.000'
     * @param description [string]: description of the subscription.
     * @param installmentEnd [string]: end datetime for the installments. ex: '2020-03-10 10:30:00.000'
     * @param installmentStart [string]: start datetime for the installments. ex: '2020-03-10 10:30:00.000'
     * @param interval [string]: interval for the recurring charge. ex: 'monthly'
     * @param pullRetryLimit [number]: maximum number of retries for pulling the payment.
     * @param receiverBankCode [string]: bank code of the receiver.
     * @param receiverName [string]: name of the receiver.
     * @param receiverTaxId [string]: tax ID of the receiver.
     * @param referenceCode [string]: reference code for the subscription.
     * @param senderFinalName [string]: final sender name.
     * @param senderFinalTaxId [string]: final sender tax ID.
     * @param status [string]: current status of the subscription.
     * @param type [string]: type of the subscription.
     * @param updated [string]: last update datetime for the subscription. ex: '2020-03-10 10:30:00.000'
     *
     */
    constructor({
        amount = null, amountMinLimit = null, bacenId = null, created = null,
        description = null, installmentEnd = null, installmentStart = null, interval = null,
        pullRetryLimit = null, receiverBankCode = null, receiverName = null, receiverTaxId = null,
        referenceCode = null, senderFinalName = null, senderFinalTaxId = null, status = null,
        type = null, updated = null
    }) {
        super();

        this.amount = amount;
        this.amountMinLimit = amountMinLimit;
        this.bacenId = bacenId;
        this.created = check.datetime(created);
        this.description = description;
        this.installmentEnd = check.datetime(installmentEnd);
        this.installmentStart = check.datetime(installmentStart);
        this.interval = interval;
        this.pullRetryLimit = pullRetryLimit;
        this.receiverBankCode = receiverBankCode;
        this.receiverName = receiverName;
        this.receiverTaxId = receiverTaxId;
        this.referenceCode = referenceCode;
        this.senderFinalName = senderFinalName;
        this.senderFinalTaxId = senderFinalTaxId;
        this.status = status;
        this.type = type;
        this.updated = check.datetime(updated);
    }
}

exports.Subscription = Subscription;
exports.subResource = {'class': exports.Subscription, 'name': 'Subscription'};
