
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Order from '../../../api/orders/Order';
import { getCurrentUserOrders } from '../../../api/orders/requests';
import Space from '../../../helpers/Spacers/Space';
import MultiColumnFlatList from '../../../helpers/Views/MultipleColumnLists/MultiColumnFlatList';
import NavigationControllerNavigationBar from '../../../helpers/Views/NavigationControllerNavigationBar';
import NoItemsToShowView from '../../../helpers/Views/NoItemsToShowView';
import PaginationListHolderView from '../../../helpers/Views/PaginationListHolderView';
import LayoutConstants from '../../../LayoutConstants';
import { OrdersUIConstants } from '../../TodaysOrders/TodaysOrdersListScreen/helpers';
import TodaysOrdersListItemView from '../../TodaysOrders/TodaysOrdersListScreen/TodaysOrdersListItemView';
import { SettingsNavStackParams } from '../navigationHelpers';



const MyOrdersListScreen = (() => {

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

    const MyOrdersListScreen = (props: StackScreenProps<SettingsNavStackParams, 'MyOrders'>) => {

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
            <NavigationControllerNavigationBar title="My Orders" />
            <PaginationListHolderView<string, Order>
                batchSize={15}
                fetchMoreItems={getCurrentUserOrders}
                getItemId={x => x.id}
                getItemDate={x => x.creationDate}
            >{
                ({ ListFooterComponent, fetchMoreItems, items }) => {
                    if (items.length <= 0){
                        return <NoItemsToShowView
                            title="No Orders"
                            subtitle="You haven't placed any orders yet. When you do, they show up here."
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
    return MyOrdersListScreen;
})();

export default MyOrdersListScreen;

