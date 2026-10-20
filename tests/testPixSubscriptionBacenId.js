const assert = require("assert");
const starkinfra = require("../index.js");


function utcDate(now) {
    return String(now.getUTCFullYear()) +
        String(now.getUTCMonth() + 1).padStart(2, '0') +
        String(now.getUTCDate()).padStart(2, '0');
}


function minutesFromUtcNow(stamp) {
    const generated = Date.UTC(
        Number(stamp.slice(0, 4)),
        Number(stamp.slice(4, 6)) - 1,
        Number(stamp.slice(6, 8)),
        Number(stamp.slice(8, 10)),
        Number(stamp.slice(10, 12)),
    );
    return Math.abs(Date.now() - generated) / 60000;
}


describe("TestPixSubscriptionBacenId", function () {
    it("test_success", () => {
        const bacenId = starkinfra.pixSubscriptionBacenId.create("32160637", "RR");
        assert.strictEqual(bacenId.length, 29);
        assert(/^RR32160637\d{8}[a-zA-Z0-9]{11}$/.test(bacenId));
        assert.strictEqual(bacenId.slice(10, 18), utcDate(new Date()));
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

    it("test_end_to_end_id_and_return_id_use_utc", () => {
        const endToEndId = starkinfra.endToEndId.create("32160637");
        const returnId = starkinfra.returnId.create("32160637");
        assert(minutesFromUtcNow(endToEndId.slice(9, 21)) <= 2);
        assert(minutesFromUtcNow(returnId.slice(9, 21)) <= 2);
    });
});
