
import { nestReduxActionStrings } from "./helpers";


const ActionStrings = nestReduxActionStrings({
    TabBarController: {
        CHANGE_CURRENT_SELECTION: 'CHANGE_CURRENT_SELECTION',
        CHANGE_TAB_BAR_POSITION: 'CHANGE_TAB_BAR_POSITION',
    },
    healthTips: {
        UPDATE_ALL_HEALTH_TIPS: 'UPDATE_ALL_HEALTH_TIPS',
        INSERT_OR_UPDATE_HEALTH_TIP: 'INSERT_OR_UPDATE_HEALTH_TIP',
        DELETE_HEALTH_TIP: 'DELETE_HEALTH_TIP',
    }
});



export default ActionStrings;

