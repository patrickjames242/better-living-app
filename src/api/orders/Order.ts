
import moment from 'moment-timezone'
import { NASSAU_TIME_ZONE, Optional } from '../../helpers/general';
import AppSettings from '../../settings';
import getErrorObjFromApiObjValidateFunction from '../helpers';
import {OrderJsonResponseObj, orderResponseObjValidator} from './validation';
import currency from  'currency.js'
import store from '../../redux/store';


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
    readonly deliveryFeeCharged: Optional<number>;
    readonly deliveryDirections: Optional<string>;
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
        this.creationDate = moment(json.creation_date).tz(NASSAU_TIME_ZONE);
        this.detailsJson = json.details_json;
        this.userNotes = json.user_notes;
        this.isCompleted = json.is_completed;
        this.orderNum = json.order_num;
        this.subtotalCharged = json.subtotal_charged;
        this.vatCharged = json.vat_charged;
        this.deliveryFeeCharged = json.delivery_fee_charged;
        this.deliveryDirections = json.delivery_directions;
        this.userPaidOnline = json.user_paid_online;
        this.userWantsOrderDelivered = json.user_wants_order_delivered;
    }

    

}




