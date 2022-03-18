const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestPixStatement Post', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let statement = new starkinfra.PixStatement(examplePixStatement);
        statement = await starkinfra.pixStatement.create(statement);
        assert(typeof statement.id == 'string');
        console.log(statement)
    });
});

describe('TestPixStatement Get', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let i = 0;
        const statements = await starkinfra.pixStatement.query({limit: 50});
        for await (let statement of statements) {
            assert(typeof statement.id == 'string');
            i += 1;
        }
        assert(i === 50);
    });
});

describe('TestPixStatement InfoGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let statements = await starkinfra.pixStatement.query({limit: 3});
        for await (let statement of statements) {
            assert(typeof statement.id == 'string');
            statement = await starkinfra.pixStatement.get(statement.id);
            assert(typeof statement.id == 'string');
        }
    });

    it('test_success_ids', async () => {
        let statements = await starkinfra.pixStatement.query({limit: 10});
        let statementsIdsExpected = [];
        for await (let statement of statements) {
            statementsIdsExpected.push(statement.id);
        }

        let statementsResult = await starkinfra.pixStatement.query({ids: statementsIdsExpected});
        let statementsIdsResult = [];
        for await (let statement of statementsResult){
            statementsIdsResult.push(statement.id);
        }

        statementsIdsExpected.sort();
        statementsIdsResult.sort();
        assert(statementsIdsExpected.length === statementsIdsResult.length);
        for (let i=0; i<statementsIdsExpected.length; i++){
            assert(statementsIdsExpected[i] === statementsIdsResult[i]);
        }
    });
});

describe('TestPixStatement PdfGet', function(){
    this.timeout(10000);
    it('test_success', async () => {
        let cursor = null;
        let page = null;
        let trigger = true;
        while (trigger) {
            [page, cursor] = await starkinfra.pixStatement.page({cursor: cursor, limit: 10});
            for await (let statement of page) {
                if (statement.status === "success") {
                    let csv = await starkinfra.pixStatement.csv(statement.id);
                    assert(Buffer.isBuffer(csv));
                    trigger = false;
                    break
                }
            }
            if (cursor == null) {
                break;
            }
        }
    });
});

describe('TestPixStatement GetPage', function () {
    this.timeout(10000);
    it('test_success', async () => {
        let ids = [];
        let cursor = null;
        let page = null;
        for (let i = 0; i < 2; i++) {
            [page, cursor] = await starkinfra.pixStatement.page({ limit: 5, cursor: cursor });
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

let examplePixStatement = {
    after: '2022-02-01',
    before: '2022-02-01',
    type: 'transaction'
}
