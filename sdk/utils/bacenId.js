let randomSource = 'abcdefghijklmnopqrstuvwxyz'.split('');
randomSource.forEach((c) => { randomSource.push(c.toUpperCase())});
'0123456789'.split('').forEach((c) => { randomSource.push(c.toUpperCase())});

function formatDate(now, dateFormat) {
    return dateFormat
        .replace('yyyy', String(now.getFullYear()))
        .replace('MM', String(now.getMonth() + 1).padStart(2, '0'))
        .replace('dd', String(now.getDate()).padStart(2, '0'))
        .replace('HH', String(now.getHours()).padStart(2, '0'))
        .replace('mm', String(now.getMinutes()).padStart(2, '0'))
}

exports.create = function (bankCode, dateFormat = 'yyyyMMddHHmm') {
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
