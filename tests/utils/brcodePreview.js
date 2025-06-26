const starkinfra = require('../../index.js');


exports.createBrcodePreviewById = async function (id) {
    const brcodePreview = await starkinfra.brcodePreview.create([
        new starkinfra.BrcodePreview({id: id, payerId:"20.018.183/0001-80"}),
    ])
    return brcodePreview[0]
}