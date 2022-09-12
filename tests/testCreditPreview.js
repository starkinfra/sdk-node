const assert = require("assert");
const starkinfra = require("../index.js");
const { getCreditNotePreviewExample } = require("./utils/creditNotePreview");

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
