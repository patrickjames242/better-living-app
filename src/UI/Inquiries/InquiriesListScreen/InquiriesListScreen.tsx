
import React from 'react';
import {StyleSheet, View } from 'react-native';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import MultiColumnFlatList from '../../../helpers/Views/MultipleColumnLists/MultiColumnFlatList';
import InquiriesListItemView, { InquiryUnreadStatus } from './InquiriesListItemView';
import { getNumbersList } from '../../../helpers/general';
import Space from '../../../helpers/Spacers/Space';
import PlusButton from '../../../helpers/Buttons/PlusButton';
import { OrdersUIConstants } from '../../TodaysOrders/TodaysOrdersListScreen/helpers';




const InquiriesListScreen = (() => {
    
    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        flatList: {
            zIndex: -1,
            overflow: 'visible',
        },
        flatListContentContainer: {
            padding: OrdersUIConstants.sideInsets,
        }
    });

    
    const InquiriesListScreen = () => {
        return <View style={styles.root}>
            <LargeHeadingNavigationBar title="Your Inquiries" rightAlignedView={<PlusButton/>}/>
            <MultiColumnFlatList
                contentContainerStyle={styles.flatListContentContainer}
                style={styles.flatList}
                ItemSeparatorComponent={() => <Space space={OrdersUIConstants.itemSpacing}/>}
                numberOfColumns={OrdersUIConstants.calculateNumberOfColumns}
                columnSpacing={OrdersUIConstants.itemSpacing}
                data={getNumbersList(1, 10)}
                keyExtractor={item => String(item)}
                renderItem={(_, index) => {
                    return <InquiriesListItemView unreadStatus={index === 0 ? InquiryUnreadStatus.unread : InquiryUnreadStatus.none}/>
                }}
            />
        </View>
    }
    return InquiriesListScreen;
})();

export default InquiriesListScreen;








