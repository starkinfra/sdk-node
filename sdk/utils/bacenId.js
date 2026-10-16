let randomSource = 'abcdefghijklmnopqrstuvwxyz'.split('');
randomSource.forEach((c) => { randomSource.push(c.toUpperCase())});
'0123456789'.split('').forEach((c) => { randomSource.push(c.toUpperCase())});

function formatDate(now, dateFormat) {
    return dateFormat
        .replace('yyyy', String(now.getUTCFullYear()))
        .replace('MM', String(now.getUTCMonth() + 1).padStart(2, '0'))
        .replace('dd', String(now.getUTCDate()).padStart(2, '0'))
        .replace('HH', String(now.getUTCHours()).padStart(2, '0'))
        .replace('mm', String(now.getUTCMinutes()).padStart(2, '0'))
}

exports.create = function (bankCode, dateFormat = 'yyyyMMddHHmm') {
    /**
     *
     * Create a random bacenId
     *
     * @description Generates a random bacenId based on your bank code (ISPB). The date part is always
     * generated in UTC, regardless of the machine timezone.
     *
     * Parameters (required):
     * @param bankCode [string]: your bank code (ISPB). ex: '20018183'
     *
     * Parameters (optional):
     * @param dateFormat [string, default 'yyyyMMddHHmm']: format of the UTC date part. ex: 'yyyyMMdd'
     *
     * Return:
     * @returns bacenId composed of the bank code, the current UTC date and 11 random alphanumeric characters
     *
     */
    let now = new Date();
    let randomString = ''
    for (let i = 0; i < 11; i++) {
        randomString += randomSource[Math.floor(Math.random() * randomSource.length)]
    }
    return '{bankCode}{date}{randomString}'
        .replace('{bankCode}', bankCode)
        .replace('{date}', formatDate(now, dateFormat))
        .replace('{randomString}', randomString)
}
