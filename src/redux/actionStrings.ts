import { nestReduxActionStrings } from "./helpers";



const ActionStrings = nestReduxActionStrings({
    TabBarController:{
        CHANGE_CURRENT_SELECTION: 'CHANGE_CURRENT_SELECTION',
        CHANGE_TAB_BAR_POSITION: 'CHANGE_TAB_BAR_POSITION',
    },
});



export default ActionStrings;