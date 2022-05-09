const starkinfra = require('../../index.js');


exports.get = async function () {
    let endToEndIds = [];
    let requests = await starkinfra.pixRequest.query({ limit: 10 });
    for await (let request of requests) {
        endToEndIds.push(String(request.endToEndId));
    }
    if (endToEndIds.length < 1) {
        console.log('Sorry, There are no PixRequests in your workspace');
    }
    return endToEndIds;
}
