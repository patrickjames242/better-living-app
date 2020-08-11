
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import NavigationControllerNavigationBar from '../../../../helpers/NavigationController/NavigationControllerNavigationBar';
import FloatingCellStyleList from '../../../../helpers/Views/FloatingCellStyleList';
import Product from '../../../../api/orderingSystem/products/Product';
import { useSelector } from '../../../../redux/store';
import ListViewProductItemView from '../../../Menu/MealCreaterScreen/ChildComponents/MealCreatorListViewItemInfoBox';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../navigationHelpers';



const ProductsListScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
    });

    interface SectionType {
        data: Product[];
    }

    const ProductsListScreen = (props: StackScreenProps<SettingsNavStackParams, 'ProductsList'>) => {

        const products = useSelector(state => state.orderingSystem.products);
        const sections = useMemo(() => {
            const sortedProducts = products.toSet().sortBy(p => p.title).toArray();
            return [{ title: 'yama', data: sortedProducts }];
        }, [products]);

        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Food Products" />

            <FloatingCellStyleList<Product, SectionType>
                sections={sections}
                renderItem={item => {
                    return <ListViewProductItemView
                        item={item.item}
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

