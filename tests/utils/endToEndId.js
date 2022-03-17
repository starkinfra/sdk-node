const starkinfra = require('../../index.js');


exports.get = async function () {
  let endToEndId = "";
  let cursor = null;
  let page = null;
  while (endToEndId === "") {
    [page, cursor] = await starkinfra.pixRequest.page({status: "success", limit: 5, cursor: cursor });
    for (let request of page) {
      if (request.flow == "in" && request.amount > 1 ) {
        return request.endToEndId
      }
    }
    if (cursor == null) {
      break;
    }
  }
  return null;
}
