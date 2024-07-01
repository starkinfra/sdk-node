const assert = require('assert');
const starkinfra = require('../index.js');
const path = require('path');

starkinfra.user = require('./utils/user').exampleProject;

describe('TestRequestGet', function(){
    this.timeout(10000); 
    it('test_success', async () => {
        let path = "/pix-request/";
        let query={"limit": 10};
        let i=0;
        let list = await starkinfra.request.get(path, query);
        for (let pix of list["content"]["requests"]) {
            assert(typeof pix.id == 'string');
            i += 1;
        }
        assert(i === 10);
    });
});

describe('TestRequestGetPagination', function(){
    this.timeout(10000); 
    it('test_success', async () => {
        let path = "/pix-request/log";
        let cursor = null;
        let counter = 0;
        while (true) {
            request = await starkinfra.request.get(path, {"cursor": cursor});
            cursor = request["content"]["cursor"]
            for (let i of request["content"]["logs"]) {
                counter+=1;
            }
            if (cursor == null || counter>199) {
                break;
            }
        }
        assert(counter<=200);
    });
});

describe('TestRequestPostPatchDelete', function(){
    this.timeout(10000); 
    let exampleId;
    it('test_post', async () => {
        let extId = Date.now().toString();
        let data = {
            "holders": [
                {
                    "name": "Jaime Lannister",
                    "externalId": extId,
                    "taxId": "012.345.678-90"
                }
            ]
        };
        let request = await starkinfra.request.post(
            "/issuing-holder",
            data,
        );
        exampleId = request["content"]["holders"][0]["id"];
        let createdExample = await starkinfra.request.get(
            `/issuing-holder/${exampleId}`
        );
        assert(createdExample["content"]["holder"]["externalId"] == extId);
    });

    it('test_patch', async () => {
        let testAssertion = Date.now().toString();
        let path = `/issuing-holder/${exampleId}`    
        await starkinfra.request.patch(
            path,
            {"tags": [testAssertion]}
        )
        let holder = await starkinfra.request.get(path)
        assert(holder["content"]["holder"]["tags"][0] == testAssertion)
    });

    it('test_delete', async () => {
        let holder = await starkinfra.request.delete(
            `issuing-holder/${exampleId}`
        )
        assert(holder["content"]["holder"]["status"] == "canceled")
    });
});
