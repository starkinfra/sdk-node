const assert = require("assert");
const starkinfra = require("../index.js");
const { getCreditNotePreviewExample } = require("./utils/creditNotePreview");
const random = require("./utils/random");

starkinfra.user = require("./utils/user").exampleProject;


describe('TestPaymentPreviewCreate', function () {
    this.timeout(30000);
    it('test_success', async () => {
        let creditNoteSac = getCreditNotePreviewExample("sac")
        let creditNotePrice = getCreditNotePreviewExample("price")
        let creditNoteAmerican = getCreditNotePreviewExample("american")
        let creditNoteBullet = getCreditNotePreviewExample("bullet")

        expectedTypes = ["credit-note", "credit-note", "credit-note", "credit-note"]
        expectedNoteTypes = ["sac", "price", "american", "bullet"]
        creditNotePreviews = [
            new starkinfra.CreditPreview({type: "credit-note", credit: creditNoteSac}),
            new starkinfra.CreditPreview({type: "credit-note", credit: creditNotePrice}),
            new starkinfra.CreditPreview({type: "credit-note", credit: creditNoteAmerican}),
            new starkinfra.CreditPreview({type: "credit-note", credit: creditNoteBullet}),
        ]

        previewedTypes = []
        creditNotePreviewedTypes = []
        for (const preview of await starkinfra.creditPreview.create(creditNotePreviews)) {
            previewedTypes.push(preview.type)
            creditNotePreviewedTypes.push(preview.credit.type)
        }

        for (let i = 0; i < expectedTypes.length; i++) {
            assert.equal(previewedTypes[i], expectedTypes[i])
            assert.equal(creditNotePreviewedTypes[i], expectedNoteTypes[i])
        }
    });
});

describe('TestCreditNotePreviewWithNominalAmountOrAmount', function () {
    this.timeout(30000);
    it('test_success', async () => {
        const value = random.randomInt(100000, 1000000);
        // create removes null keys from the sent objects, so the cases are kept apart to check the response
        const cases = [];
        for (const field of ["amount", "nominalAmount"]) {
            for (const type of ["sac", "price", "american", "bullet"]) {
                cases.push({type: type, field: field});
            }
        }
        const sent = cases.map(c => new starkinfra.CreditPreview({type: "credit-note", credit: amountPreview(c.type, c.field, value)}));

        const received = await starkinfra.creditPreview.create(sent);
        assert.equal(received.length, cases.length);

        for (let i = 0; i < cases.length; i++) {
            const receivedNote = received[i].credit;
            assert.equal(receivedNote.type, cases[i].type);
            if (cases[i].field === "nominalAmount") {
                assert.equal(receivedNote.nominalAmount, value);
                assert.ok(receivedNote.amount > 0);
                continue;
            }
            assert.equal(receivedNote.amount, value);
            assert.ok(receivedNote.nominalAmount > 0);
        }
    });
});

function amountPreview(type, field, value) {
    const preview = {
        type: type,
        [field]: value,
        taxId: "012.345.678-90",
        nominalInterest: 12.5,
        scheduled: random.futureDate(random.randomInt(11, 19)),
        initialDue: random.futureDate(random.randomInt(30, 39)),
    };
    // bullet has a single installment, and the API rejects an interval for it
    if (type !== "bullet") {
        preview.count = 12;
        preview.interval = "month";
    }
    return new starkinfra.creditPreview.CreditNotePreview(preview);
}
