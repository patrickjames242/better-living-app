import { Optional } from "../../../helpers/general";
import { Set, List } from "immutable";
import { MenuJsonResponseObj, menuResponseObjValidator } from "./validation";
import getErrorObjFromApiObjValidateFunction from "../../helpers";

export enum DayOfTheWeek{
    sunday = 0,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
}

export interface MenuCategory{
    readonly title: string;
    readonly productIds: Set<number>;
}

export default class Menu{
    
    readonly id: number;
    readonly title: string;
    readonly daysOfTheWeek: Set<DayOfTheWeek>;
    readonly startTime: Optional<string>;
    readonly endTime: Optional<string>;
    readonly categories: List<MenuCategory>;

    constructor(menuJsonResponseObj: MenuJsonResponseObj){
        if (menuResponseObjValidator(menuJsonResponseObj) === false){
            throw getErrorObjFromApiObjValidateFunction(menuResponseObjValidator, 'Menu');
        }

        const json = menuJsonResponseObj;

        this.id = json.id;
        this.title = json.title;
        this.daysOfTheWeek = Set(menuJsonResponseObj.days_of_the_week);
        this.startTime = json.start_time;
        this.endTime = json.end_time;
        this.categories = List(json.categories.map<MenuCategory>(x => ({
            title: x.title,
            productIds: Set(x.product_ids),
        })));
        
    }
}


