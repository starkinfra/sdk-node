const assert = require('assert');
const starkinfra = require('../index.js');
const {createDynamicBrcodeByType} = require('./utils/dynamicBrcode');
const {createBrcodePreviewById} = require('./utils/brcodePreview');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestBrcodePreviewPost', function(){
    this.timeout(10000);
    it('test_query', async () => {
        let dynamicBrcodes = await starkinfra.dynamicBrcode.query({limit: 2});
        let dynamicBrcodesArray = [];
        for await (let dynamicBrcode of dynamicBrcodes){
            dynamicBrcodesArray.push(dynamicBrcode);
        }

        let staticBrcodes = await starkinfra.staticBrcode.query({limit: 2});
        let staticBrcodesArray = [];
        for await (let staticBrcode of staticBrcodes){
            staticBrcodesArray.push(staticBrcode);
        }

        let brcodes = dynamicBrcodesArray.concat(staticBrcodesArray);

        let previews = await starkinfra.brcodePreview.create([
            new starkinfra.BrcodePreview({id: brcodes[0].id, payerId:"20.018.183/0001-80"}),
            new starkinfra.BrcodePreview({id: brcodes[1].id, payerId:"20.018.183/0001-80"}),
            new starkinfra.BrcodePreview({id: brcodes[2].id, payerId:"20.018.183/0001-80"}),
            new starkinfra.BrcodePreview({id: brcodes[3].id, payerId:"20.018.183/0001-80"}),
        ]);
        
        assert(previews.length === 4);

        let index = 0
        for await (let preview of previews){
            assert(preview.id === brcodes[index].id);
            index += 1;
        }
    });

    it('test_type_instant', async () => {
        const createdBrcode = await createDynamicBrcodeByType("instant");
        const preview = await createBrcodePreviewById(createdBrcode.id);

        assert(preview.id === createdBrcode.id);
        assert(preview.due === '');
        assert(Object.keys(preview.subscription).length === 0);
    });

    it('test_type_due', async () => {
        const createdBrcode = await createDynamicBrcodeByType("due");
        const preview = await createBrcodePreviewById(createdBrcode.id);

        assert(preview.id === createdBrcode.id);
        assert(preview.due !== '');
        assert(Object.keys(preview.subscription).length === 0);
    });

    it('test_type_subscription', async () => {
        const createdBrcode = await createDynamicBrcodeByType("subscription");
        const preview = await createBrcodePreviewById(createdBrcode.id);

        assert(preview.id === createdBrcode.id);
        assert(preview.payerId === '');
        assert(preview.subscription.type === 'qrcode');
    });

    it('test_type_subscription_and_instant', async () => {
        const createdBrcode = await createDynamicBrcodeByType("subscriptionAndInstant");
        const preview = await createBrcodePreviewById(createdBrcode.id);

        assert(preview.id === createdBrcode.id);
        assert(preview.payerId !== '');
        assert(preview.subscription.type === 'qrcodeAndPayment');
    });

    it('test_type_due_and_or_subscription', async () => {
        const createdBrcode = await createDynamicBrcodeByType("dueAndOrSubscription");
        const preview = await createBrcodePreviewById(createdBrcode.id);

        assert(preview.id === createdBrcode.id);
        assert(preview.payerId !== '');
        assert(preview.subscription.type === 'paymentAndOrQrcode');
    });
});
