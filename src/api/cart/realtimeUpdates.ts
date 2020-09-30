import ajv from "ajv";
import { List } from "immutable";
import { CartEntry, deleteCartEntryAction, insertOrUpdateCartEntryAction, updateEntireCartState } from "../../redux/cart";
import store from "../../redux/store";
import { assertValidObjFromApi } from "../helpers";
import { CartMealEntry } from "./CartMealEntry";
import { CartProductEntry } from "./CartProductEntry";
import { CartMealEntryAPIResponseSchema, CartMealEntryJsonResponseObj, CartProductEntryAPIResponseSchema, CartProductEntryResponseObj } from "./validation";



enum ChangeModelType{
    product_entries = 'product_entries',
    meal_entries = 'meal_entries',
}

enum ChangeUpdateType{
    insert = 'insert',
    update = 'update',
    delete = 'delete',
}



const InitialObjectsSchema = {
    type: 'object',
    properties: {
        [ChangeModelType.product_entries]: {
            type: 'array',
            items: CartProductEntryAPIResponseSchema,
        },
        [ChangeModelType.meal_entries]: {
            type: 'array',
            items: CartMealEntryAPIResponseSchema,
        }
    },
    required: [
        'product_entries',
        'meal_entries',
    ]
}


interface AllObjects{
    [ChangeModelType.product_entries]: CartProductEntryResponseObj[];
    [ChangeModelType.meal_entries]: CartMealEntryJsonResponseObj[];
}


const initialObjectsValidator = (new ajv({allErrors: true})).compile(InitialObjectsSchema);


export function handleCartRealtimeUpdate(jsonData: any){
    if (jsonData == null || typeof jsonData !== 'object'){return;}

    const all_objects: AllObjects | undefined = jsonData.all_objects;

    if (all_objects != undefined){
        assertValidObjFromApi(initialObjectsValidator, 'Cart Initial Objects', all_objects);
        const entries = List<CartEntry>().withMutations(list => {
            all_objects.product_entries.forEach(x => list.push(CartProductEntry.parse(x)));
            all_objects.meal_entries.forEach(x => list.push(CartMealEntry.parse(x)));
        });
        store.dispatch(updateEntireCartState(entries));
    }

    const change_type: ChangeUpdateType | undefined = jsonData.change_type;
    const changed_object_type: ChangeModelType | undefined = jsonData.changed_object_type;
    const changed_object = jsonData.changed_object;

    switch (changed_object_type){
        case ChangeModelType.product_entries:
            switch (change_type){
                case ChangeUpdateType.insert:
                case ChangeUpdateType.update:
                    store.dispatch(insertOrUpdateCartEntryAction(CartProductEntry.parse(changed_object)))
                    break;
                case ChangeUpdateType.delete:
                    store.dispatch(deleteCartEntryAction(changed_object.id))
                    break;
            }
            break;
        case ChangeModelType.meal_entries:
            switch (change_type){
                case ChangeUpdateType.insert:
                case ChangeUpdateType.update:
                    store.dispatch(insertOrUpdateCartEntryAction(CartMealEntry.parse(changed_object)));
                    break;
                case ChangeUpdateType.delete:
                    store.dispatch(deleteCartEntryAction(changed_object.id))
                    break;
            }
            break;
    }
}




