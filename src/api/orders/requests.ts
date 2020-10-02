

import { Optional } from "../../helpers/general";
import { CartEntriesMapValue } from "../../redux/cart";
import { fetchFromAPI, HttpMethod } from "../api";
import { CartProductEntry } from "../cart/CartProductEntry";
import Order from "./Order";
import { OrderJsonResponseObj } from "./validation";


const basePath = 'orders/';

export type OrderItemRequestObj = {
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
}

export interface OrderRequestObj{
    user_notes: Optional<string>;
    user_paid_online: boolean;
    user_wants_order_delivered: boolean;
    order_items: OrderItemRequestObj[];
}

export function getRequestOrderItemsFromCartEntries(cartEntries: CartEntriesMapValue[]): OrderItemRequestObj[]{
    return cartEntries.map(x => {
        const quantity = (() => {
            if (x.pendingQuantityChangesInfo == null){
                return x.entry.quantity;
            } else {
                return x.pendingQuantityChangesInfo.originalQuantity + x.pendingQuantityChangesInfo.pendingChange;
            }
        })();

        if (x.entry instanceof CartProductEntry){
            return {
                entry_type: 'product',
                product_id: x.entry.productId,
                quantity: quantity,
            }
        } else {
            return {
                entry_type: 'meal',
                quantity: quantity,
                meal_id: x.entry.mealId,
                choices: x.entry.choices.toArray().map(y => ({
                    chosen_product_id: y.chosenProductId,
                    meal_category_id: y.mealProductCategoryId,
                })),
            }
        }
    });
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


export function checkOrderValidity(orderItems: OrderItemRequestObj[]){
    return fetchFromAPI<null>({
        method: HttpMethod.put,
        path: basePath + 'check-order-validity/',
        jsonBody: {
            order_items: orderItems,
        }
    });
}

