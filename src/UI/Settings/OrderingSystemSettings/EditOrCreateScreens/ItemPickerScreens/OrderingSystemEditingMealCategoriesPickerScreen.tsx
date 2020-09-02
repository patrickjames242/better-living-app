
import React, { useMemo } from 'react';
import OrderingSystemItemPickerScreen from './OrderingSystemItemPickerScreen';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../../navigationHelpers';
import { useSelector } from '../../../../../redux/store';
import { caseInsensitiveStringSort } from '../../../../../helpers/general';
import PlainTextListItem from '../../PlainTextListItem';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    listItem: {
        padding: 0,
        paddingLeft: 6,
        paddingRight: 6,
        flex: 1,
    }    
})

const OrderingSystemEditingMealCategoriesPickerScreen = (props: StackScreenProps<SettingsNavStackParams, 'MealCategoriesPicker'>) => {

    const allReduxMealCategories = useSelector(state => state.orderingSystem.mealCategories);

    const allUnsortedItems = useMemo(() => {
        return allReduxMealCategories.toSet().toArray();
    }, [allReduxMealCategories]);

    return <OrderingSystemItemPickerScreen
        navBarTitle="Select Meal Product Categories"
        selectedSectionTitleText="Selected Categories"
        unselectedSectionTitleText="Unselected Categories"
        initialSelectedIds={props.route.params.currentSelectedCategoryIds}
        allUnsortedItems={allUnsortedItems}
        itemSorter={caseInsensitiveStringSort(x => x.uniqueName)}
        renderItem={item => {
            return <PlainTextListItem style={styles.listItem} title={item.uniqueName} pointerEvents="none"/>
        }}
        onSubmit={x => {
            props.route.params.onFinishedSelectingCategories(x)
            props.navigation.goBack();
        }}
    />
}

export default OrderingSystemEditingMealCategoriesPickerScreen;


