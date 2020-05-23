import { MenuListItem, getRandomFoods } from "../MenuListViewScreen/MenuListView/helpers"


export interface MealCreatorSection {
    title: string,
    data: MenuListItem[],
}

export const listData: MealCreatorSection[] = [
    "Entré", "Starch Side", "Vegetable Side 1", "Vegetable Side 2"
].map(sectionName => {
    return {
        title: sectionName,
        data: getRandomFoods(4),
    }
})