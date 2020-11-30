

import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMemo } from "react";
import { updateGlobalSettings } from "../../api/globalSettings/requests";
import { displayErrorMessage } from "../../helpers/Alerts";
import { useSelector } from "../../redux/store";
import { VerifyPasswordPurpose } from "../LogInSignUpUI/helpers";
import { useTabBarControllerNavigation } from "../TabBarController/helpers";
import { GenericSettingsScreenSection } from "./GenericSettingsScreen/GenericSettingsScreen";
import { SettingsItemViewProps } from "./GenericSettingsScreen/SettingsItemView";
import { SettingsNavStackParams } from "./navigationHelpers";

export const useAllowOrderingSwitchSettingsItem: () => SettingsItemViewProps = () => {

    const isOrderingAllowed = useSelector(state => state.globalSettings.isOrderingSystemEnabled);

    return {
        title: 'Allow Ordering',
        imageSource: require('./icons/light-switch.png'),
        rightSwitchInfo: {
            isOnValue: isOrderingAllowed,
            onValueChange: (isOn: boolean) => {
                return updateGlobalSettings({
                    is_ordering_system_enabled: isOn,
                }).catch(error => {
                    displayErrorMessage(error.message);
                });
            },
        }
    }
    
}

export function useUserProfileSettingsItems() {

    const authentication = useSelector(state => state.authentication);
    const tabBarControllerNavigation = useTabBarControllerNavigation();
    const navigation = useNavigation<StackNavigationProp<SettingsNavStackParams>>();

    const items: GenericSettingsScreenSection['data'] = useMemo(() => {
        if (authentication == null) { return []; }
        return [
            {
                title: 'Email',
                imageSource: require('./icons/email.png'),
                rightSubtitleText: authentication.userObject.email,
                onPress: () => {
                    tabBarControllerNavigation.navigate('LogInSignUpUI', {
                        initialScreen: 'VerifyPassword',
                        initialScreenParams: {
                            purpose: VerifyPasswordPurpose.other,
                            onPasswordVerified: (password) => {
                                navigation.push('EmailEditing', { password })
                            }
                        }
                    })
                },
            },
            {
                title: 'Name',
                rightSubtitleText: authentication.userObject.getFullName(),
                imageSource: require('./icons/name.png'),
                onPress: () => { navigation.push('NameEditing') },
            },
            {
                title: 'Phone Number',
                rightSubtitleText: authentication.userObject.phoneNumber,
                imageSource: require('./icons/phone.png'),
                onPress: () => { navigation.push('PhoneNumberEditing') },
            },
            {
                title: 'Change Password',
                imageSource: require('./icons/password.png'),
                onPress: () => {
                    tabBarControllerNavigation.navigate('LogInSignUpUI', {
                        initialScreen: 'VerifyPassword',
                        initialScreenParams: {
                            purpose: VerifyPasswordPurpose.forPasswordChange,
                            onPasswordVerified: (password) => {
                                navigation.push('ChangePassword', { currentPassword: password })
                            }
                        }
                    });
                },
            },
        ]
    }, [authentication, navigation, tabBarControllerNavigation]);

    return items;
}



