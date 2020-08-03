
import Menu from "./Menu";
import { getMenuFromJsonResponseObj_orNull } from "./helpers";
import store from "../../../redux/store";
import { updateAllMenusAction, insertOrUpdateMenuAction, deleteMenuAction } from "../../../redux/orderingSystem/menus";
import { getOrderingSystemObjRealtimeUpdater } from "../helpers";



export const handleMenusRealtimeUpdate = getOrderingSystemObjRealtimeUpdater<Menu>({
    jsonObjConverter: getMenuFromJsonResponseObj_orNull,
    allObjectsStateUpdater: allMenus => store.dispatch(updateAllMenusAction(allMenus)),
    insertOrUpdateStateUpdater: menu => store.dispatch(insertOrUpdateMenuAction(menu)),
    deleteStateUpdater: id => store.dispatch(deleteMenuAction(id)),
});