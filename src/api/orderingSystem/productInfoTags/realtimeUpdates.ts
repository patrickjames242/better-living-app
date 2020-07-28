import ProductInfoTag from "./ProductInfoTag";
import { List } from "immutable";
import { getProductInfoTagFromJsonResponseObj_orNull } from "./helpers";
import store from "../../../redux/store";
import { updateAllProductInfoTagsAction, insertOrUpdateProductInfoTagAction, deleteProductInfoTagAction } from "../../../redux/orderingSystem/productInfoTags";


export function handleProductInfoTagsRealtimeUpdate(json: any){
    if (typeof json !== 'object'){return;}

    const allObjects = json.all_objects;

    if (allObjects instanceof Array){
        const allProductInfoTags = List<ProductInfoTag>().withMutations(list => {
            for (const productInfoTag of allObjects){
                const converted = getProductInfoTagFromJsonResponseObj_orNull(productInfoTag);
                if (converted instanceof ProductInfoTag){
                    list.push(converted);
                } 
            }
        });
        store.dispatch(updateAllProductInfoTagsAction(allProductInfoTags));
    }

    const changedObjects = json.changed_objects;

    if (changedObjects instanceof Array){
        for (const changedObjectItem of changedObjects){
            const changedObject = changedObjectItem.changed_object;
            switch (changedObjectItem.change_type){
                case 'insert':
                case 'update':{
                    const infoTag = getProductInfoTagFromJsonResponseObj_orNull(changedObject);
                    infoTag instanceof ProductInfoTag && store.dispatch(insertOrUpdateProductInfoTagAction(infoTag));
                    break;
                }
                case 'delete':{
                    const id = changedObject.id;
                    typeof id === 'number' && store.dispatch(deleteProductInfoTagAction(id));
                    break;
                }
            }
        }
    }

}