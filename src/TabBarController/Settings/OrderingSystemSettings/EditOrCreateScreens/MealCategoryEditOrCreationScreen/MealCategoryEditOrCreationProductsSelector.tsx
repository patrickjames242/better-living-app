
import React, { useMemo } from 'react';
import { useField } from '../../../../../helpers/formik';
import { MealCategoryEditOrCreateValues } from './helpers';
import { useSelector } from '../../../../../redux/store';
import { compactMap, caseInsensitiveStringSort } from '../../../../../helpers/general';
import { useNavigation } from '@react-navigation/native';
import { SettingsNavStackParams } from '../../../navigationHelpers';
import { StackNavigationProp } from '@react-navigation/stack';
import OrderingSystemFormChildrenSelector from '../OrderingSystemFormChildrenSelector';


const MealCategoryEditOrCreationProductsSelector = () => {

    const [, { value }, { setValue }] = useField<MealCategoryEditOrCreateValues, 'productIds'>('productIds');
    const navigation = useNavigation<StackNavigationProp<SettingsNavStackParams, 'MealCategoryEditOrCreate'>>();

    const allProductsReduxState = useSelector(state => state.orderingSystem.products);

    const sortedProductsValue = useMemo(() => {
        return compactMap(value.toArray(), x => allProductsReduxState.get(x))
        .sort(caseInsensitiveStringSort(x => x.title));
    }, [allProductsReduxState, value]);

    return <OrderingSystemFormChildrenSelector
        containerTitleText="Products"
        buttonAddText="Add Products"
        buttonEditText="Edit Products"
        value={sortedProductsValue}
        onEditOrAddButtonPressed={() => {
            navigation.push('ProductsPicker', {
                currentSelectedProductIds: value, 
                onFinishedSelectingProducts: setValue,
            });     
        }}
    />;
}
    
export default MealCategoryEditOrCreationProductsSelector;


