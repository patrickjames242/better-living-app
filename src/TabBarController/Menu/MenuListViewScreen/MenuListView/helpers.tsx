


import { getNumbersList } from '../../../../helpers/general';



export interface MenuListSection{
    id: number;
    title: string;
    data: MenuListItem[];
}

export interface MenuListItem{
    id: number,
    name: string;
    priceInDollars: number;
    imageSource: any;
}

const products: MenuListItem[] = [
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
].map((item, index) => ({...item, id: index}));


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



function getRandomFoods(number: number): MenuListItem[]{
    return getNumbersList(0, number - 1).map(() => {
        const productIndex = Math.round(Math.random() * (products.length - 1));
        return products[productIndex];
    });
}


