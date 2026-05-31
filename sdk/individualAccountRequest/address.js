const SubResource = require('starkcore').SubResource;


class Address extends SubResource {
    /**
     *
     * IndividualAccountRequest.Address object
     *
     * @description Structured residential address of the individual. It is exposed only as the
     * 'address' field on an IndividualAccountRequest and is serialized as a nested JSON object on
     * the wire — never flattened into addressStreet / addressCity / etc.
     *
     * Parameters (required):
     * @param street [string]: street name. ex: 'Rua do Estilo Barroco'
     * @param number [string]: street number. String, not integer (may contain non-digit chars). ex: '648'
     * @param neighborhood [string]: neighborhood / district. ex: 'Santo Amaro'
     * @param city [string]: city. ex: 'Sao Paulo'
     * @param state [string]: state (BR 2-letter code). ex: 'SP'
     * @param zipCode [string]: ZIP code (BR CEP). Accepts formatted or digit-only. ex: '05724005'
     *
     */
    constructor({
                    street, number, neighborhood, city, state, zipCode
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
