
import { nestReduxActionStrings } from "./helpers";


const ActionStrings = nestReduxActionStrings({
    realtimeUpdates: {
        UPDATE_CONNECTION_STATE: 'UPDATE_CONNECTION_STATE',
    },
    TabBarController: {
        CHANGE_CURRENT_SELECTION: 'CHANGE_CURRENT_SELECTION',
        CHANGE_TAB_BAR_POSITION: 'CHANGE_TAB_BAR_POSITION',
    },
    healthTips: {
        INSERT_HEALTH_TIPS: 'INSERT_HEALTH_TIPS',
        UPDATE_HEALTH_TIP: 'UPDATE_HEALTH_TIP',
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
        },
        meals: {
            UPDATE_ALL_MEALS: 'UPDATE_ALL_MEALS',
            INSERT_OR_UPDATE_MEAL: 'INSERT_OR_UPDATE_MEAL',
            DELETE_MEAL: 'DELETE_MEAL',
        },
        mealCategories: {
            UPDATE_ALL_MEAL_CATEGORIES: 'UPDATE_ALL_MEAL_CATEGORIES',
            INSERT_OR_UPDATE_MEAL_CATEGORY: 'INSERT_OR_UPDATE_MEAL_CATEGORY',
            DELETE_MEAL_CATEGORY: 'DELETE_MEAL_CATEGORY',
        }
    },
    cart: {
        REPLACE_CART_ENTRIES: 'REPLACE_CART_ENTRIES',
        INSERT_OR_UPDATE_ENTRY: 'INSERT_OR_UPDATE_ENTRY',
        INCREMENT_ENTRY_PENDING_QUANTITY_CHANGE: 'INCREMENT_ENTRY_PENDING_QUANTITY_CHANGE',
        DELETE_ENTRY: 'DELETE_ENTRY',
    },
    authentication: {
        SET_AUTH_STATE: 'SET_AUTH_STATE',
        LOG_IN_OR_SIGN_UP: 'LOG_IN_OR_SIGN_UP',
        UPDATE_USER_OBJECT: 'UPDATE_USER_OBJECT',
        LOG_OUT: 'LOG_OUT',
    },
    todaysOrders: {
        UPDATE_ALL_ORDERS: 'UPDATE_ALL_ORDERS',
        INSERT_OR_UPDATE_ORDER: 'INERT_OR_UPDATE_ORDER',
    },
    globalSettings: {
        UPDATE_GLOBAL_SETTINGS: 'UPDATE_GLOBAL_SETTINGS',
    }
});


export default ActionStrings;

