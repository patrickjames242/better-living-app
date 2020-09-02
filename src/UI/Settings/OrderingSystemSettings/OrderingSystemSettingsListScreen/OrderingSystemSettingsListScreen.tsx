

import React, { useMemo } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../navigationHelpers';
import GenericSettingsScreen, { GenericSettingsScreenSection } from '../../GenericSettingsScreen/GenericSettingsScreen';



const OrderingSystemSettingsListScreen = (props: StackScreenProps<SettingsNavStackParams, 'OrderingSystemSettingsList'>) => {

    const sections: GenericSettingsScreenSection[] = useMemo(() => {
        return [
            {
                title: null,
                data: [
                    {
                        title: 'Food Products',
                        imageSource: require('./products.png'),
                        onPress: () => {props.navigation.push('ProductsList')},
                    },
                    {
                        title: 'Menus',
                        imageSource: require('./menus.png'),
                        onPress: () => {props.navigation.push('MenusList')},
                    },
                    {
                        title: 'Meals',
                        imageSource: require('./meals.png'),
                        onPress: () => {props.navigation.push('MealsList')},
                    },
                    {
                        title: 'Meal Categories',
                        imageSource: require('./mealCategories.png'),
                        onPress: () => {props.navigation.push('MealCategoriesList')},
                    },
                ]
            }
        ]
    }, [props.navigation]);

    return <GenericSettingsScreen navBarTitle="Ordering System" sections={sections}/>
};

export default OrderingSystemSettingsListScreen;

