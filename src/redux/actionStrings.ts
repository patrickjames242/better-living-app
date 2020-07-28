
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
    },
    orderingSystem: {
        products: {
            UPDATE_ALL_PRODUCTS: 'UPDATE_ALL_PRODUCTS',
            INSERT_OR_UPDATE_PRODUCT: 'INSERT_OR_UPDATE_PRODUCT',
            DELETE_PRODUCT: 'DELETE_PRODUCT',
        },
        productInfoTags: {
            UPDATE_ALL_INFO_TAGS: 'UPDATE_ALL_INFO_TAGS',
            INSERT_OR_UPDATE_INFO_TAGS: 'INSERT_OR_UPDATE_INFO_TAGS',
            DELETE_INFO_TAG: 'DELETE_INFO_TAG',
        },
        menus: {
            UPDATE_ALL_MENUS: 'UPDATE_ALL_MENUS',
            INSERT_OR_UPDATE_MENUS: 'INSERT_OR_UPDATE_MENUS',
            DELETE_MENU: 'DELETE_MENU',
        }
    }
});


export default ActionStrings;

