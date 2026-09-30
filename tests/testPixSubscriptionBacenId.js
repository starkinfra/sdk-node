const assert = require("assert");
const starkinfra = require("../index.js");


function localDate(now) {
    return String(now.getFullYear()) +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');
}


describe("TestPixSubscriptionBacenId", function () {
    it("test_success", () => {
        const bacenId = starkinfra.pixSubscriptionBacenId.create("32160637", "RR");
        assert.strictEqual(bacenId.length, 29);
        assert(/^RR32160637\d{8}[a-zA-Z0-9]{11}$/.test(bacenId));
        assert.strictEqual(bacenId.slice(10, 18), localDate(new Date()));
    });

    it("test_random_part_differs", () => {
        const first = starkinfra.pixSubscriptionBacenId.create("32160637", "RR");
        const second = starkinfra.pixSubscriptionBacenId.create("32160637", "RR");
        assert.notStrictEqual(first, second);
    });

    it("test_end_to_end_id_and_return_id_keep_minute_precision", () => {
        const endToEndId = starkinfra.endToEndId.create("32160637");
        const returnId = starkinfra.returnId.create("32160637");
        assert.strictEqual(endToEndId.length, 32);
        assert.strictEqual(returnId.length, 32);
        assert(/^E32160637\d{12}[a-zA-Z0-9]{11}$/.test(endToEndId));
        assert(/^D32160637\d{12}[a-zA-Z0-9]{11}$/.test(returnId));
    });
});
