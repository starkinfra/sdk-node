const SubResource = require('starkcore').SubResource;


class Address extends SubResource {
    /**
     *
     * Address object
     *
     * @description The Address object is the structured address of the company referenced by a
     * BusinessAccountRequest. It is embedded on the parent's address field and has no endpoints of its own.
     *
     * Parameters (required):
     * @param street [string]: street name. ex: 'Av. Faria Lima'
     * @param number [string]: street number. ex: '2000'
     * @param neighborhood [string]: neighborhood / district. ex: 'Itaim Bibi'
     * @param city [string]: city. ex: 'São Paulo'
     * @param state [string]: state (BR 2-letter code). ex: 'SP'
     * @param zipCode [string]: ZIP code (BR CEP), formatted or digit-only. ex: '04538-132'
     *
     * Parameters (optional):
     * @param complement [string, default null]: address complement. ex: 'Sala 42'
     *
     */
    constructor({
        street = null, number = null, neighborhood = null, city = null, state = null, zipCode = null, complement = null
    }) {
        super();
        this.street = street;
        this.number = number;
        this.neighborhood = neighborhood;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.complement = complement;
    }
}

exports.Address = Address;
exports.subResource = {'class': exports.Address, 'name': 'Address'};
