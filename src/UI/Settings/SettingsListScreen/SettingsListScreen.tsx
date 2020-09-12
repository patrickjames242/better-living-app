
import React, { useMemo } from 'react';
import GenericSettingsScreen, { GenericSettingsScreenSection, GenericSettingsScreenNavigationBarType } from '../GenericSettingsScreen/GenericSettingsScreen';
import SettingsListScreenHeader from './SettingsListScreenHeader';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../navigationHelpers';
import store, { useSelector } from '../../../redux/store';
import { logOutAction } from '../../../redux/authentication';
import { displayTwoDecisionAlert } from '../../../helpers/Alerts';
import { useTabBarControllerNavigation } from '../../TabBarController/helpers';
import { VerifyPasswordPurpose } from '../../LogInSignUpUI/helpers';


const SettingsListScreen = (props: StackScreenProps<SettingsNavStackParams, 'SettingsList'>) => {

    const authentication = useSelector(state => state.authentication);

    const tabBarControllerNavigation = useTabBarControllerNavigation();

    const sections: GenericSettingsScreenSection[] = useMemo(() => {
        if (authentication == null) { return []; }
        return [
            {
                title: 'Profile Info',
                data: [
                    {
                        title: 'Email',
                        imageSource: require('./email.png'),
                        rightSubtitleText: authentication.userObject.email,
                        onPress: () => {
                            tabBarControllerNavigation.navigate('LogInSignUpUI', {
                                initialScreen: 'VerifyPassword',
                                initialScreenParams: {
                                    purpose: VerifyPasswordPurpose.other,
                                    onPasswordVerified: (password) => {
                                        props.navigation.push('EmailEditing', { password })
                                    }
                                }
                            })
                        },
                    },
                    {
                        title: 'Name',
                        rightSubtitleText: authentication.userObject.getFullName(),
                        imageSource: require('./name.png'),
                        onPress: () => { props.navigation.push('NameEditing') },
                    },
                    {
                        title: 'Phone Number',
                        rightSubtitleText: authentication.userObject.phoneNumber,
                        imageSource: require('./phone.png'),
                        onPress: () => { props.navigation.push('PhoneNumberEditing') },
                    },
                    {
                        title: 'Change Password',
                        imageSource: require('./password.png'),
                        onPress: () => {
                            tabBarControllerNavigation.navigate('LogInSignUpUI', {
                                initialScreen: 'VerifyPassword',
                                initialScreenParams: {
                                    purpose: VerifyPasswordPurpose.forPasswordChange,
                                    onPasswordVerified: (password) => {
                                        props.navigation.push('ChangePassword', { currentPassword: password })
                                    }
                                }
                            })
                        },
                    },
                ]
            },
            {
                title: "General",
                data: [
                    {
                        title: 'Ordering System',
                        imageSource: require('./burger.png'),
                        onPress: () => props.navigation.push('OrderingSystemSettingsList'),
                    },
                    {
                        title: 'Notifications',
                        imageSource: require('./notification.png'),
                        onPress: () => { },
                    },
                    {
                        title: 'Log Out',
                        imageSource: require('./logout.png'),
                        onPress: () => {
                            displayTwoDecisionAlert('Are you sure?', 'Are you sure you want to log out?', 'Log Out', () => {
                                store.dispatch(logOutAction())
                            });
                        },
                    }
                ]
            }
        ]
    }, [authentication, props.navigation, tabBarControllerNavigation]);

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

