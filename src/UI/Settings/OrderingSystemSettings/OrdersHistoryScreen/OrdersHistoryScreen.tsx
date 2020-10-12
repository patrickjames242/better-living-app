
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import {StyleSheet, View} from 'react-native';
import Order from '../../../../api/orders/Order';
import { getAllOrders } from '../../../../api/orders/requests';
import Space from '../../../../helpers/Spacers/Space';
import MultiColumnFlatList from '../../../../helpers/Views/MultipleColumnLists/MultiColumnFlatList';
import NavigationControllerNavigationBar from '../../../../helpers/Views/NavigationControllerNavigationBar';
import NoItemsToShowView from '../../../../helpers/Views/NoItemsToShowView';
import PaginationListHolderView from '../../../../helpers/Views/PaginationListHolderView';
import LayoutConstants from '../../../../LayoutConstants';
import { OrdersUIConstants } from '../../../TodaysOrders/TodaysOrdersListScreen/helpers';
import TodaysOrdersListItemView from '../../../TodaysOrders/TodaysOrdersListScreen/TodaysOrdersListItemView';
import { SettingsNavStackParams } from '../../navigationHelpers';



const OrdersHistoryScreen = (() => {
    
    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        listView: {
            zIndex: -1,
            flex: 1,
        },
        contentContainer: {
            padding: LayoutConstants.pageSideInsets,
        },
    });
    
    const OrdersHistoryScreen = (props: StackScreenProps<SettingsNavStackParams, 'OrdersHistory'>) => {
        
        const renderItem = useCallback((item: Order) => {
            return <TodaysOrdersListItemView order={item} onPress={(order: Order) => {
                props.navigation.push('OrderDetail', { order });
            }} />
        }, [props.navigation]);
        const keyExtractor = useCallback((item: Order) => item.id, []);
        const ItemSeparatorComponent = useCallback(() => {
            return <Space space={OrdersUIConstants.itemSpacing} />;
        }, []);

        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Orders History" />
            <PaginationListHolderView<string, Order>
                batchSize={15}
                fetchMoreItems={getAllOrders}
                getItemId={x => x.id}
                getItemDate={x => x.creationDate}
            >{
                ({ ListFooterComponent, fetchMoreItems, items }) => {
                    if (items.length <= 0){
                        return <NoItemsToShowView
                            title="No Orders"
                            subtitle="No orders have been placed as yet. Once orders have been made, they show up here."
                        />
                    } else {
                        return <MultiColumnFlatList
                            contentContainerStyle={styles.contentContainer}
                            style={styles.listView}
                            ItemSeparatorComponent={ItemSeparatorComponent}
                            numberOfColumns={OrdersUIConstants.calculateNumberOfColumns}
                            data={items}
                            columnSpacing={OrdersUIConstants.itemSpacing}
                            keyExtractor={keyExtractor}
                            renderItem={renderItem}
                            ListFooterComponent={ListFooterComponent}
                            onEndReachedThreshold={0.1}
                            onEndReached={fetchMoreItems}
                        />
                    }
                }
            }</PaginationListHolderView>

        </View>
    }
    return OrdersHistoryScreen;
})();

export default OrdersHistoryScreen;
