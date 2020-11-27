

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { AppState, AppStateStatus, StyleSheet, View } from 'react-native';
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
import { useTabBarControllerChildRootScreenPopToTopFunctionality } from '../../TabBarController/helpers';
import { TabBarSelection } from '../../TabBarController/tabBarSelectionsHelpers';
import { NASSAU_TIME_ZONE } from '../../../helpers/general';
import * as moment from 'moment-timezone';
import { useForceUpdate } from '../../../helpers/reactHooks';


const TodaysOrdersListScreen = (() => {

    const itemSpacing = 15;
    const sideInsets = LayoutConstants.pageSideInsets;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        flatList: {
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

    const startOfToday = () => moment.tz(NASSAU_TIME_ZONE).startOf('day');

    const TodaysOrdersListScreen = (props: StackScreenProps<TodaysOrdersNavStackParams, 'TodaysOrdersList'>) => {

        useTabBarControllerChildRootScreenPopToTopFunctionality(TabBarSelection.todaysOrders, props);

        const ordersReduxState = useSelector(state => state.todaysOrders);

        const forceComponentUpdate = useForceUpdate();

        const latestCurrentDay = useRef(startOfToday());


        // attempts to refresh the orders list when the day changes just in case the server is late delivering the new orders for the new day... or if the internet connection is lost
        useEffect(() => {

            const refreshIfNeeded = () => {
                const newCurrentDay = startOfToday();
                if (newCurrentDay.isSame(latestCurrentDay.current) === false){
                    forceComponentUpdate();
                }
                latestCurrentDay.current = newCurrentDay;
            }

            const intervalId = setInterval(refreshIfNeeded, 60000);
            const appStateEventListener = (state: AppStateStatus) => {
                state === 'active' && refreshIfNeeded();
            }
            AppState.addEventListener('change', appStateEventListener);
            return () => {
                clearInterval(intervalId);
                AppState.removeEventListener('change', appStateEventListener);
            }
        }, [forceComponentUpdate]);

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
                
                const orderWasCreatedToday = value.creationDate.clone().startOf('day').isSame(startOfToday());
                if (orderWasCreatedToday === false) return;

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
            props.navigation.push('OrderDetail', {
                reduxOrderId: order.id, 
            });
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


