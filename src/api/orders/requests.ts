

import { Optional } from "../../helpers/general";
import { fetchFromAPI, HttpMethod } from "../api";
import Order from "./Order";
import { OrderJsonResponseObj } from "./validation";


const basePath = 'ordering-system/orders/'

export interface OrderRequestObj{
    user_notes: Optional<string>;
    user_paid_online: boolean;
    user_wants_order_delivered: boolean;
    order_items: ({
        entry_type: 'product',
        product_id:  number,
        quantity: number,
    } | {
        entry_type: 'meal',
        quantity: number,
        meal_id: number,
        choices: {
            chosen_product_id: number,
            meal_category_id: number,
        }[];
    })[];
}


export function submitOrder(requestInfo: OrderRequestObj){
    return fetchFromAPI<OrderJsonResponseObj>({
        method: HttpMethod.post,
        path: basePath + 'submit-order/?emptyCartOnComplete=true',
        jsonBody: requestInfo,
    }).then(result => {
        return new Order(result);
    });
}


