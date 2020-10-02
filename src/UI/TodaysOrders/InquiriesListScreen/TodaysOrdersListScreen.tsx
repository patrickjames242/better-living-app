
import React from 'react';
import {StyleSheet, View, LayoutRectangle } from 'react-native';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import MultiColumnFlatList from '../../../helpers/Views/MultipleColumnLists/MultiColumnFlatList';
import TodaysOrdersListItemView, { TodaysOrdersUnreadStatus } from './TodaysOrdersListItemView';
import { getNumbersList, computeNumberOfListColumns } from '../../../helpers/general';
import LayoutConstants from '../../../LayoutConstants';
import Space from '../../../helpers/Spacers/Space';
import PlusButton from '../../../helpers/Buttons/PlusButton';




const TodaysOrdersListScreen = (() => {

    const itemSpacing = 15;
    const sideInsets = LayoutConstants.pageSideInsets;
    
    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        flatList: {
            zIndex: -1,
            overflow: 'visible',
        },
        flatListContentContainer: {
            padding: sideInsets,
        }
    });

    function calculateNumberOfColumns(layout: LayoutRectangle){
        return computeNumberOfListColumns({listWidth: layout.width, maxItemWidth: 350, sideInsets, horizontalItemSpacing: itemSpacing});
    }
    
    const TodaysOrdersListScreen = () => {
        return <View style={styles.root}>
            <LargeHeadingNavigationBar title="Todays Orders" rightAlignedView={<PlusButton/>}/>
            <MultiColumnFlatList
                contentContainerStyle={styles.flatListContentContainer}
                style={styles.flatList}
                ItemSeparatorComponent={() => <Space space={itemSpacing}/>}
                numberOfColumns={calculateNumberOfColumns}
                columnSpacing={itemSpacing}
                data={getNumbersList(1, 10)}
                keyExtractor={item => String(item)}
                renderItem={(_, index) => {
                    return <TodaysOrdersListItemView unreadStatus={index === 0 ? TodaysOrdersUnreadStatus.unread : TodaysOrdersUnreadStatus.none}/>
                }}
            />
        </View>
    }
    return TodaysOrdersListScreen;
})();

export default TodaysOrdersListScreen;








