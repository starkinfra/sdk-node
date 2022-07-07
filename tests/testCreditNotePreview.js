const assert = require("assert")
const starkinfra = require("../index.js")
const { getPreviewExamples } = require("./utils/creditNotePreview")

starkinfra.user = require("./utils/user").exampleProject

describe("TestCreditNotePreviewSac", function () {
    this.timeout(10000)
    it("test_success", async () => {
        const previews = starkinfra.creditNotePreview.create(getPreviewExamples(n=10, type="sac"))

        ;(await previews).forEach(preview => {
            assert.equal(preview.type, "sac")
            assert.equal(preview.count, preview.invoices.length)
        })
    })
})

describe("TestCreditNotePreviewPrice", function () {
    this.timeout(10000)
    it("test_success", async () => {
        const previews = starkinfra.creditNotePreview.create(getPreviewExamples(n=10, type="price"))

        ;(await previews).forEach(preview => {
            assert.equal(preview.type, "price")
            assert.equal(preview.count, preview.invoices.length)
        })
    })
})

describe("TestCreditNotePreviewAmerican", function () {
    this.timeout(10000)
    it("test_success", async () => {
        const previews = starkinfra.creditNotePreview.create(getPreviewExamples(n=10, type="american"))

        ;(await previews).forEach(preview => {
            assert.equal(preview.type, "american")
            assert.equal(preview.count, preview.invoices.length)
        })
    })
})

describe("TestCreditNotePreviewBullet", function () {
    this.timeout(10000)
    it("test_success", async () => {
        const previews = starkinfra.creditNotePreview.create(getPreviewExamples(n=10, type="bullet"))

        ;(await previews).forEach(preview => {
            assert.equal(preview.type, "bullet")
            assert.equal(preview.count, preview.invoices.length)
        })
    })
})

describe("TestCreditNotePreviewCustom", function () {
    this.timeout(10000)
    it("test_success", async () => {
        const previews = starkinfra.creditNotePreview.create(getPreviewExamples(n=10, type="custom"))

        ;(await previews).forEach(preview => {
            assert.equal(preview.type, "custom")
            assert.equal(preview.count, preview.invoices.length)
        })
    })
})
