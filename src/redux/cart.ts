

import { List, Map } from "immutable";
import { CartMealEntry } from "../api/cart/CartMealEntry";
import { CartProductEntry } from "../api/cart/CartProductEntry";
import ActionStrings from "./actionStrings";
import { LogOutAction } from "./authentication";
import { CustomReduxAction } from "./helpers";



export type ReplaceCartProductAndMealEntries = CustomReduxAction<{
    productEntries: List<CartProductEntry>;
    mealEntries: List<CartMealEntry>;
}>;

export function updateEntireCartState(productEntries: List<CartProductEntry>, mealEntries: List<CartMealEntry>): ReplaceCartProductAndMealEntries {
    return {
        type: ActionStrings.cart.REPLACE_CART_PRODUCT_AND_MEAL_ENTRIES,
        productEntries,
        mealEntries,
    }
}




export type InsertOrUpdateCartProductEntryAction = CustomReduxAction<{
    entry: CartProductEntry
}>;

export function insertOrUpdateCartProductEntryAction(entry: CartProductEntry): InsertOrUpdateCartProductEntryAction {
    return {
        type: ActionStrings.cart.INSERT_OR_UPDATE_PRODUCT_ENTRY,
        entry,
    }
}


export type IncrementCartProductEntryPendingQuantityChangeAction = CustomReduxAction<{
    entryId: string;
    incrementAmount: number;
}>;


export function incrementCartProductEntryPendingQuantityChangeAction(entryId: string, incrementAmount: number): IncrementCartProductEntryPendingQuantityChangeAction{
    return {
        type: ActionStrings.cart.INCREMENT_PRODUCT_ENTRY_PENDING_QUANTITY_CHANGE,
        entryId,
        incrementAmount,
    }
}



export type DeleteCartProductEntryAction = CustomReduxAction<{
    entryId: string;
}>;

export function deleteCartProductEntryAction(entryId: string): DeleteCartProductEntryAction {
    return {
        type: ActionStrings.cart.DELETE_PRODUCT_ENTRY,
        entryId,
    }
}




export type InsertOrUpdateCartMealEntryAction = CustomReduxAction<{
    entry: CartMealEntry;
}>;

export function insertOrUpdateCartMealEntryAction(entry: CartMealEntry): InsertOrUpdateCartMealEntryAction {
    return {
        type: ActionStrings.cart.INSERT_OR_UPDATE_MEAL_ENTRY,
        entry,
    }
}



export type IncrementCartMealEntryPendingQuantityChangeAction = CustomReduxAction<{
    incrementAmount: number;
    entryId: string;
}>;


export function incrementCartMealEntryPendingQuantityChangeAction(entryId: string, incrementAmount: number): IncrementCartMealEntryPendingQuantityChangeAction{
    return {
        type: ActionStrings.cart.INCREMENT_MEAL_ENTRY_PENDING_QUANTITY_CHANGE,
        incrementAmount,
        entryId,
    }
}




export type DeleteCartMealEntryAction = CustomReduxAction<{
    entryId: string;
}>;

export function deleteCartMealEntryAction(entryId: string): DeleteCartMealEntryAction {
    return {
        type: ActionStrings.cart.DELETE_MEAL_ENTRY,
        entryId,
    }
}


export type CartReduxActions = ReplaceCartProductAndMealEntries | InsertOrUpdateCartProductEntryAction | IncrementCartProductEntryPendingQuantityChangeAction | DeleteCartProductEntryAction | InsertOrUpdateCartMealEntryAction | IncrementCartMealEntryPendingQuantityChangeAction | DeleteCartMealEntryAction | LogOutAction;


export type CartReduxState = {
    readonly productEntries: {
        readonly entries: Map<string, CartProductEntry>,
        readonly pendingQuantityChanges: Map<string, number>,
    };
    readonly mealEntries: {
        readonly entries: Map<string, CartMealEntry>;
        readonly pendingQuantityChanges: Map<string, number>;
    };
};

const emptyCartReduxState: CartReduxState = {
    productEntries: {
        entries: Map(),
        pendingQuantityChanges: Map(),
    },
    mealEntries: {
        entries: Map(),
        pendingQuantityChanges: Map(),
    }
}

export function cartReducer(state: CartReduxState = emptyCartReduxState, action: CartReduxActions): CartReduxState {
    switch (action.type) {
        case ActionStrings.authentication.LOG_OUT:
            return emptyCartReduxState;
        case ActionStrings.cart.REPLACE_CART_PRODUCT_AND_MEAL_ENTRIES: {
            const { productEntries, mealEntries } = action as ReplaceCartProductAndMealEntries;
            return {
                productEntries: {
                    ...state.productEntries,
                    entries: Map<string, CartProductEntry>().withMutations(map => {
                        productEntries.forEach(x => {
                            map.set(x.id, x);
                        })
                    }),
                },
                mealEntries: {
                    ...state.mealEntries,
                    entries: Map<string, CartMealEntry>().withMutations(map => {
                        mealEntries.forEach(x => {
                            map.set(x.id, x);
                        })
                    }),
                }
            }
        }
        case ActionStrings.cart.INSERT_OR_UPDATE_PRODUCT_ENTRY: {
            const { entry } = action as InsertOrUpdateCartProductEntryAction;
            return {
                ...state,
                productEntries: {
                    ...state.productEntries,
                    entries: state.productEntries.entries.set(entry.id, entry)
                },
            }
        }
        case ActionStrings.cart.INCREMENT_PRODUCT_ENTRY_PENDING_QUANTITY_CHANGE: {
            const {entryId, incrementAmount} = action as IncrementCartProductEntryPendingQuantityChangeAction;
            return {
                ...state,
                productEntries: {
                    ...state.productEntries,
                    pendingQuantityChanges: state.productEntries.pendingQuantityChanges.set(entryId, (state.productEntries.pendingQuantityChanges.get(entryId) ?? 0) + incrementAmount),
                }
            }
        }
        case ActionStrings.cart.DELETE_PRODUCT_ENTRY: {
            const { entryId } = action as DeleteCartProductEntryAction;
            return {
                ...state,
                productEntries: {
                    ...state.productEntries,
                    entries: state.productEntries.entries.remove(entryId)
                },
            }
        }
        case ActionStrings.cart.INSERT_OR_UPDATE_MEAL_ENTRY: {
            const { entry } = action as InsertOrUpdateCartMealEntryAction;
            return {
                ...state,
                mealEntries: {
                    ...state.mealEntries,
                    entries: state.mealEntries.entries.set(entry.id, entry),
                },
            }
        }
        case ActionStrings.cart.INCREMENT_MEAL_ENTRY_PENDING_QUANTITY_CHANGE: {
            const {entryId, incrementAmount} = action as IncrementCartMealEntryPendingQuantityChangeAction;
            return {
                ...state,
                mealEntries: {
                    ...state.mealEntries,
                    pendingQuantityChanges: state.mealEntries.pendingQuantityChanges.set(entryId, (state.mealEntries.pendingQuantityChanges.get(entryId) ?? 0) + incrementAmount),
                }
            }
        }
        case ActionStrings.cart.DELETE_MEAL_ENTRY: {
            const { entryId } = action as DeleteCartMealEntryAction;
            return {
                ...state,
                mealEntries: {
                    ...state.mealEntries,
                    entries: state.mealEntries.entries.remove(entryId),
                },
            }
        }
        default:
            return state;
    }
}

