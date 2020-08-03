
import { tabBarController_reducer } from "./tabBarController";
import {combineReducers, createStore } from 'redux';
import { 
    TypedUseSelectorHook, 
    useSelector as untypedUseSelector, 
    useStore as untypedUseStore, 
    useDispatch as untypedUseDispatch,
} from "react-redux";
import { healthTipsReducer } from "./healthTips";
import { productsReducer } from "./orderingSystem/products";
import { productInfoTagsReducer } from "./orderingSystem/productInfoTags";
import { menusReducer } from "./orderingSystem/menus";
import testReduxState from "./testData";
import AppSettings from "../settings";
import { mealsReducer } from "./orderingSystem/meals";
import { mealCategoriesReducer } from "./orderingSystem/mealCategories";

const appReducer = combineReducers({
    tabBarController: tabBarController_reducer,
    healthTips: healthTipsReducer,
    orderingSystem: combineReducers({
        products: productsReducer,
        productInfoTags: productInfoTagsReducer,
        menus: menusReducer,
        meals: mealsReducer,
        mealCategories: mealCategoriesReducer,
    }),
});

export type AppState = ReturnType<typeof appReducer>;

const store = (() => {
    if (AppSettings.useTestDatabaseData){
        return createStore(appReducer, testReduxState);
    } else {
        return createStore(appReducer);
    }
})();

export default store;

export const useSelector: TypedUseSelectorHook<AppState> = untypedUseSelector;
export const useStore: () => typeof store = untypedUseStore;
export const useDispatch: () => typeof store.dispatch = untypedUseDispatch;


export function addSelectedStateListener<SelectedType>(
    selector: (state: AppState) => SelectedType, 
    action: (newValue: SelectedType) => void
){
    let previousValue = selector(store.getState());

    return store.subscribe(() => {
        const newValue = selector(store.getState());
        if (newValue !== previousValue){
            previousValue = newValue;
            action(newValue);
        }
    });

}

