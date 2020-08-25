
import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, LayoutChangeEvent, Dimensions } from 'react-native';
import MenuListViewHeader from './MenuListViewHeader';
import MenuListItemView from './MenuListItemView';
import MenuListViewSectionHeader from './MenuListViewSectionHeader';
import LayoutConstants from '../../../../LayoutConstants';
import { computeNumberOfListColumns, caseInsensitiveStringSort } from '../../../../helpers/general';
import { TabBarPosition, WindowDimensions, windowDimensionsDidChangeNotification } from '../../../helpers';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNotificationListener } from '../../../../helpers/Notification';
import { useSelector } from '../../../../redux/store';
import { MenuCategory } from '../../../../api/orderingSystem/menus/Menu';
import MultiColumnSectionList from '../../../../helpers/Views/MultipleColumnLists/MultiColumnSectionList';
import Product from '../../../../api/orderingSystem/products/Product';
import { List } from 'immutable';
import { useMenulistViewScreenContext, ALL_CATEGORIES_CATEGORY } from '../helpers';


export interface MenuListViewProps {
    topContentInset?: number;
    bottomContentInset?: number;
}



const MenuListView = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        listView: {
            overflow: 'visible',
        },
    });

    const sideInsets = LayoutConstants.pageSideInsets;
    const itemSpacing = 20;
    const sectionBottomSpacing = 40;

    const maxItemWidth = 450;

    function getNumberOfColumnsBasedOnListViewWidth(listViewWidth: number): number {
        return computeNumberOfListColumns({
            listWidth: listViewWidth, 
            maxItemWidth, sideInsets, 
            horizontalItemSpacing: itemSpacing
        });
    }



    function useNumberOfColumns() {

        const isSideBarShowing = useSelector(state => state.tabBarController.tabBarPosition) === TabBarPosition.side;
        const safeAreaInsets = useSafeArea();

        const intialNumberOfColumns = useMemo(() => {
            let listViewWidth = Dimensions.get('window').width;
            listViewWidth -= (safeAreaInsets.left + safeAreaInsets.right);
            if (isSideBarShowing) {
                listViewWidth -= LayoutConstants.sideMenuBar.totalWidth;
            }
            return getNumberOfColumnsBasedOnListViewWidth(listViewWidth);
        }, [isSideBarShowing, safeAreaInsets.left, safeAreaInsets.right]);

        const [numberOfColumns, setNumberOfColumns] = useState(intialNumberOfColumns);

        const estimateNumberOfColumsnBasedOn = useCallback((windowDimensions: WindowDimensions) => {
            let width = windowDimensions.width;
            width -= (safeAreaInsets.left + safeAreaInsets.right);
            width -= isSideBarShowing ? LayoutConstants.sideMenuBar.totalWidth : 0;
            return getNumberOfColumnsBasedOnListViewWidth(width);
        }, [isSideBarShowing, safeAreaInsets.left, safeAreaInsets.right]);

        useNotificationListener(windowDimensionsDidChangeNotification, dimensions => {
            setNumberOfColumns(estimateNumberOfColumsnBasedOn(dimensions));
        }, [estimateNumberOfColumsnBasedOn])

        const rootViewOnLayoutCallback = useCallback(function (event: LayoutChangeEvent) {
            setNumberOfColumns(getNumberOfColumnsBasedOnListViewWidth(event.nativeEvent.layout.width));
        }, []);

        return { numberOfColumns, rootViewOnLayoutCallback };

    }

    return function MenuListView(props: MenuListViewProps) {
        
        const { numberOfColumns, rootViewOnLayoutCallback } = useNumberOfColumns();

        // for each menuListSection this returns a fake section where each item in the data array represents one of the row indices of the section in order starting from 0

        

        const allProducts = useSelector(state => state.orderingSystem.products);

        const menuListViewContext = useMenulistViewScreenContext();
    
        const selectedCategory = menuListViewContext.selectedCategory;
        const sortedCategories = menuListViewContext.allSortedCategories;
        

        const listViewSections = useMemo(() => {
            const categoriesToDisplay = selectedCategory === ALL_CATEGORIES_CATEGORY ? sortedCategories : List([selectedCategory]);
            return categoriesToDisplay.toArray().map(category => {
                return {
                    menuCategory: category,
                    data: (() => {
                        let products: Product[] = [];
                        category.productIds.forEach(productId => {
                            const product = allProducts.get(productId);
                            product && products.push(product);
                        });
                        return products.sort(caseInsensitiveStringSort(x => x.title)).map(x => x.id);
                    })()
                }
            }) ?? [];
        }, [allProducts, selectedCategory, sortedCategories]);


        return useMemo(() => (
            <View
                onLayout={rootViewOnLayoutCallback}
                style={[styles.root]}>
                <MultiColumnSectionList<number, {data: number[]}>
                    itemSpacing={itemSpacing}
                    sideInsets={sideInsets}
                    numberOfColumns={numberOfColumns}
                    style={styles.listView}
                    contentContainerStyle={{
                        paddingTop: props.topContentInset ?? 0,
                        paddingBottom: props.bottomContentInset ?? 0,
                    }}
                    ItemSeparatorComponent={() => {
                        return <View style={{ height: itemSpacing, width: itemSpacing }} />
                    }}
                    SectionSeparatorComponent={(leadingTrailingInfo) => {
                        const size = (() => {
                            if (leadingTrailingInfo.trailingItem !== undefined) {
                                return itemSpacing;
                            } else if (leadingTrailingInfo.trailingSection !== undefined) {
                                return sectionBottomSpacing;
                            } else {
                                return LayoutConstants.pageSideInsets;
                            }
                        })()
                        return <View style={{ height: size, width: size }} />
                    }}
                    renderSectionHeader={info => {
                        return <MenuListViewSectionHeader
                            section={info.section.realSection.menuCategory as MenuCategory}
                            sideInsets={sideInsets} />
                    }}
                    stickySectionHeadersEnabled={false}
                    sections={listViewSections}
                    keyExtractor={(item, index) => item + "," + index} // so react can shut up
                    ListHeaderComponent={MenuListViewHeader}
                    renderItem={item => {
                        return <MenuListItemView productId={item} />
                    }}
                />
            </View>
        ), [listViewSections, numberOfColumns, props.bottomContentInset, props.topContentInset, rootViewOnLayoutCallback]);
    }
})();

export default MenuListView;

