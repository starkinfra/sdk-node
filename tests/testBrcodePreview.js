const assert = require('assert');
const starkinfra = require('../index.js');
const {generateExampleDynamicBrcodeJson} = require('./utils/dynamicBrcode');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestBrcodePreviewPost', function(){
    this.timeout(10000);
    it('test_success', async () => {
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

    it('test_subscription', async () => {
        const brcode = new starkinfra.DynamicBrcode(generateExampleDynamicBrcodeJson("subscription"));
        const [createdBrcode] = await starkinfra.dynamicBrcode.create([brcode]);
        console.log("createdBrcode", createdBrcode);

        let preview = await starkinfra.brcodePreview.create([
            new starkinfra.BrcodePreview({id: createdBrcode.id, payerId:"20.018.183/0001-80"}),
        ]);

        console.log("preview", preview);
    });
});
