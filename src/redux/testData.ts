
import { AppState } from "./store";
import { Map } from "immutable";
import HealthTip from "../api/healthTips/HealthTip";
import Product from "../api/orderingSystem/products/Product";
import ProductInfoTag from "../api/orderingSystem/productInfoTags/ProductInfoTag";
import Menu from "../api/orderingSystem/menus/Menu";
import Meal from "../api/orderingSystem/meals/Meal";
import MealCategory from "../api/orderingSystem/mealCategories/MealCategory";
import { getCurrentDefaultTabBarPosition, defaultTabBarSelection } from "./tabBarController";
import { defaultRealtimeUpdatesState } from "./realtimeUpdates";

const productInfoTags: [number, ProductInfoTag][] = [
    [1, new ProductInfoTag({
        id: 1,
        title: 'Low Sodium',
    })],
    [2, new ProductInfoTag({
        id: 2,
        title: 'Vegan',
    })],
    [3, new ProductInfoTag({
        id: 3,
        title: 'Gluten Free',
    })],
]

const products: [number, Product][] = [
    [1, new Product({
        id: 1,
        title: 'best product ever 1',
        description: 'aalksj asdfklj slaks blah blah blah',
        image_url: null,
        individual_price: null,
        should_be_sold_individually: true,
        info_tag_ids: [1, 2, 3],
    })],
    [2, new Product({
        id: 2,
        title: 'best product ever blah 2',
        description: 'aalksj asdfklj slaks blah blah blah',
        image_url: null,
        individual_price: null,
        should_be_sold_individually: true,
        info_tag_ids: [1, 2, 3],
    })],
    [3, new Product({
        id: 3,
        title: 'best product ever 3',
        description: 'aalksj asdfklj slaks blah blah blah',
        image_url: null,
        individual_price: null,
        should_be_sold_individually: true,
        info_tag_ids: [1, 2, 3],
    })],
];

const menus: [number, Menu][] = [
    [1, new Menu({
        id: 1, 
        title: 'best menu ever',
        days_of_the_week: [new Date(Date.now()).getDay()],
        start_time: '00:00:00',
        end_time: '23:59:59',
        categories: [
            {
                title: 'Breads',
                product_ids: [1, 2, 3],
            },
            {
                title: 'Soups',
                product_ids: [1, 2, 3],
            },
            {
                title: 'Entrés',
                product_ids: [1, 2, 3],
            },
            {
                title: 'Sides',
                product_ids: [1, 2, 3],
            },
        ]
    })],
];

const mealCategories: [number, MealCategory][] = [
    [1, new MealCategory({
        id: 1,
        display_name: null,
        unique_name: 'Vegetable Side',
        product_ids: [1, 2, 3]
    })],
    [2, new MealCategory({
        id: 2,
        display_name: null,
        unique_name: 'Entré',
        product_ids: [1, 2, 3]
    })],
    [3, new MealCategory({
        id: 3,
        display_name: null,
        unique_name: 'Starch Side',
        product_ids: [1, 2, 3]
    })]
]

const meals: [number, Meal][] = [
    [1, new Meal({
        id: 1,
        title: 'Large Plate',
        price: 11.55,
        product_categories: [
            {
                id: 1,
                order_num: 0,
            },
            {
                id: 2,
                order_num: 1,
            },
            {
                id: 3,
                order_num: 2,
            }
        ]
    })],
    [2, new Meal({
        id: 2,
        title: 'Small Plate',
        price: 5.55,
        product_categories: [
            {
                id: 1,
                order_num: 0,
            },
            {
                id: 2,
                order_num: 1,
            },
            {
                id: 3,
                order_num: 2,
            }
        ]
    })],
]

const testReduxState: AppState = {
    realtimeUpdates: defaultRealtimeUpdatesState,
    healthTips: Map<number, HealthTip>(),
    orderingSystem: {
        products: Map<number, Product>(products),
        productInfoTags: Map<number, ProductInfoTag>(productInfoTags),
        menus: Map<number, Menu>(menus),
        meals: Map<number, Meal>(meals),
        mealCategories: Map<number, MealCategory>(mealCategories),
    },
    tabBarController: {
        currentSelection: defaultTabBarSelection,
        tabBarPosition: getCurrentDefaultTabBarPosition(),
    }
}

export default testReduxState;


