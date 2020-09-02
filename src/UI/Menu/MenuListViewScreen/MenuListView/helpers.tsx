


import { getNumbersList } from '../../../../helpers/general';



export interface MenuListSection{
    readonly id: number;
    readonly title: string;
    readonly data: MenuListItem[];
}

export interface MenuListItem{
    readonly id: number,
    readonly name: string;
    readonly priceInDollars: number;
    readonly imageSource: any;
}




let nextAvailableMenuListItemIndex = 0;

export function getRandomFoods(number: number): MenuListItem[]{
    return getNumbersList(0, number - 1).map(() => {
        const productIndex = Math.round(Math.random() * (allProducts.length - 1));
        return {...allProducts[productIndex], id: nextAvailableMenuListItemIndex++};
    });
}

const allProducts: Omit<MenuListItem, 'id'>[] = [
    {
        name: 'Veggie Macaroni',
        priceInDollars: 4,
        imageSource: require('./food-images/macaroni.jpg'),
    },
    {
        name: 'Lasagna',
        priceInDollars: 8,
        imageSource: require('./food-images/lasagna.jpg'),
    },
    {
        name: 'Pumpkin Soup',
        priceInDollars: 4,
        imageSource: require('./food-images/soup.jpg'),
    },
];



export const menuListSections: MenuListSection[] = (() => {
    const titles = [
        'Pasta',
        'Sandwiches',
        'Bread',
        'Soup',
        'Sides',
        'Rice',
    ];
    return titles.map((title, index) => {
        return {
            id: index,
            title,
            data: getRandomFoods(5),
        }
    });
})();

