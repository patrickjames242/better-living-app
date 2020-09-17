
import moment from 'moment-timezone';
import { assertValidObjFromApi } from '../helpers';
import { CartProductEntryResponseObj, cartProductEntryResponseObjValidator } from './validation';

export class CartProductEntry{

    // to force users to create an instance of this class in order to use this type
    private readonly dummyVariable = '';

    readonly id: string;
    readonly productId: number;
    readonly dateCreated: moment.Moment;
    readonly quantity: number;

    constructor(id: string, productId: number, dateCreated: moment.Moment, quantity: number){
        this.id = id;
        this.productId = productId;
        this.dateCreated = dateCreated;
        this.quantity = quantity;
    }

    static parse(apiResponseObj: CartProductEntryResponseObj){
        assertValidObjFromApi(cartProductEntryResponseObjValidator, 'CartProductEntry', apiResponseObj);
        const json = apiResponseObj;
        return new CartProductEntry(json.id, json.product_id, moment(json.date_created), json.quantity);
    }


}


