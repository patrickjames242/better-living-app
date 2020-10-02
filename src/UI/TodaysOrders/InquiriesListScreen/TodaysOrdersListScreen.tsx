
import React, { useMemo } from 'react';
import {StyleSheet, View, LayoutRectangle } from 'react-native';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import TodaysOrdersListItemView  from './TodaysOrdersListItemView';
import { computeNumberOfListColumns } from '../../../helpers/general';
import LayoutConstants from '../../../LayoutConstants';
import PlusButton from '../../../helpers/Buttons/PlusButton';
import MultiColumnSectionList from '../../../helpers/Views/MultipleColumnLists/MultiColumnSectionList';
import Order from '../../../api/orders/Order';
import { useSelector } from '../../../redux/store';
import Space from '../../../helpers/Spacers/Space';




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

    interface SectionType{
        title: string;
        data: Order[];
    }
    
    const TodaysOrdersListScreen = () => {

        const ordersReduxState = useSelector(state => state.todaysOrders);

        const orderSections: SectionType[] = useMemo(() => {
            const completedOrders: Order[] = [];
            const incompleteOrders: Order[] = [];
            ordersReduxState.sort((va, vb) => {
                if (va.creationDate.isBefore(vb.creationDate)){
                    return 1;
                } else if (va.creationDate.isAfter(vb.creationDate)){
                    return -1;
                } else {return 0;}
            }).forEach(value => {
                if (value.isCompleted){
                    completedOrders.push(value);
                } else {
                    incompleteOrders.push(value);
                }
            });
            return [
                {
                    title: 'Incomplete Orders',
                    data: incompleteOrders,
                },
                {
                    title: 'Completed Orders',
                    data: completedOrders,
                },
            ]
        }, [ordersReduxState]);

        return <View style={styles.root}>
            <LargeHeadingNavigationBar title="Todays Orders" rightAlignedView={<PlusButton/>}/>
            <MultiColumnSectionList<Order, SectionType>
                contentContainerStyle={styles.flatListContentContainer}
                style={styles.flatList}
                ItemSeparatorComponent={() => <Space space={itemSpacing}/>}
                numberOfColumns={calculateNumberOfColumns}
                itemSpacing={itemSpacing}
                sections={orderSections}
                keyExtractor={item => String(item)}
                renderItem={item => {
                    return <TodaysOrdersListItemView order={item}/>
                }}
            />
        </View>
    }
    return TodaysOrdersListScreen;
})();

export default TodaysOrdersListScreen;








