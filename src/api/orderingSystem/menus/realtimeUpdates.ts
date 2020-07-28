
import { List } from "immutable";
import Menu from "./Menu";
import { getMenuFromJsonResponseObj_orNull } from "./helpers";
import store from "../../../redux/store";
import { updateAllMenusAction, insertOrUpdateMenuAction, deleteMenuAction } from "../../../redux/orderingSystem/menus";



export function handleMenusRealtimeUpdate(json: any){
    if (typeof json !== 'object'){return;}

    const allObjects = json.all_objects;

    if (allObjects instanceof Array){
        const allMenus = List<Menu>().withMutations(list => {
            for (const menu of allObjects){
                const converted = getMenuFromJsonResponseObj_orNull(menu);
                converted instanceof Menu && list.push(converted);
            }
        });
        store.dispatch(updateAllMenusAction(allMenus));
    }

    const changedObjects = json.changed_objects;

    if (changedObjects instanceof Array){
        for (const changedObjectItem of changedObjects){
            const changedObject = changedObjectItem.changed_object;
            switch (changedObjectItem.change_type){
                case 'insert':
                case 'update':{
                    const menu = getMenuFromJsonResponseObj_orNull(changedObject);
                    menu && store.dispatch(insertOrUpdateMenuAction(menu));
                    break;
                }
                case 'delete':{
                    const id = changedObject.id;
                    typeof id === 'number' && store.dispatch(deleteMenuAction(id));
                    break;
                }
            }
        }
    }
}

