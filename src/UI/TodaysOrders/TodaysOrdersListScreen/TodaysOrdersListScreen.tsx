
import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import TodaysOrdersListItemView from './TodaysOrdersListItemView';
import LayoutConstants from '../../../LayoutConstants';
import MultiColumnSectionList from '../../../helpers/Views/MultipleColumnLists/MultiColumnSectionList';
import Order from '../../../api/orders/Order';
import { useSelector } from '../../../redux/store';
import Space from '../../../helpers/Spacers/Space';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import NoItemsToShowView from '../../../helpers/Views/NoItemsToShowView';
import ListLoadingHolderView from '../../../helpers/Views/ListLoadingView';
import { OrdersUIConstants } from './helpers';
import { StackScreenProps } from '@react-navigation/stack';
import { TodaysOrdersNavStackParams } from '../navigationHelpers';





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
            paddingTop: 32.5,
        },
        sectionHeaderText: {
            fontSize: 21,
            fontFamily: CustomFont.bold,
            marginLeft: 15,
            marginRight: 15,
        }
    });


    interface SectionType {
        title: string;
        data: Order[];
    }

    const TodaysOrdersListScreen = (props: StackScreenProps<TodaysOrdersNavStackParams, 'TodaysOrdersList'>) => {

        const ordersReduxState = useSelector(state => state.todaysOrders);

        const orderSections: SectionType[] = useMemo(() => {
            const completedOrders: Order[] = [];
            const incompleteOrders: Order[] = [];
            ordersReduxState.sort((va, vb) => {
                if (va.creationDate.isBefore(vb.creationDate)) {
                    return 1;
                } else if (va.creationDate.isAfter(vb.creationDate)) {
                    return -1;
                } else { return 0; }
            }).forEach((value) => {
                if (value.isCompleted) {
                    completedOrders.push(value);
                } else {
                    incompleteOrders.push(value);
                }
            });
            return [
                ...(incompleteOrders.length >= 1 ? [{
                    title: 'Incomplete Orders',
                    data: incompleteOrders,
                }] : []),
                ...(completedOrders.length >= 1 ? [{
                    title: 'Completed Orders',
                    data: completedOrders,
                }] : []),
            ]
        }, [ordersReduxState]);

        const respondToButtonPressed = useCallback((order: Order) => {
            props.navigation.push('OrderDetail', {order});
        }, [props.navigation]);
        
        return <View style={styles.root}>
            <LargeHeadingNavigationBar title="Todays Orders" />
            <ListLoadingHolderView>
                {(() => {
                    if (orderSections.length < 1) {
                        return <NoItemsToShowView title="No Orders" subtitle="No orders have been placed as yet for the day." />
                    }
                    return <MultiColumnSectionList<Order, SectionType>
                        contentContainerStyle={styles.flatListContentContainer}
                        style={styles.flatList}
                        ItemSeparatorComponent={() => <Space space={itemSpacing} />}
                        numberOfColumns={OrdersUIConstants.calculateNumberOfColumns}
                        itemSpacing={itemSpacing}
                        sections={orderSections}
                        stickySectionHeadersEnabled={false}
                        keyExtractor={item => item.id}
                        SectionSeparatorComponent={(leadingTrailingInfo) => {
                            const size = (() => {
                                if (leadingTrailingInfo.trailingItem !== undefined) {
                                    return 20;
                                } else if (leadingTrailingInfo.trailingSection !== undefined) {
                                    return 30;
                                } else {
                                    return 0;
                                }
                            })();
                            return <View style={{ height: size, width: size }} />
                        }}
                        renderSectionHeader={(info) => {
                            return <CustomizedText style={styles.sectionHeaderText}>{(info.section.realSection as SectionType).title}</CustomizedText>
                        }}
                        renderItem={item => {
                            return <TodaysOrdersListItemView order={item} onPress={respondToButtonPressed} />
                        }}
                    />
                })()}
            </ListLoadingHolderView>
        </View>
    }
    return TodaysOrdersListScreen;
})();

export default TodaysOrdersListScreen;


