
import { MenuListItem, getRandomFoods } from "../MenuListViewScreen/MenuListView/helpers"

export interface MealCreatorListItem extends MenuListItem{
    readonly isSelected?: boolean,
}

export interface MealCreatorSection {
    id: number,
    readonly title: string,
    readonly data: MealCreatorListItem[],
}

export const listData: MealCreatorSection[] = [
    "Entré", "Starch Side", "Vegetable Side 1", "Vegetable Side 2"
].map((sectionName, index) => {
    return {
        id: index,
        title: sectionName,
        data: getRandomFoods(4),
    }
});


