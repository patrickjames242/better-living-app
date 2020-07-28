import { CustomReduxAction } from "../helpers";
import { List, Map } from "immutable";
import Menu from "../../api/orderingSystem/menus/Menu";
import ActionStrings from "../actionStrings";



export type UpdateAllMenusAction = CustomReduxAction<{
    allMenus: List<Menu>
}>;

export function updateAllMenusAction(allMenus: List<Menu>): UpdateAllMenusAction{
    return {
        type: ActionStrings.orderingSystem.menus.UPDATE_ALL_MENUS,
        allMenus,
    }
}



export type InsertOrUpdateMenuAction = CustomReduxAction<{
    menu: Menu
}>;

export function insertOrUpdateMenuAction(menu: Menu): InsertOrUpdateMenuAction{
    return {
        type: ActionStrings.orderingSystem.menus.INSERT_OR_UPDATE_MENUS,
        menu: menu,
    }
}




export type DeleteMenuAction = CustomReduxAction<{
    menuId: number;
}>;

export function deleteMenuAction(menuId: number): DeleteMenuAction{
    return {
        type: ActionStrings.orderingSystem.menus.DELETE_MENU,
        menuId,
    }
}

export type MenuActions = UpdateAllMenusAction | InsertOrUpdateMenuAction | DeleteMenuAction



export function menusReducer(state = Map<number, Menu>(), action: MenuActions) {
    const strings = ActionStrings.orderingSystem.menus;

    switch (action.type){
        case strings.UPDATE_ALL_MENUS:{
            const allMenus = (action as UpdateAllMenusAction).allMenus;
            return Map(allMenus.map(x => [x.id, x]));
        }
        case strings.INSERT_OR_UPDATE_MENUS: {
            const menu = (action as InsertOrUpdateMenuAction).menu;
            return state.set(menu.id, menu);
        }
        case strings.DELETE_MENU: {
            const id = (action as DeleteMenuAction).menuId;
            return state.remove(id);
        }
        default: return state;
    }
}



