const { IssuingRestock } = require("../../sdk/issuingRestock");
const starkinfra = require('../../index.js');
const {generateExampleCardJson} = require('./issuingCard.js');

exports.generateExampleIssuingEmbossingRequestJson = async (n = 1) => {


    const holders = await starkinfra.issuingHolder.query({limit: 1});

    let singleHolder;
    for await (let holder of holders) {
        singleHolder = holder;
    }

    const kits = await starkinfra.issuingEmbossingKit.query({limit: 1});

    let singleKit;
    for await (let kit of kits) {
        singleKit = kit;
    }

    const card = (await starkinfra.issuingCard.create(generateExampleCardJson(singleHolder, n=1, type="physical", productId="52233227")))[0];

    let exampleEmbossingRequest = {
        cardId: "9898989898989898", 
        kitId: singleKit.id,
        displayName1: "Eren Jaeger", 
        shippingCity: "Paradis Island", 
        shippingCountryCode: "BRA", 
        shippingDistrict: "Shiganshina", 
        shippingService: "loggi", 
        shippingStateCode: "SP", 
        shippingStreetLine1: "Wall Maria", 
        shippingStreetLine2: "Wall Rose", 
        shippingTrackingNumber: "1234567890", 
        shippingZipCode: "12345-678",
        embosserId: "5746980898734080"
    };

    let requests = [];
    for (let i = 0; i < n; i++) {
        exampleEmbossingRequest.cardId = card.id;
        requests.push(new starkinfra.IssuingEmbossingRequest(exampleEmbossingRequest));
    }
    
    return requests;
};
