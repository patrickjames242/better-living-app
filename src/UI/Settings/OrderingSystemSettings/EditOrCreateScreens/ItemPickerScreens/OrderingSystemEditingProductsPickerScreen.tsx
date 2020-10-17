
import React, { useMemo } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../../navigationHelpers';
import { useSelector } from '../../../../../redux/store';
import { caseInsensitiveStringSort } from '../../../../../helpers/general';
import ListViewProductItemView from '../../../../../helpers/Views/DataSpecificViews/ListViewProductItemView';
import OrderingSystemItemPickerScreen from './OrderingSystemItemPickerScreen';
import { StyleSheet } from 'react-native';


const OrderingSystemEditingProductsPickerScreen = (() => {

    const styles = StyleSheet.create({
        productItemView: {
            flex: 1,
        }
    })

    const OrderingSystemEditingProductsPickerScreen = (props: StackScreenProps<SettingsNavStackParams, 'ProductsPicker'>) => {

        const allProductsReduxState = useSelector(state => state.orderingSystem.products);
        const allProducts = useMemo(() => allProductsReduxState.toSet().toArray(), [allProductsReduxState]);

        return <OrderingSystemItemPickerScreen
            navBarTitle="Select Products"
            selectedSectionTitleText="Selected Products"
            unselectedSectionTitleText="Unselected Products"
            initialSelectedIds={props.route.params.currentSelectedProductIds}
            allUnsortedItems={allProducts}
            itemSorter={caseInsensitiveStringSort(x => x.title)}
            renderItem={item => {
                return <ListViewProductItemView style={styles.productItemView} item={item} pointerEvents="none"/>
            }}
            onSubmit={(ids) => {
                props.route.params.onFinishedSelectingProducts(ids);
                props.navigation.goBack();
            }}
        />
    
    }
    return OrderingSystemEditingProductsPickerScreen;
})();

export default OrderingSystemEditingProductsPickerScreen;


