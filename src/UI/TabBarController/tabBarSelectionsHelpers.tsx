

import { useMemo } from "react";
import { UserType } from "../../api/authentication/validation";
import { useSelector } from "../../redux/store";

export enum TabBarSelection {
    todaysOrders,
    menu,
    cart,
    tips,
    contactRequests,
    settings,
}

const allTabBarItemsData: {
    [index: number]: {
        url: any,
        requiresAuthentication: boolean,
    },
} = {
    [TabBarSelection.todaysOrders]: {
        url: require('../Cart/OrderConfirmationScreen/icons/hotel.png'),
        requiresAuthentication: true,
    },
    [TabBarSelection.menu]: {
        url: require('./icons/food.png'),
        requiresAuthentication: false,
    },
    [TabBarSelection.cart]: {
        url: require('./icons/shopping-cart.png'),
        requiresAuthentication: true,
    },
    [TabBarSelection.tips]: {
        url: require('./icons/tips.png'),
        requiresAuthentication: false,
    },
    [TabBarSelection.contactRequests]: {
        url: require('./icons/contact-requests.png'),
        requiresAuthentication: false,
    },
    [TabBarSelection.settings]: {
        url: require('./icons/settings.png'),
        requiresAuthentication: true,
    }
}



export function getInfoForTabBarSelection(selection: TabBarSelection){
    return allTabBarItemsData[selection];
}

const customerSelections = [
    TabBarSelection.menu,
    TabBarSelection.cart,
    TabBarSelection.tips,
    TabBarSelection.contactRequests,
    TabBarSelection.settings
];

const employeeAndManagerSelections = [
    TabBarSelection.todaysOrders,
    TabBarSelection.menu,
    TabBarSelection.cart,
    TabBarSelection.tips,
    TabBarSelection.settings
];

export function useDefaultTabBarSelectionForCurrentUser(){
    const userType = useSelector(state => state.authentication?.userObject.userType ?? UserType.customer);
    switch (userType){
        case UserType.customer:
            return TabBarSelection.menu;
        case UserType.employee:
        case UserType.manager:
            return TabBarSelection.todaysOrders;
    }
}

export function useTabBarSelectionsForCurrentUser(){
    const userType = useSelector(state => state.authentication?.userObject.userType ?? UserType.customer);
    const selections = useMemo(() => {
        switch (userType){
            case UserType.customer:
                return [...customerSelections];
            case UserType.employee:
            case UserType.manager:
                return [...employeeAndManagerSelections];
        }
    }, [userType]);
    return selections;
}



