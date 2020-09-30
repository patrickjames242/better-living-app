import { List } from "immutable";
import store from "../../redux/store";
import { insertOrUpdateOrderAction, updateAllOrdersAction } from "../../redux/todaysOrders";
import Order from "./Order";

enum ChangeUpdateType{
    insert = 'insert'
    // update = 'update'
    // delete = 'delete'
}



export function handleTodaysOrdersRealtimeUpdate(jsonData: any){
    if (jsonData == null || typeof jsonData !== 'object'){return;}

    const all_objects = jsonData.all_objects;

    if (all_objects instanceof Array){
        const allOrders = List<Order>().withMutations(list => {
            all_objects.forEach(orderJson => {
                list.push(new Order(orderJson));
            });
        })
        store.dispatch(updateAllOrdersAction(allOrders));
    }

    switch (jsonData.change_type){
        case ChangeUpdateType.insert:
            store.dispatch(insertOrUpdateOrderAction(new Order(jsonData.changed_object)))
    }
}


