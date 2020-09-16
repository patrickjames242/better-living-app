
import { fetchFromAPI, HttpMethod } from "../api";
import { v4 as uuidv4 } from 'uuid';
import { CartProductEntry } from "./CartProductEntry";
import moment from 'moment-timezone';
import store from "../../redux/store";
import { deleteCartMealEntryAction, deleteCartProductEntryAction, incrementCartMealEntryPendingQuantityChangeAction, incrementCartProductEntryPendingQuantityChangeAction, insertOrUpdateCartMealEntryAction, insertOrUpdateCartProductEntryAction } from "../../redux/cart";
import { CartMealEntryJsonResponseObj, CartProductEntryResponseObj } from "./validation";
import { batch } from "react-redux";
import { Optional } from "../../helpers/general";
import { List, Map } from "immutable";
import { CartMealEntry } from "./CartMealEntry";




const baseCartUrl = 'cart/';
const baseProductEntriesUrl = baseCartUrl + 'product-entries/';

export function addProductToCart(productId: number) {

    const placeholderProductEntry = new CartProductEntry(uuidv4(), productId, moment(), 1);
    store.dispatch(insertOrUpdateCartProductEntryAction(placeholderProductEntry));

    const removePlaceholderProductEntry = () => {
        store.dispatch(deleteCartProductEntryAction(placeholderProductEntry.id))
    }

    return fetchFromAPI<CartProductEntryResponseObj>({
        path: baseProductEntriesUrl + 'add/',
        method: HttpMethod.post,
        jsonBody: {
            product_id: productId,
        }
    }).then(result => {
        batch(() => {
            store.dispatch(insertOrUpdateCartProductEntryAction(CartProductEntry.parse(result)));
            removePlaceholderProductEntry();
        });
    }).catch(error => {
        removePlaceholderProductEntry();
        throw error;
    });

}


export const changeProductEntryQuantity = batchQuantityUpdates<CartProductEntry>((entryId: string) => ({
    incrementPendingQuantityChange: (incrementAmount: number) => {
        store.dispatch(incrementCartProductEntryPendingQuantityChangeAction(entryId, incrementAmount));
    },
    quantityChangeTask: async (quantityChange: number) => {
        const response = await fetchFromAPI<CartProductEntryResponseObj>({
            path: baseProductEntriesUrl + entryId + '/?quantity_change=' + quantityChange,
            method: HttpMethod.put,
        });
        const parsed = CartProductEntry.parse(response);
        return parsed;
    },
}));


export function removeProductFromCart(productEntryId: string) {
    const entryToDelete = store.getState().cart.productEntries.entries.get(productEntryId);
    return fetchFromAPI<null>({
        path: baseProductEntriesUrl + productEntryId + '/',
        method: HttpMethod.delete,
    }).catch(error => {
        if (entryToDelete) {
            store.dispatch(insertOrUpdateCartProductEntryAction(entryToDelete));
        }
        throw error;
    })
}







const baseMealEntriesUrl = baseCartUrl + 'meal-entries/';

export function addMealEntryToCart(info: {
    meal_id: number,
    choices: {
        chosen_product_id: number,
        meal_product_category_id: number,
    }[],
}){
    const placeholderMealEntry = new CartMealEntry(uuidv4(), moment(), 1, info.meal_id, List(info.choices.map(x => ({
        chosenProductId: x.chosen_product_id,
        mealProductCategoryId: x.meal_product_category_id,
    }))));
    const deletePlaceholderMealEntry = () => {
        store.dispatch(deleteCartMealEntryAction(placeholderMealEntry.id));
    }
    store.dispatch(insertOrUpdateCartMealEntryAction(placeholderMealEntry));
    return fetchFromAPI<CartMealEntryJsonResponseObj>({
        path: baseMealEntriesUrl + 'create/',
        method: HttpMethod.post,
        jsonBody: {
            ...info,
            quantity: 1,
        },
    }).then(response => {
        const parsedObject = CartMealEntry.parse(response);
        batch(() => {
            store.dispatch(insertOrUpdateCartMealEntryAction(parsedObject));
            deletePlaceholderMealEntry();
        });
        return parsedObject;
    }).catch(error => {
        deletePlaceholderMealEntry();
        throw error;
    });
}


