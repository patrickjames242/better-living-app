import { TabBarSelection } from "../TabBarController/TabBar/helpers";
import { CustomReduxAction } from "./helpers";
import { combineReducers } from "redux";
import ActionStrings from "./actionStrings";
import { TabBarPosition, calculateCurrentDesiredTabBarPosition } from "../TabBarController/helpers";






export type ChangeCurrentSelectionAction = CustomReduxAction<{
    newSelection: TabBarSelection,
}>

export function changeCurrentSelection(newSelection: TabBarSelection): ChangeCurrentSelectionAction {
    return {
        type: ActionStrings.TabBarController.CHANGE_CURRENT_SELECTION,
        newSelection,
    }
}

function currentSelectionReducer(state = TabBarSelection.cart, action: ChangeCurrentSelectionAction) {
    switch (action.type) {
        case ActionStrings.TabBarController.CHANGE_CURRENT_SELECTION:
            return action.newSelection;
        default: return state;
    }
}







export type ChangeTabBarPositionAction = CustomReduxAction<{
    newPosition: TabBarPosition,
}>;

export function changeTabBarPosition(newPosition: TabBarPosition): ChangeTabBarPositionAction{
    return {
        type: ActionStrings.TabBarController.CHANGE_TAB_BAR_POSITION,
        newPosition,
    }
}

function tabBarPositionReducer(state = calculateCurrentDesiredTabBarPosition(), action: ChangeTabBarPositionAction){
    switch (action.type){
        case ActionStrings.TabBarController.CHANGE_TAB_BAR_POSITION:
            return action.newPosition;
        default: return state;
    }
}







export const tabBarController_reducer = combineReducers({
    currentSelection: currentSelectionReducer,
    tabBarPosition: tabBarPositionReducer,
});

