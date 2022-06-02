const assert = require('assert');
const starkinfra = require('../index.js');

starkinfra.user = require('./utils/user').exampleProject;


describe('TestPixDirectorPost', function() {
    this.timeout(100000);
    it('test_success', async () => {
        let pass = String(Math.floor(Math.random() * (99999999 - 10000000 + 1) + 10000000));
        console.log(pass);
        let director = new starkinfra.PixDirector({
            name: 'Stark Sociedade de Crédito Direto S.A.',
            taxId: '39.908.427/0001-28',
            phone: '+551141164616',
            email: 'bacen@starkbank.com',
            password: pass,
            teamEmail: 'bacen@starkbank.com',
            teamPhones: ['+551141164616'],
        });
        let createdDirector = await starkinfra.pixDirector.create(director);
        assert(createdDirector.name === director.name);
        assert(createdDirector.phone === director.phone);
        assert(createdDirector.taxId === director.taxId);
        console.log(createdDirector);
    });
});
