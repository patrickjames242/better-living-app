
import React, { useMemo, useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import NavigationControllerNavigationBar from '../../../../helpers/NavigationController/NavigationControllerNavigationBar';
import FloatingCellStyleList from '../../../../helpers/Views/FloatingCellStyleList';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../navigationHelpers';
import { useSelector } from '../../../../redux/store';
import Product from '../../../../api/orderingSystem/products/Product';
import { caseInsensitiveStringSort } from '../../../../helpers/general';
import ListViewProductItemView from '../../../../helpers/Views/DataSpecificViews/ListViewProductItemView';
import LayoutConstants from '../../../../LayoutConstants';
import BouncySquareIconButton from '../../../../helpers/Buttons/BouncySquareIconButton';
import AssetImages from '../../../../images/AssetImages';
import { CustomColors } from '../../../../helpers/colors';
import BottomScreenButtonWithGradient, { BottomScreenButtonWithGradientRef } from '../../../../helpers/Views/BottomScreenButtonWithGradient';
import { DefaultLongButtonsProps } from '../../../../helpers/Buttons/LongTextAndIconButton';




const OrderingSystemEditingProductsPickerScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
    });

    interface SectionType {
        title: string;
        data: Product[];
    }

    const OrderingSystemEditingProductsPickerScreen = (props: StackScreenProps<SettingsNavStackParams, 'ProductsPicker'>) => {

        const [selectedProductIds, setSelectedProductIds] = useState(props.route.params.currentSelectedProductIds);

        const allProductsReduxState = useSelector(state => state.orderingSystem.products);

        const products = useMemo(() => {

            const selectedProducts: Product[] = [];
            const unselectedProducts: Product[] = [];

            allProductsReduxState.toSet().sort(caseInsensitiveStringSort(x => x.title)).forEach(x => {
                if (selectedProductIds.contains(x.id)) {
                    selectedProducts.push(x);
                } else {
                    unselectedProducts.push(x);
                }
            });

            return {
                selected: selectedProducts,
                unselected: unselectedProducts,
            };

        }, [allProductsReduxState, selectedProductIds]);

        const sections: SectionType[] = useMemo(() => {
            const x: SectionType[] = [];
            if (products.selected.length >= 1){
                x.push({
                    title: 'Selected Products',
                    data: products.selected,
                });
            }

            if (products.unselected.length >= 1){
                x.push({
                    title: 'Unselected Products',
                    data: products.unselected,
                });
            }
            return x;
        }, [products.selected, products.unselected]);

        const bottomButtonWithGradientRef = useRef<BottomScreenButtonWithGradientRef>(null);
        const [bottomButtonHeight, setBottomButtonHeight] = useState(0);

        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Select Products" />
            <FloatingCellStyleList<Product, SectionType>
                onScroll={x => bottomButtonWithGradientRef?.current?.gradientHolder?.notifyThatScrollViewScrolled(x)}
                contentContainerStyle={{
                    paddingBottom: bottomButtonHeight + LayoutConstants.bottomScreenButtonWithGradient.bottomPadding,
                }}
                sections={sections}
                titleForSection={section => section.title}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => {
                    return <ListItemView product={item} isSelected={selectedProductIds.contains(item.id)} onSelectButtonPressed={() => {
                        setSelectedProductIds(oldState => {
                            if (oldState.contains(item.id)) {
                                return oldState.remove(item.id);
                            } else {
                                return oldState.add(item.id);
                            }
                        });
                    }} />
                }}
            />
            <BottomScreenButtonWithGradient
                ref={bottomButtonWithGradientRef}
                buttonProps={{
                    ...DefaultLongButtonsProps.saveChanges,
                    onPress: () => {
                        props.route.params.onFinishedSelectingProducts(selectedProductIds);
                        props.navigation.goBack();
                    }
                }}
                gradientHolderProps={{
                    onLayout: layout => {
                        setBottomButtonHeight(layout.nativeEvent.layout.height);
                    }
                }}
            />
        </View>
    }
    return OrderingSystemEditingProductsPickerScreen;
})();

export default OrderingSystemEditingProductsPickerScreen;




interface ListItemViewProps {
    product: Product;
    isSelected: boolean;
    onSelectButtonPressed: () => void;
}

const ListItemView = (() => {

    const styles = StyleSheet.create({
        root: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        productItemView: {
            paddingRight: 0,
        },
        checkMarkButton: {
            padding: LayoutConstants.floatingCellStyles.padding,
        },
    });

    const ListItemView = (props: ListItemViewProps) => {
        return <View style={styles.root}>
            <ListViewProductItemView pointerEvents="none" item={props.product} style={styles.productItemView} />
            <BouncySquareIconButton
                style={styles.checkMarkButton}
                onPress={props.onSelectButtonPressed}
                iconSource={props.isSelected ? AssetImages.xIcon : AssetImages.plusIcon}
                backgroundColor={(props.isSelected ? CustomColors.redColor : CustomColors.themeGreen).stringValue}
            />
        </View>
    }
    return ListItemView;
})();


