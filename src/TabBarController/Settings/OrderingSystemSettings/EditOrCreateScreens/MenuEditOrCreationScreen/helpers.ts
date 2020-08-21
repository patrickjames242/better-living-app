
import { DayOfTheWeek } from "../../../../../api/orderingSystem/menus/Menu";
import { List, Set } from "immutable";

export interface MenuEditOrCreationValues{
    title: string;
    isActive: boolean;
    daysOfTheWeek: Set<DayOfTheWeek>;
    startTime: string;
    endTime: string;
    productCategories: List<{title: string, productIds: Set<number>}>;
}

