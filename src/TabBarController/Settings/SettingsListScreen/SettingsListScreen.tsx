
import React, { useMemo } from 'react';
import GenericSettingsScreen, { GenericSettingsScreenSection, GenericSettingsScreenNavigationBarType } from '../GenericSettingsScreen/GenericSettingsScreen';
import SettingsListScreenHeader from './SettingsListScreenHeader';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../navigationHelpers';


const SettingsListScreen = (props: StackScreenProps<SettingsNavStackParams, 'SettingsList'>) => {

    const sections: GenericSettingsScreenSection[] = useMemo(() => {
        return [
            {
                title: null,
                data: [
                    {
                        title: 'Ordering System',
                        imageSource: require('./burger.png'),
                        onPress: () => props.navigation.push('OrderingSystemSettingsList'),
                    },
                    {
                        title: 'Notifications',
                        imageSource: require('./notification.png'),
                        onPress: () => {},
                    },
                ]
            }
        ]
    }, []);

    return <GenericSettingsScreen navBarTitle="Settings" sections={sections} navBarType={GenericSettingsScreenNavigationBarType.mainScreenLargeTitle} sectionListProps={{
        ListHeaderComponent: SettingsListScreenHeader,
    }}/>
}

    
export default SettingsListScreen;

