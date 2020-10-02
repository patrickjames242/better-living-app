

import { CustomReduxAction } from "./helpers";
import { combineReducers } from "redux";
import ActionStrings from "./actionStrings";
import { TabBarPosition, calculateCurrentDesiredTabBarPosition } from "../UI/TabBarController/helpers";





export type ChangeTabBarPositionAction = CustomReduxAction<{
    newPosition: TabBarPosition,
}>;

export function changeTabBarPosition(newPosition: TabBarPosition): ChangeTabBarPositionAction{
    return {
        type: ActionStrings.TabBarController.CHANGE_TAB_BAR_POSITION,
        newPosition,
    }
}

export const getCurrentDefaultTabBarPosition = () => calculateCurrentDesiredTabBarPosition();

function tabBarPositionReducer(state = getCurrentDefaultTabBarPosition(), action: ChangeTabBarPositionAction){
    switch (action.type){
        case ActionStrings.TabBarController.CHANGE_TAB_BAR_POSITION:
            return action.newPosition;
        default: return state;
    }
}







export const tabBarController_reducer = combineReducers({
    tabBarPosition: tabBarPositionReducer,
});

