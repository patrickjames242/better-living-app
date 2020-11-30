import React, { useMemo } from 'react';
import GenericSettingsScreen, { GenericSettingsScreenSection } from '../GenericSettingsScreen/GenericSettingsScreen';
import { useAllowOrderingSwitchSettingsItem } from '../helpers';



const OrderingSystemMoreSettingsScreen = () => {
    const allowOrderingSwitchSettingsItem = useAllowOrderingSwitchSettingsItem();

    const sections: GenericSettingsScreenSection[] = useMemo(() => {
        return [{
            title: null,
            data: [
                allowOrderingSwitchSettingsItem,
            ]
        }]
    }, [allowOrderingSwitchSettingsItem]);
    return <GenericSettingsScreen
        navBarTitle="More"
        sections={sections}
    />
}


export default OrderingSystemMoreSettingsScreen;
