const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestBrcodePreviewPost', function(){
    this.timeout(10000);
    it('test_success', async () => {

        let dynamicBrcodes = await starkinfra.dynamicBrcode.create(
            [
                {
                    name: "Arya Stark",
                    city: "São Paulo", 
                    externalId: "winterfell"+ Math.random(),
                },
                {
                    name: "John Snow",
                    city: "São Paulo", 
                    externalId: "winterfell"+ Math.random(),
                }
            ])

        let staticBrcodes = await starkinfra.staticBrcode.query({limit: 2});
        let staticBrcodesArray = [];
        for await (let staticBrcode of staticBrcodes){
            staticBrcodesArray.push(staticBrcode);
        }
        
        let brcodes = [...dynamicBrcodes, ...staticBrcodesArray];
        
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
});
