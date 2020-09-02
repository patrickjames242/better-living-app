
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import NavigationControllerNavigationBar from '../../../../helpers/NavigationController/NavigationControllerNavigationBar';
import FloatingCellStyleList from '../../../../helpers/Views/FloatingCellStyleList';
import Product from '../../../../api/orderingSystem/products/Product';
import { useSelector } from '../../../../redux/store';
import ListViewProductItemView from '../../../../helpers/Views/DataSpecificViews/ListViewProductItemView';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../navigationHelpers';
import PlusButton from '../../../../helpers/Buttons/PlusButton';
import { caseInsensitiveStringSort } from '../../../../helpers/general';
import LayoutConstants from '../../../../LayoutConstants';



const ProductsListScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        productItemView: {
            padding: LayoutConstants.floatingCellStyles.padding,
        }
    });

    interface SectionType {
        data: Product[];
    }

    

    const ProductsListScreen = (props: StackScreenProps<SettingsNavStackParams, 'ProductsList'>) => {

        const products = useSelector(state => state.orderingSystem.products);
        const sections = useMemo(() => {
            const sortedProducts = products.toSet().sort(caseInsensitiveStringSort(x => x.title)).toArray();
            return [{ data: sortedProducts }];
        }, [products]);

        return <View style={styles.root}>
            <NavigationControllerNavigationBar
                title="Food Products"
                rightAlignedView={
                    <PlusButton
                        onPress={() => {
                            props.navigation.push('ProductEditOrCreate', { productId: null });
                        }}
                    />
                } />
            <FloatingCellStyleList<Product, SectionType>
                sections={sections}
                keyExtractor={x => String(x.id)}
                renderItem={item => {
                    return <ListViewProductItemView
                        item={item.item}
                        style={styles.productItemView}
                        onPress={() => {
                            props.navigation.push('ProductEditOrCreate', { productId: item.item.id });
                        }} />
                }}
            />
        </View>
    }
    return ProductsListScreen;
})();

export default ProductsListScreen;

