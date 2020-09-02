
import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../navigationHelpers';
import { compactMap, caseInsensitiveStringSort } from '../../../../helpers/general';
import OrderingSystemFormChildrenSelector from './OrderingSystemFormChildrenSelector';
import { useSelector } from '../../../../redux/store';
import { Set } from 'immutable';

export interface OrderingSystemFormChildrenProductsSelectorProps{
    value: Set<number>;
    onValueChanged: (newValue: Set<number>) => void;
    itemBackgroundColor?: string;
}

const OrderingSystemFormChildrenProductsSelector = (props: OrderingSystemFormChildrenProductsSelectorProps) => {

    const navigation = useNavigation<StackNavigationProp<SettingsNavStackParams, 'MealCategoryEditOrCreate'>>();

    const allProductsReduxState = useSelector(state => state.orderingSystem.products);

    const sortedProductsValue = useMemo(() => {
        return compactMap(props.value.toArray(), x => allProductsReduxState.get(x))
        .sort(caseInsensitiveStringSort(x => x.title));
    }, [allProductsReduxState, props.value]);

    return <OrderingSystemFormChildrenSelector
        containerTitleText="Products"
        buttonAddText="Add Products"
        buttonEditText="Edit Products"
        value={sortedProductsValue}
        itemBackgroundColor={props.itemBackgroundColor}
        onEditOrAddButtonPressed={() => {
            navigation.push('ProductsPicker', {
                currentSelectedProductIds: props.value, 
                onFinishedSelectingProducts: props.onValueChanged,
            });     
        }}
    />;
}
    
export default OrderingSystemFormChildrenProductsSelector;


