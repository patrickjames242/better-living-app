
import { tabBarController_reducer } from "./tabBarController";
import {combineReducers, createStore } from 'redux';
import { 
    TypedUseSelectorHook, 
    useSelector as untypedUseSelector, 
    useStore as untypedUseStore, 
    useDispatch as untypedUseDispatch,
} from "react-redux";

const appReducer = combineReducers({
    tabBarController: tabBarController_reducer
});

export type AppState = ReturnType<typeof appReducer>;

const store = createStore(appReducer);
export default store;

export const useSelector: TypedUseSelectorHook<AppState> = untypedUseSelector;
export const useStore: () => typeof store = untypedUseStore;
export const useDispatch: () => typeof store.dispatch = untypedUseDispatch;

