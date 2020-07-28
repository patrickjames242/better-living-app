import Product from "./Product";
import { getProductFromJsonResponseObj_orNull } from "./helpers";
import { List } from "immutable";
import store from "../../../redux/store";
import { updateAllProductsAction, insertOrUpdateProductAction, deleteProductAction } from "../../../redux/orderingSystem/products";



export function handleProductsRealtimeUpdate(json: any){
    if (typeof json !== 'object'){return;}
    const all_objects = json.all_objects;
    
    if (all_objects instanceof Array){
        const allProducts = List<Product>().withMutations(list => {
            for (const product of all_objects){
                const converted = getProductFromJsonResponseObj_orNull(product);
                if (converted instanceof Product){
                    list.push(converted);
                }
            }
        });

        store.dispatch(updateAllProductsAction(allProducts));        
    }

    const changed_objects = json.changed_objects;

    if (changed_objects instanceof Array){
        
        for (const changed_object_item of changed_objects){
            const changed_object = changed_object_item.changed_object;
            switch (changed_object_item.change_type){
                case 'insert':
                case 'update':{
                    const product = getProductFromJsonResponseObj_orNull(changed_object);
                    product instanceof Product && store.dispatch(insertOrUpdateProductAction(product));
                    break;
                }
                case 'delete':{
                    const id = changed_object.id;
                    typeof id === 'number' && store.dispatch(deleteProductAction(id));
                    break;
                }
            }
        }

    }
}
