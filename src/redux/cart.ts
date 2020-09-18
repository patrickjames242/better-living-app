

import { List, Map } from "immutable";
import { CartMealEntry } from "../api/cart/CartMealEntry";
import { CartProductEntry } from "../api/cart/CartProductEntry";
import { Optional } from "../helpers/general";
import ActionStrings from "./actionStrings";
import { LogOutAction } from "./authentication";
import { CustomReduxAction } from "./helpers";

export type CartEntry = CartProductEntry | CartMealEntry;




export type ReplaceCartEntriesAction = CustomReduxAction<{
    entries: List<CartEntry>;
}>;

export function updateEntireCartState(entries: List<CartEntry>): ReplaceCartEntriesAction {
    return {
        type: ActionStrings.cart.REPLACE_CART_ENTRIES,
        entries,
    }
}




export type InsertOrUpdateCartEntryAction = CustomReduxAction<{
    entry: CartEntry;
}>;

export function insertOrUpdateCartEntryAction(entry: CartEntry): InsertOrUpdateCartEntryAction {
    return {
        type: ActionStrings.cart.INSERT_OR_UPDATE_ENTRY,
        entry,
    }
}


export type IncrementCartEntryPendingQuantityChangeAction = CustomReduxAction<{
    entryId: string;
    incrementAmount: number;
}>;


export function incrementCartEntryPendingQuantityChangeAction(entryId: string, incrementAmount: number): IncrementCartEntryPendingQuantityChangeAction {
    return {
        type: ActionStrings.cart.INCREMENT_ENTRY_PENDING_QUANTITY_CHANGE,
        entryId,
        incrementAmount,
    }
}




export type DeleteCartEntryAction = CustomReduxAction<{
    entryId: string;
}>;

export function deleteCartEntryAction(entryId: string): DeleteCartEntryAction {
    return {
        type: ActionStrings.cart.DELETE_ENTRY,
        entryId,
    }
}




export type CartReduxActions = ReplaceCartEntriesAction | InsertOrUpdateCartEntryAction | IncrementCartEntryPendingQuantityChangeAction | DeleteCartEntryAction | LogOutAction;


export type CartEntriesMapValue = {
    readonly entry: CartEntry;
    readonly pendingQuantityChangesInfo: Optional<{
        readonly originalQuantity: number;
        readonly pendingChange: number;
    }>;
}

export type CartReduxState = Map<string, CartEntriesMapValue>;


export function cartReducer(state: CartReduxState = Map(), action: CartReduxActions): CartReduxState {

    const getUpdatedEntryMapValue = (newEntry: CartEntry) => {
        const x: CartEntriesMapValue = {
            entry: newEntry,
            pendingQuantityChangesInfo: state.get(newEntry.id)?.pendingQuantityChangesInfo ?? null,
        }
        return x;
    }

    switch (action.type) {
        case ActionStrings.authentication.LOG_OUT:
            return Map();
        case ActionStrings.cart.REPLACE_CART_ENTRIES: {
            const { entries } = action as ReplaceCartEntriesAction;
            return Map<string, CartEntriesMapValue>().withMutations(map => {
                entries.forEach(entry => {
                    map.set(entry.id, getUpdatedEntryMapValue(entry));
                })
            });
        }
        case ActionStrings.cart.INSERT_OR_UPDATE_ENTRY: {
            const { entry } = action as InsertOrUpdateCartEntryAction;
            return state.set(entry.id, getUpdatedEntryMapValue(entry));
        }
        case ActionStrings.cart.INCREMENT_ENTRY_PENDING_QUANTITY_CHANGE: {
            const { entryId, incrementAmount } = action as IncrementCartEntryPendingQuantityChangeAction;
            const oldEntry = state.get(entryId);   
            if (!oldEntry){return state;}
            return state.set(entryId, {
                ...oldEntry,
                pendingQuantityChangesInfo: (() => {
                    const newQuantityChangeAmount = (oldEntry.pendingQuantityChangesInfo?.pendingChange ?? 0) + incrementAmount;
                    return newQuantityChangeAmount === 0 ? null : {
                        originalQuantity: oldEntry.pendingQuantityChangesInfo?.originalQuantity ?? oldEntry.entry.quantity,
                        pendingChange: newQuantityChangeAmount,
                    }
                })()
            });
        }
        case ActionStrings.cart.DELETE_ENTRY: {
            const { entryId } = action as DeleteCartEntryAction;
            return state.remove(entryId);
        }
        default:
            return state;
    }
}

