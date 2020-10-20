
import React, { useMemo } from 'react';
import { updateGlobalSettings } from '../../../api/globalSettings/requests';
import { displayErrorMessage } from '../../../helpers/Alerts';
import { useSelector } from '../../../redux/store';
import GenericSettingsScreen, { GenericSettingsScreenSection } from '../GenericSettingsScreen/GenericSettingsScreen';



    
const AllowOrderingSwitchScreen = () => {

    const isOrderingAllowed = useSelector(state => state.globalSettings.isOrderingSystemEnabled);

    const sections: GenericSettingsScreenSection[] = useMemo(() => {
        return [{
            title: null,
            data: [
                {
                    title: 'Allow Ordering',
                    imageSource: require('../icons/light-switch.png'),
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
            ]
        }]
    }, [isOrderingAllowed]);

    return <GenericSettingsScreen navBarTitle="Allow Ordering" sections={sections}/>
}


export default AllowOrderingSwitchScreen;
