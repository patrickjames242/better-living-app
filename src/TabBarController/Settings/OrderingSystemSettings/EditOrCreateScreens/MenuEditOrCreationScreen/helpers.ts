
import { DayOfTheWeek } from "../../../../../api/orderingSystem/menus/Menu";
import { Set, Map } from "immutable";
import * as yup from 'yup';

export interface MenuEditOrCreateProductCategory{
    readonly customId: number;
    readonly title: string;
    readonly productIds: Set<number>;
}

export const menuEditOrCreateProductCategorySchema = yup.object({
    title: yup.string().trim().required('The title field is required.'),
});

export interface MenuEditOrCreationValues{
    title: string;
    isActive: boolean;
    daysOfTheWeek: Set<DayOfTheWeek>;
    startTime: string;
    endTime: string;
    productCategories: Map<number, MenuEditOrCreateProductCategory>;
}



