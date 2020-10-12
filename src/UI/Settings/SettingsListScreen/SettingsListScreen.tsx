
import React, { useMemo } from 'react';
import GenericSettingsScreen, { GenericSettingsScreenSection, GenericSettingsScreenNavigationBarType } from '../GenericSettingsScreen/GenericSettingsScreen';
import SettingsListScreenHeader from './SettingsListScreenHeader';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../navigationHelpers';
import store, { useSelector } from '../../../redux/store';
import { logOutAction } from '../../../redux/authentication';
import { displayTwoDecisionAlert } from '../../../helpers/Alerts';
import { useUserProfileSettingsItems } from '../helpers';
import { UserType } from '../../../api/authentication/validation';


const SettingsListScreen = (props: StackScreenProps<SettingsNavStackParams, 'SettingsList'>) => {

    const authentication = useSelector(state => state.authentication);
    const isEmployeeOrManager = [UserType.employee, UserType.manager].includes((authentication?.userObject.userType ?? UserType.customer));
    const profileSettingsItems = useUserProfileSettingsItems();

    const sections: GenericSettingsScreenSection[] = useMemo(() => {
        if (authentication == null) { return []; }
        return [
            ...(isEmployeeOrManager ? [{
                title: "Ordering System",
                data: [
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
                                store.dispatch(logOutAction())
                            });
                        },
                    }
                ]
            }
        ]
    }, [authentication, isEmployeeOrManager, profileSettingsItems, props.navigation]);

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

