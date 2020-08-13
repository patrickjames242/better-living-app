import { MenuJsonKeys } from "./validation";
import Menu, { DayOfTheWeek } from "./Menu";
import { fetchFromAPI, HttpMethod } from "../../api";
import store from "../../../redux/store";
import { insertOrUpdateMenuAction, deleteMenuAction } from "../../../redux/orderingSystem/menus";

const basePath = 'ordering-system/menus/';


export interface MenuRequestObj{
    [MenuJsonKeys.title]: string;
    [MenuJsonKeys.days_of_the_week]?: DayOfTheWeek;
    [MenuJsonKeys.start_time]?: string;
    [MenuJsonKeys.end_time]?: string;
    [MenuJsonKeys.categories]: {[categoryTitle: string]: {
        [MenuJsonKeys.Categories.product_ids]: number[],
    }};
}


export function createNewMenu(requestObj: MenuRequestObj){
    return fetchFromAPI({
        method: HttpMethod.post,
        path: basePath + 'create/',
        jsonBody: requestObj,
    }).then(response => {
        const menu = new Menu(response);
        store.dispatch(insertOrUpdateMenuAction(menu));
        return menu;
    });
}

export function updateMenu(menuId: number, requestObj: Partial<MenuRequestObj>){
    return fetchFromAPI({
        method: HttpMethod.post,
        path: basePath + menuId + '/',
        jsonBody: requestObj,
    }).then(response => {
        const menu = new Menu(response);
        store.dispatch(insertOrUpdateMenuAction(menu));
        return menu;
    });
}

export function deleteMenu(menuId: number){
    return fetchFromAPI({
        method: HttpMethod.delete,
        path: basePath + menuId + '/',
    }).then(() => {
        store.dispatch(deleteMenuAction(menuId));
    })
}



