
import React, { useEffect, useMemo } from 'react';
import GenericSettingsScreen, { GenericSettingsScreenSection, GenericSettingsScreenNavigationBarType } from '../GenericSettingsScreen/GenericSettingsScreen';
import SettingsListScreenHeader from './SettingsListScreenHeader';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../navigationHelpers';
import store, { useSelector } from '../../../redux/store';
import { logOutAction } from '../../../redux/authentication';
import { displayTwoDecisionAlert } from '../../../helpers/Alerts';
import { useUserProfileSettingsItems } from '../helpers';
import { UserType } from '../../../api/authentication/validation';
import { shouldPopTabBarControllerChildToTop, useTabBarControllerChildRootScreenPopToTopFunctionality } from '../../TabBarController/helpers';
import { TabBarSelection } from '../../TabBarController/tabBarSelectionsHelpers';


const SettingsListScreen = (props: StackScreenProps<SettingsNavStackParams, 'SettingsList'>) => {

    const authentication = useSelector(state => state.authentication);
    const isEmployeeOrManager = [UserType.employee, UserType.manager].includes((authentication?.userObject.userType ?? UserType.customer));
    const profileSettingsItems = useUserProfileSettingsItems();

    const isOrderingSystemEnabled = useSelector(state => state.globalSettings.isOrderingSystemEnabled);

    useTabBarControllerChildRootScreenPopToTopFunctionality(TabBarSelection.settings, props);

    const sections: GenericSettingsScreenSection[] = useMemo(() => {
        if (authentication == null) { return []; }
        return [
            ...(isEmployeeOrManager ? [{
                title: "Ordering System",
                data: [
                    {
                        title: 'Allow Ordering',
                        imageSource: require('../icons/light-switch.png'),
                        rightSubtitleText: (() => {
                            if (isOrderingSystemEnabled === true) return 'On';
                            else if (isOrderingSystemEnabled === false) return 'Off';
                            else return undefined;
                        })(),
                        onPress: () => {
                            props.navigation.push('AllowOrderingSwitch');
                        },
                    },
                    {
                        title: 'Food Products',
                        imageSource: require('../icons/products.png'),
                        onPress: () => {props.navigation.push('ProductsList')},
                    },
                    {
                        title: 'Menus',
                        imageSource: require('../icons/menus.png'),
                        onPress: () => {props.navigation.push('MenusList')},
                    },
                    {
                        title: 'Meals',
                        imageSource: require('../icons/meals.png'),
                        onPress: () => {props.navigation.push('MealsList')},
                    },
                    {
                        title: 'Meal Categories',
                        imageSource: require('../icons/mealCategories.png'),
                        onPress: () => {props.navigation.push('MealCategoriesList')},
                    },
                    {
                        title: 'Orders History',
                        imageSource: require('../icons/history-book.png'),
                        onPress: () => {props.navigation.push('OrdersHistory')},
                    },
                ]
            }] : []),
            ...((isEmployeeOrManager === false) ? [{
                title: 'Profile Info',
                data: profileSettingsItems,
            }] : []),
            {
                title: "General",
                data: [
                    ...(isEmployeeOrManager ? [{
                        title: 'Edit Profile Info',
                        imageSource: require('../icons/edit-user.png'),
                        onPress: () => { 
                            props.navigation.push('UserProfileSettings');
                        },
                    }] : []),
                    {
                        title: 'My Orders',
                        imageSource: require('../icons/burger.png'),
                        onPress: () => {
                            props.navigation.push('MyOrders');
                        },
                    },
                    {
                        title: 'Log Out',
                        imageSource: require('../icons/logout.png'),
                        onPress: () => {
                            displayTwoDecisionAlert('Are you sure?', 'Are you sure you want to log out?', 'Log Out', () => {
                                store.dispatch(logOutAction());
                            });
                        },
                    }
                ]
            }
        ]
    }, [authentication, isEmployeeOrManager, isOrderingSystemEnabled, profileSettingsItems, props.navigation]);

    if (authentication == null) {
        return <></>;
    } else {
        return <GenericSettingsScreen
            navBarTitle="Settings"
            sections={sections}
            navBarType={GenericSettingsScreenNavigationBarType.mainScreenLargeTitle}
            sectionListProps={{
                ListHeaderComponent: authentication ? () => <SettingsListScreenHeader
                    userObject={authentication.userObject}
                /> : undefined,
            }}
        />
    }
}


export default SettingsListScreen;

