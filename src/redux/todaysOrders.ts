import { List, Map } from "immutable";
import Order from "../api/orders/Order";
import ActionStrings from "./actionStrings";
import { LogOutAction } from "./authentication";
import { CustomReduxAction } from "./helpers";


export type UpdateAllOrdersAction = CustomReduxAction<{
    allOrders: List<Order>,
}>;

export function updateAllOrdersAction(allOrders: List<Order>): UpdateAllOrdersAction{
    return {
        type: ActionStrings.todaysOrders.UPDATE_ALL_ORDERS,
        allOrders,
    }
}



export type InsertOrUpdateOrderAction = CustomReduxAction<{
    order: Order;
}>;

export function insertOrUpdateOrderAction(order: Order): InsertOrUpdateOrderAction{
    return {
        type: ActionStrings.todaysOrders.INSERT_OR_UPDATE_ORDER,
        order,
    }
}



export type TodaysOrdersActions = UpdateAllOrdersAction | InsertOrUpdateOrderAction | LogOutAction;

export type TodaysOrdersState = Map<string, Order>;

export function todaysOrdersReducer(state: TodaysOrdersState = Map(), action: TodaysOrdersActions): TodaysOrdersState{
    switch (action.type){
        case ActionStrings.todaysOrders.UPDATE_ALL_ORDERS:{
            const {allOrders} = action as UpdateAllOrdersAction;
            return Map<string, Order>().withMutations(map => {
                allOrders.forEach(order => {
                    map.set(order.id, order);
                });
            });
        }
        case ActionStrings.todaysOrders.INSERT_OR_UPDATE_ORDER:{
            const {order} = action as InsertOrUpdateOrderAction;
            return state.set(order.id, order);
        }
        case ActionStrings.authentication.LOG_OUT:
            return Map();
        default: 
            return state;
    }
}


