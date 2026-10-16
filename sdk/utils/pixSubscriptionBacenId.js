const bacenId = require('./bacenId.js');


exports.create = function (bankCode, prefix) {
    /**
     *
     * Create a random Pix subscription bacenId
     *
     * @description Generates a random Pix subscription bacenId based on your bank code (ISPB), used as the
     * bacenId of a PixPullSubscription. The date part is always generated in UTC, regardless of the machine timezone.
     *
     * Parameters (required):
     * @param bankCode [string]: your bank code (ISPB). ex: '20018183'
     * @param prefix [string]: subscription prefix. ex: 'RR'
     *
     * Return:
     * @returns 29-character bacenId composed of the prefix, the bank code, the current UTC date (yyyyMMdd) and 11 random alphanumeric characters. ex: 'RR2001818320261016aB3xK9mQ2wZ'
     *
     */
    return prefix + bacenId.create(bankCode, 'yyyyMMdd');
}
