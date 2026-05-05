const assert = require('assert');
const starkinfra = require('../index.js');
const {getPixInfractionToPatch} = require('./utils/pixInfraction');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestPixInfractionCreateDeprecated', function(){
    this.timeout(10000);
    it('test_create_throws_deprecated', async () => {
        await assert.rejects(
            () => starkinfra.pixInfraction.create([]),
            { message: 'Function deprecated since v0.18.0' }
        );
    });
});

describe('TestPixInfractionQuery', function(){
    this.timeout(10000);
    it('test_success', async () => {
        const infractions = await starkinfra.pixInfraction.query({
            limit: 2,
        });

        const ids=[];
        for await(const infraction of infractions) ids.push(infraction.id);
        assert(ids.length===2)
    });
});


describe('TestPixInfractionGetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixInfraction.page({ limit: 5, cursor: cursor });
            for (let entity of page) {
                assert(!ids.includes(entity.id));
                ids.push(entity.id);
            }
            if (cursor == null) {
                break;
            }
        }
        assert(ids.length === 10);
    });
});

describe('TestPixInfractionGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const infractions = await starkinfra.pixInfraction.query({limit: 1});
        const infractionId = (await infractions.next()).value.id;
        const infraction = await starkinfra.pixInfraction.get(infractionId);
        assert(typeof infraction.id == 'string');
    });
});

describe('TestPixInfractionInfoGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let infractions = await starkinfra.pixInfraction.query({limit: 3});
        for await (let infraction of infractions) {
            assert(typeof infraction.id == 'string');
            infraction = await starkinfra.pixInfraction.get(infraction.id);
            assert(typeof infraction.id == 'string');
        }
    });

    it('test_success_ids', async () => {
        let infractions = await starkinfra.pixInfraction.query({limit: 10});
        let infractionsIdsExpected = [];
        for await (let infraction of infractions) {
            infractionsIdsExpected.push(infraction.id);
        }

        let infractionsResult = await starkinfra.pixInfraction.query({ids: infractionsIdsExpected});
        let infractionsIdsResult = [];
        for await (let infraction of infractionsResult){
            infractionsIdsResult.push(infraction.id);
        }

        infractionsIdsExpected.sort();
        infractionsIdsResult.sort();
        assert(infractionsIdsExpected.length === infractionsIdsResult.length);
        for (let i=0; i<infractionsIdsExpected.length; i++){
            assert(infractionsIdsExpected[i] === infractionsIdsResult[i]);
        }
    });
});

describe('TestPixInfractionPatch', function() {
    this.timeout(10000);
    it('test_success', async () => {
        let pixInfraction = await getPixInfractionToPatch();
        assert(pixInfraction.status === 'delivered');
        pixInfraction = await starkinfra.pixInfraction.update(pixInfraction.id, 'agreed', {fraudType: 'scam'})
        assert(pixInfraction.result === 'agreed');
    });
});

