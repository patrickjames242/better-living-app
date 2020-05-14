
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, SectionList, View, LayoutChangeEvent, SafeAreaView, Dimensions } from 'react-native';
import MenuListViewHeader from './MenuListViewHeader';
import { MenuListSection, menuListSections, MenuListItem } from './helpers';
import MenuListItemView from './MenuListItemView';
import MenuListViewSectionHeader from './MenuListViewSectionHeader';
import LayoutConstants from '../../../LayoutConstants';
import { getNumbersList } from '../../../helpers/general';
import { TabBarPosition, WindowDimensions, windowDimensionsDidChangeNotification } from '../../helpers';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNotificationListener } from '../../../helpers/Notification';
import { useSelector } from '../../../redux/store';



export interface MenuListViewProps {
    topContentInset?: number;
    bottomContentInset?: number;
}

/*
    READ ME!!🙋🏽‍♂️🙋🏽‍♂️🙋🏽‍♂️

    Ok, so for some strange, stupid reason, SectionList doesn't support multiple columns like FlatList does. So to make up for this, I'm still using a SectionList, but each item in each section will be a MenuListSectionItemRow that represents a row... and each of these rows will hold multiple MenuListItemView.
*/

const MenuListView = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        listView: {
            overflow: 'visible',
        },
    });

    const sideInsets = LayoutConstants.menuPage.pageSideInsets;
    const itemSpacing = 20;
    const sectionBottomSpacing = 40;

    const maxItemWidth = 450;

    function getNumberOfColumnsBasedOnListViewWidth(listViewWidth: number): number {
        return Math.ceil((listViewWidth + itemSpacing - (2 * sideInsets)) / (maxItemWidth + itemSpacing));
    }

    

    function useNumberOfColumns(){

        const isSideBarShowing = useSelector(state => state.tabBarController.tabBarPosition) === TabBarPosition.side;
        const safeAreaInsets = useSafeArea();

        const intialNumberOfColumns = useMemo(() => {
            let listViewWidth = Dimensions.get('window').width;
            listViewWidth -= (safeAreaInsets.left + safeAreaInsets.right);
            if (isSideBarShowing) {
                listViewWidth -= LayoutConstants.sideMenuBar.totalWidth;
            }
            return getNumberOfColumnsBasedOnListViewWidth(listViewWidth);
        }, []);

        const [numberOfColumns, setNumberOfColumns] = useState(intialNumberOfColumns);

        const estimateNumberOfColumsnBasedOn = useCallback((windowDimensions: WindowDimensions) => {
            let width = windowDimensions.width;
            width -= (safeAreaInsets.left + safeAreaInsets.right);
            width -= isSideBarShowing ? LayoutConstants.sideMenuBar.totalWidth : 0;
            return getNumberOfColumnsBasedOnListViewWidth(width);
        }, [safeAreaInsets.left, safeAreaInsets.right]);

        useNotificationListener(windowDimensionsDidChangeNotification, dimensions => {
            setNumberOfColumns(estimateNumberOfColumsnBasedOn(dimensions));
        }, [estimateNumberOfColumsnBasedOn])

        function rootViewOnLayoutCallback(event: LayoutChangeEvent){
            setNumberOfColumns(getNumberOfColumnsBasedOnListViewWidth(event.nativeEvent.layout.width));
        }

        return {numberOfColumns, rootViewOnLayoutCallback};

    }

    return function MenuListView(props: MenuListViewProps) {

        const {numberOfColumns, rootViewOnLayoutCallback} = useNumberOfColumns();
        
        // for each menuListSection this returns a fake section where each item in the data array represents one of the row indices of the section in order starting from 0

        const fakeSections = useMemo(() => {
            return menuListSections.map(section => {
                return {
                    realSection: section,
                    data: (() => {
                        if (section.data.length < 1) { return [] }
                        const amountOfRows = Math.ceil(section.data.length / numberOfColumns);
                        return getNumbersList(0, amountOfRows - 1);
                    })()
                }
            });
        }, [numberOfColumns]);


        return useMemo(() => (
            <View
                onLayout={rootViewOnLayoutCallback}
                style={[styles.root]}>
                <SectionList
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
                                return LayoutConstants.menuPage.pageSideInsets;
                            }
                        })();
                        return <View style={{ height: size, width: size }} />
                    }}
                    renderSectionHeader={info => {
                        return <MenuListViewSectionHeader
                            section={info.section.realSection as MenuListSection}
                            sideInsets={sideInsets} />
                    }}
                    stickySectionHeadersEnabled={false}
                    sections={fakeSections}
                    keyExtractor={(item, index) => item + "," + index}
                    ListHeaderComponent={MenuListViewHeader}
                    renderItem={({ item, section }) => {
                        return <MenuListSectionItemRow
                            sideInsets={sideInsets}
                            numberOfColumns={numberOfColumns}
                            rowIndex={item}
                            allSectionItems={(section.realSection as MenuListSection).data}
                            itemSpacing={itemSpacing}
                        />
                    }}
                />
            </View>
        ), [fakeSections, numberOfColumns]);
    }
})();

export default MenuListView;



interface MenuListSectionItemRowProps {
    numberOfColumns: number,
    rowIndex: number,
    allSectionItems: MenuListItem[],
    itemSpacing: number,
    sideInsets: number,
}

const MenuListSectionItemRow = (() => {

    const styles = StyleSheet.create({
        root: {
            flexDirection: 'row',
        },
    });

    return function (props: MenuListSectionItemRowProps) {

        const startingIndex = props.numberOfColumns * props.rowIndex;

        return <View style={[styles.root, {
            marginLeft: props.sideInsets,
            marginRight: props.sideInsets
        }]}>
            {(() => {
                if (props.numberOfColumns < 1) { return undefined; }

                return getNumbersList(0, props.numberOfColumns - 1).map(num => {

                    const item = props.allSectionItems[startingIndex + num]
                    const marginLeft = num === 0 ? undefined : props.itemSpacing;

                    return <View key={num} style={{ flex: 1, marginLeft }}>
                        {(() => {
                            if (item != undefined) {
                                return <MenuListItemView item={item} />
                            }
                        })()}
                    </View>
                });

            })()}
        </View>
    }
})();



