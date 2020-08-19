
import React, { useMemo } from 'react';
import OrderingSystemFormChildrenSelector from '../OrderingSystemFormChildrenSelector';
import { useField } from '../../../../../helpers/formik';
import { MealEditOrCreationValues } from './helpers';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../../navigationHelpers';
import { useSelector } from '../../../../../redux/store';
import { compactMap, caseInsensitiveStringSort } from '../../../../../helpers/general';



const MealEditOrCreationCategoriesSelector = () => {
    const [, {value}, {setValue}] = useField<MealEditOrCreationValues, 'productCategoryIds'>('productCategoryIds');

    const navigation = useNavigation<StackNavigationProp<SettingsNavStackParams, 'MealEditOrCreate'>>();

    const allMealCategoriesReduxState = useSelector(state => state.orderingSystem.mealCategories);

    const sortedMealCategoriesValue = useMemo(() => {
        return compactMap(value.toArray(), x => {
            const obj = allMealCategoriesReduxState.get(x);
            if (obj == null){return null;}
            return {
                title: obj.uniqueName,
                id: obj.id,
            }
        }).sort(caseInsensitiveStringSort(x => x.title));
    }, [allMealCategoriesReduxState, value]);

    return <OrderingSystemFormChildrenSelector
        containerTitleText="Product Categories"
        buttonAddText="Add Categories"
        buttonEditText="Edit Categories"
        value={sortedMealCategoriesValue}
        onEditOrAddButtonPressed={() => {
            navigation.push('MealCategoriesPicker', {
                currentSelectedCategoryIds: value,
                onFinishedSelectingCategories: setValue,
            });
        }}
    />
}

export default MealEditOrCreationCategoriesSelector;
