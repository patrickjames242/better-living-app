
import { MenuListItem, getRandomFoods } from "../MenuListViewScreen/MenuListView/helpers"



export interface MealCreatorSection {
    id: number,
    readonly title: string,
    readonly data: MenuListItem[],
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


