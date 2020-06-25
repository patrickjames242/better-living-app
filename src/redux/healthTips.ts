import { CustomReduxAction } from "./helpers";
import { List, Map } from "immutable";
import HealthTip from "../api/healthTips/HealthTip";
import ActionStrings from "./actionStrings";



export type UpdateAllHealthTipsAction = CustomReduxAction<{
    allHealthTips: List<HealthTip>,
}>;

export function updateAllHealthTips(allHealthTips: List<HealthTip>): UpdateAllHealthTipsAction{
    return {
        type: ActionStrings.healthTips.UPDATE_ALL_HEALTH_TIPS,
        allHealthTips,
    }
}





export type InsertOrUpdateHealthTipAction = CustomReduxAction<{
    healthTip: HealthTip,
}>;

export function insertOrUpdateHealthTip(healthTip: HealthTip): InsertOrUpdateHealthTipAction{
    return {
        type: ActionStrings.healthTips.INSERT_OR_UPDATE_HEALTH_TIP,
        healthTip: healthTip,
    }
}





export type DeleteHealthTipAction = CustomReduxAction<{
    healthTipID: number,
}>

export function deleteHealthTip(healthTipID: number): DeleteHealthTipAction{
    return {
        type: ActionStrings.healthTips.DELETE_HEALTH_TIP,
        healthTipID,
    }
}





export type HealthTipsActions = UpdateAllHealthTipsAction | InsertOrUpdateHealthTipAction | DeleteHealthTipAction;

export function healthTipsReducer(state = Map<number, HealthTip>(), action: HealthTipsActions){
    switch (action.type){
        case ActionStrings.healthTips.UPDATE_ALL_HEALTH_TIPS:{
            const allHealthTips = (action as UpdateAllHealthTipsAction).allHealthTips;
            return Map(allHealthTips.map(x => [x.id, x]))
        }
        case ActionStrings.healthTips.INSERT_OR_UPDATE_HEALTH_TIP:{
            const healthTip = (action as InsertOrUpdateHealthTipAction).healthTip;
            return state.set(healthTip.id, healthTip);
        }
        case ActionStrings.healthTips.DELETE_HEALTH_TIP:{
            const id = (action as DeleteHealthTipAction).healthTipID;
            return state.remove(id);
        }
        default: return state;
    }
}


