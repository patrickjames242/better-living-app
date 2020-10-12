
import React, { useMemo } from 'react';
import { StyleSheet, View, LayoutRectangle } from 'react-native';
import MenuListViewHeader from './MenuListViewHeader';
import MenuListItemView from './MenuListItemView';
import LayoutConstants from '../../../../LayoutConstants';
import { computeNumberOfListColumns, caseInsensitiveStringSort } from '../../../../helpers/general';
import { useSelector } from '../../../../redux/store';
import { MenuCategory } from '../../../../api/orderingSystem/menus/Menu';
import MultiColumnSectionList from '../../../../helpers/Views/MultipleColumnLists/MultiColumnSectionList';
import Product from '../../../../api/orderingSystem/products/Product';
import { List } from 'immutable';
import { useMenulistViewScreenContext, ALL_CATEGORIES_CATEGORY } from '../helpers';
import CustomizedText from '../../../../helpers/Views/CustomizedText';
import { CustomFont } from '../../../../helpers/fonts/fonts';



export interface MenuListViewProps {
    topContentInset?: number;
    bottomContentInset?: number;
}



const MenuListView = (() => {

    const sideInsets = LayoutConstants.pageSideInsets;
    const itemSpacing = 20;
    const sectionBottomSpacing = 40;

    const maxItemWidth = 450;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        listView: {
            overflow: 'visible',
        },
        sectionHeaderText: {
            fontFamily: CustomFont.bold,
            fontSize: 23,
            marginLeft: sideInsets + 10,
            marginRight: sideInsets + 10,
        }
    });


    function sectionListNumberOfRows(layout: LayoutRectangle): number {
        return computeNumberOfListColumns({
            listWidth: layout.width,
            maxItemWidth, sideInsets,
            horizontalItemSpacing: itemSpacing
        });
    }





    return function MenuListView(props: MenuListViewProps) {


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
                style={[styles.root]}>
                <MultiColumnSectionList<number, { data: number[] }>
                    itemSpacing={itemSpacing}
                    sideInsets={sideInsets}
                    numberOfColumns={sectionListNumberOfRows}
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
                        return <CustomizedText style={styles.sectionHeaderText}>{(info.section.realSection.menuCategory as MenuCategory).title}</CustomizedText>
                    }}
                    stickySectionHeadersEnabled={false}
                    sections={listViewSections}
                    keyExtractor={item => item}
                    ListHeaderComponent={MenuListViewHeader}
                    renderItem={item => {
                        return <MenuListItemView productId={item} />
                    }}
                />
            </View>
        ), [listViewSections, props.bottomContentInset, props.topContentInset]);
    }
})();

export default MenuListView;

