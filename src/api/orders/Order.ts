
import moment from 'moment-timezone'
import { Optional } from '../../helpers/general';
import AppSettings from '../../settings';
import getErrorObjFromApiObjValidateFunction from '../helpers';
import {OrderJsonResponseObj, orderResponseObjValidator} from './validation';
import currency from  'currency.js'


export default class Order{

    readonly id: string;
    readonly user: {
        readonly firstName: string;
        readonly lastName: string;
        readonly email: string;
        readonly phoneNumber: string;
    };
    readonly creationDate: moment.Moment;
    readonly detailsJson: OrderJsonResponseObj['details_json'];
    readonly userNotes: Optional<string>;
    readonly isCompleted: boolean;
    readonly orderNum: number;
    readonly subtotalCharged: Optional<number>;
    readonly vatCharged: Optional<number>;
    readonly userPaidOnline: boolean;
    readonly userWantsOrderDelivered: boolean;

    constructor(orderJsonResponseObj: OrderJsonResponseObj){
        if (orderResponseObjValidator(orderJsonResponseObj) === false){
            throw getErrorObjFromApiObjValidateFunction(orderResponseObjValidator, 'Order');
        }
        const json = orderJsonResponseObj;

        this.id = json.id;

        this.user = {
            firstName: json.user.first_name,
            lastName: json.user.last_name,
            email: json.user.email,
            phoneNumber: json.user.phone_number,
        };
        this.creationDate = moment(json.creation_date);
        this.detailsJson = json.details_json;
        this.userNotes = json.user_notes;
        this.isCompleted = json.is_completed;
        this.orderNum = json.order_num;
        this.subtotalCharged = json.subtotal_charged;
        this.vatCharged = json.vat_charged;
        this.userPaidOnline = json.user_paid_online;
        this.userWantsOrderDelivered = json.user_wants_order_delivered;
    }

    calculatePriceInfo(): {
        total: number,
        subtotal: number,
        vat: number,
    }{
        let subtotal: currency;
        let vat: currency;

        if (this.userPaidOnline){
            subtotal = currency(this.subtotalCharged ?? 0);
            vat = currency(this.vatCharged ?? 0);
        } else {
            subtotal = this.detailsJson.reduce<currency>((a1, a2) => {
                return a1.add(currency(a2.quantity).multiply((a2.entry_type === 'product' ? a2.product_price : a2.meal_price)));
            }, currency(0));
            vat = currency(AppSettings.vatPercentage).multiply(subtotal);
        }
        return {
            subtotal: subtotal.dollars(),
            vat: vat.dollars(),
            total: subtotal.add(vat).dollars(),
        }
    }

}




