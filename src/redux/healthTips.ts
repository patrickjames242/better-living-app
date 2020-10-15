
import { CustomReduxAction } from "./helpers";
import { Map } from "immutable";
import HealthTip from "../api/healthTips/HealthTip";
import ActionStrings from "./actionStrings";



export type InsertHealthTipsAction = CustomReduxAction<{
    healthTips: HealthTip[],
}>;

export function insertHealthTipsAction(healthTips: HealthTip[]): InsertHealthTipsAction{
    return {
        type: ActionStrings.healthTips.INSERT_HEALTH_TIPS,
        healthTips,
    }
}





export type UpdateHealthTipAction = CustomReduxAction<{
    healthTip: HealthTip,
}>;

export function updateHealthTipAction(healthTip: HealthTip): UpdateHealthTipAction{
    return {
        type: ActionStrings.healthTips.UPDATE_HEALTH_TIP,
        healthTip: healthTip,
    }
}





export type DeleteHealthTipAction = CustomReduxAction<{
    healthTipID: number,
}>

export function deleteHealthTipAction(healthTipID: number): DeleteHealthTipAction{
    return {
        type: ActionStrings.healthTips.DELETE_HEALTH_TIP,
        healthTipID,
    }
}





export type HealthTipsActions = InsertHealthTipsAction | UpdateHealthTipAction | DeleteHealthTipAction;

export function healthTipsReducer(state = Map<number, HealthTip>(), action: HealthTipsActions){
    switch (action.type){
        case ActionStrings.healthTips.INSERT_HEALTH_TIPS:{
            const healthTips = (action as InsertHealthTipsAction).healthTips;
            return state.withMutations(map => {
                healthTips.forEach(tip => map.set(tip.id, tip));
            });
        }
        case ActionStrings.healthTips.UPDATE_HEALTH_TIP:{
            const healthTip = (action as UpdateHealthTipAction).healthTip;
            if (state.has(healthTip.id))
                return state.set(healthTip.id, healthTip);
            else return state;
        }
        case ActionStrings.healthTips.DELETE_HEALTH_TIP:{
            const id = (action as DeleteHealthTipAction).healthTipID;
            return state.remove(id);
        }
        default: return state;
    }
}


