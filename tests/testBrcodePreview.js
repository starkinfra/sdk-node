const assert = require('assert');
const starkinfra = require('../index.js');

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
            new starkinfra.BrcodePreview({id: brcodes[0].id}),
            new starkinfra.BrcodePreview({id: brcodes[1].id}),
            new starkinfra.BrcodePreview({id: brcodes[2].id}),
            new starkinfra.BrcodePreview({id: brcodes[3].id}),
        ]);
        
        assert(previews.length === 4);

        let index = 0
        for await (let preview of previews){
            assert(preview.id === brcodes[index].id);
            index += 1;
        }
    });
});
