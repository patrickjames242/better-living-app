
import React, { useMemo } from 'react';
import GenericSettingsScreen from '../GenericSettingsScreen/GenericSettingsScreen';
import { useUserProfileSettingsItems } from '../helpers';


const UserProfileSettingsScreen = () => {
    
    const userProfileInfoItems = useUserProfileSettingsItems();
    const sections = useMemo(() => {
        return [{
            title: null,
            data: userProfileInfoItems,
        }]
    }, [userProfileInfoItems]);

    return <GenericSettingsScreen navBarTitle="Edit Profile Info" sections={sections}/>
}

export default UserProfileSettingsScreen;
