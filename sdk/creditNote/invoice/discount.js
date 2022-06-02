const SubResource = require('../../utils/subResource.js').SubResource


class Discount extends SubResource {
    /**
     *
     * CreditNote.Invoice.Discount object
     *
     * @description Used to define a discount in the Invoice.
     *
     * Parameters (required):
     * @param percentage [integer]: discount percentage that will be applied. ex: 2.5
     * @param due [string]: Date after when the discount will be overdue in UTC ISO format. ex: '2020-11-25T17:59:26.249976+00:00'
     *
     */
    constructor({ percentage, due }) {
        super();

        this.percentage = percentage;
        this.due = due;
    }
}

exports.Discount = Discount;
exports.subResource = {'class': exports.Discount, 'name': 'Discount'};
