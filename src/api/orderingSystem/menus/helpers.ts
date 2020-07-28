import { MenuJsonResponseObj } from "./validation";
import Menu from "./Menu";


export function getMenuFromJsonResponseObj_orNull(apiResponseObj: MenuJsonResponseObj){
    try{
        return new Menu(apiResponseObj);
    } catch (error){
        console.error('A menu could not be converted from json because of the following error ->', error, apiResponseObj);
        return null;
    }
}

