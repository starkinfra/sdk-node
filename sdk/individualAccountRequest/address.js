const SubResource = require('starkcore').SubResource;


class Address extends SubResource {
    /**
     *
     * Address object
     *
     * @description The Address object is the structured residential address of the individual referenced by an
     * IndividualAccountRequest. It is embedded on the parent's address field and has no endpoints of its own.
     *
     * Parameters (required):
     * @param street [string]: street name. ex: 'Rua do Estilo Barroco'
     * @param number [string]: street number. ex: '648'
     * @param neighborhood [string]: neighborhood / district. ex: 'Santo Amaro'
     * @param city [string]: city. ex: 'São Paulo'
     * @param state [string]: state (BR 2-letter code). ex: 'SP'
     * @param zipCode [string]: ZIP code (BR CEP), formatted or digit-only. ex: '05724005'
     *
     */
    constructor({
        street = null, number = null, neighborhood = null, city = null, state = null, zipCode = null
    }) {
        super();
        this.street = street;
        this.number = number;
        this.neighborhood = neighborhood;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
    }
}

exports.Address = Address;
exports.subResource = {'class': exports.Address, 'name': 'Address'};
