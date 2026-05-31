const fs = require('fs');
const starkinfra = require('../../index.js');

const EXAMPLE_IMAGE_PATH = 'tests/utils/identity/identity-front-face.png';

exports.exampleImageContent = function () {
    return fs.readFileSync(EXAMPLE_IMAGE_PATH);
};

exports.generateExampleIndividualAccountAttachment = function (accountRequestId) {
    return {
        type: "identity-front",
        content: exports.exampleImageContent(),
        contentType: "image/png",
        accountRequestId: accountRequestId,
        tags: ["attachment-test"]
    };
};
