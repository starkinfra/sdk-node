exports.generateExampleInvoiceJson = function() {
    return {
        'amount': Math.floor(Math.random() * (Math.floor(1000) - Math.ceil(1) + 1)) + Math.ceil(1)
    }
};
