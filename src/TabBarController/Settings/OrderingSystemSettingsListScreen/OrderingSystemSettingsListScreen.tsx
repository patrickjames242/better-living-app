

import React, { useMemo } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../navigationHelpers';
import GenericSettingsScreen, { GenericSettingsScreenSection } from '../GenericSettingsScreen/GenericSettingsScreen';



const OrderingSystemSettingsListScreen = (props: StackScreenProps<SettingsNavStackParams, 'OrderingSystemSettingsList'>) => {

    const sections: GenericSettingsScreenSection[] = useMemo(() => {
        return [
            {
                title: null,
                data: [
                    {
                        title: 'Food Products',
                        imageSource: require('./products.png'),
                        onPress: () => {},
                    },
                    {
                        title: 'Menus',
                        imageSource: require('./menus.png'),
                        onPress: () => {},
                    },
                    {
                        title: 'Meals',
                        imageSource: require('./meals.png'),
                        onPress: () => {},
                    },
                    {
                        title: 'Meal Categories',
                        imageSource: require('./mealCategories.png'),
                        onPress: () => {},
                    },
                ]
            }
        ]
    }, []);

    return <GenericSettingsScreen navBarTitle="Ordering System" sections={sections}/>
};

export default OrderingSystemSettingsListScreen;