export const changeMealEntryQuantity = batchQuantityUpdates<CartMealEntry>((entryId: string) => ({
    incrementPendingQuantityChange: (incrementAmount: number) => {
        store.dispatch(incrementCartMealEntryPendingQuantityChangeAction(entryId, incrementAmount));
    },
    quantityChangeTask: async (quantityChange: number) => {
        const response = await fetchFromAPI<CartMealEntryJsonResponseObj>({
            path: baseMealEntriesUrl + entryId + '/?quantity_change=' + quantityChange,
            method: HttpMethod.put,
        });
        const parsed = CartMealEntry.parse(response);
        return parsed;
    }
}));

export function removeMealFromCart(mealEntryId: string){
    const entryToDelete = store.getState().cart.mealEntries.entries.get(mealEntryId);
    return fetchFromAPI<null>({
        path: baseMealEntriesUrl + mealEntryId + '/',
        method: HttpMethod.delete,
    }).catch(error => {
        if (entryToDelete){
            store.dispatch(insertOrUpdateCartMealEntryAction(entryToDelete));
        }
        throw error;
    })
}








export enum IncrememntOrDecrement {
    increment,
    decrement,
}

interface BatchQuantityUpdatesHandlers<Result>{
    incrementPendingQuantityChange: (incrementAmount: number) => void;
    quantityChangeTask: (quantityChange: number) => Promise<Result>;
}


function batchQuantityUpdates<Result>(getHandlers: (entryId: string) => BatchQuantityUpdatesHandlers<Result>): 
(entryId: string, changeType: IncrememntOrDecrement) => Promise<Result>{

    let entryCacheInfo = Map<string, {
        cachedPromiseInfo: {
            promise: Promise<Result>,
            resolve: Optional<(result: Result) => void>,
            reject: Optional<(error: any) => void>;
        },
        timerId: Optional<number>,
        cachedQuantityChange: number,
    }>();

    const getInitialCacheInfo = () => {
        let resolve: Optional<(result: Result) => void> = null;
        let reject: Optional<(error: any) => void> = null;
        const promise = new Promise<Result>((_resolve, _reject) => {
            resolve = _resolve; reject = _reject;
        });
        return {
            cachedPromiseInfo: { promise, resolve, reject, },
            timerId: null,
            cachedQuantityChange: 0,
        }
    };

    return function (productEntryId: string, changeType: IncrememntOrDecrement) {

        const handlers = getHandlers(productEntryId);

        const currentCacheInfo = (() => {
            let x = entryCacheInfo.get(productEntryId);
            if (x) { return x }
            x = getInitialCacheInfo();
            entryCacheInfo = entryCacheInfo.set(productEntryId, x);
            return x;
        })();
        currentCacheInfo.timerId != null && clearTimeout(currentCacheInfo.timerId);
        
        const quantityChange = (() => {
            switch (changeType) {
                case IncrememntOrDecrement.increment: return 1;
                case IncrememntOrDecrement.decrement: return -1;
            }
        })();
        
        currentCacheInfo.cachedQuantityChange += quantityChange;

        handlers.incrementPendingQuantityChange(quantityChange);
        
        currentCacheInfo.timerId = setTimeout(() => {
            const getNewFetch: () => Promise<Result> = async () => {
                const quantityChangeToUse = currentCacheInfo.cachedQuantityChange;
                currentCacheInfo.cachedQuantityChange = 0;
                try{
                    const response = await handlers.quantityChangeTask(quantityChangeToUse);
                    if (currentCacheInfo.cachedQuantityChange !== 0) {
                        return getNewFetch();
                    }
                    return response;
                } finally {
                    handlers.incrementPendingQuantityChange(-quantityChangeToUse);
                }
            }
            getNewFetch().then(result => {
                currentCacheInfo.cachedPromiseInfo?.resolve?.(result);
            }).catch(error => {
                currentCacheInfo.cachedPromiseInfo?.reject?.(error);
            }).finally(() => {
                entryCacheInfo = entryCacheInfo.remove(productEntryId);
            });
        }, 1500);
        return currentCacheInfo.cachedPromiseInfo.promise;
    }
}

