

import { OrderedMap } from 'immutable';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatListProps, StyleSheet, View } from 'react-native';
import AssetImages from '../../images/AssetImages';
import { displayErrorMessage } from '../Alerts';
import { Optional } from '../general';
import NoItemsToShowView from './NoItemsToShowView';

export interface PaginationListHolderViewProps<KeyT extends string | number, ItemT> {
    batchSize: number;
    fetchMoreItems: (maxAmount: number, maxDate?: string) => Promise<ItemT[]>;
    getItemId: (item: ItemT) => KeyT;
    getItemDate: (item: ItemT) => moment.Moment;
    children: (args: {items: ItemT[], fetchMoreItems: () => void, ListFooterComponent: FlatListProps<any>['ListFooterComponent']}) => JSX.Element;
}

const PaginationListHolderView = (() => {

    const styles = StyleSheet.create({
        fullScreenLoaderHolder: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1
        },
    });

    const PaginationListHolderView = <KeyT extends string | number, ItemT>(props: React.PropsWithChildren<PaginationListHolderViewProps<KeyT, ItemT>>) => {

        const {batchSize, fetchMoreItems: propsFetchMoreItems, getItemId, getItemDate} = props;

        const [items, setItems] = useState<OrderedMap<KeyT, ItemT>>(OrderedMap());
        const [itemsAreBeingFetched, setItemsAreBeingFetched] = useState(false);

        const fetchEndedInError = useRef(false);
        const noMoreItemsAreAvailable = useRef(false);
        const lastMaxDate = useRef<Optional<moment.Moment>>(null);

        const itemsArray = useMemo(() => {
            const x: ItemT[] = [];
            items?.forEach(value => {
                x.push(value);
            });
            return x;
        }, [items]);

        const fetchMoreItems = useCallback(() => {
            if (itemsAreBeingFetched || noMoreItemsAreAvailable.current === true) return;

            fetchEndedInError.current = false;
            setItemsAreBeingFetched(true);

            propsFetchMoreItems(batchSize, lastMaxDate.current?.format() ?? undefined).then(items => {
                if (items.length < batchSize)
                    noMoreItemsAreAvailable.current = true;
                if (items.length >= 1)
                    lastMaxDate.current = getItemDate(items[items.length - 1]);
                setItems(prevItems => {
                    return (prevItems ?? OrderedMap<KeyT, ItemT>()).withMutations(map => {
                        items.forEach(x => map.set(getItemId(x), x));
                    });
                });
            }).catch(error => {
                fetchEndedInError.current = true;
                if (items.size <= 0) {
                    displayErrorMessage(error.message);
                }
            }).finally(() => {
                setItemsAreBeingFetched(false);
            });

        }, [batchSize, getItemDate, getItemId, items, itemsAreBeingFetched, propsFetchMoreItems]);

        useLayoutEffect(() => {
            fetchMoreItems();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const ListFooterComponent = useCallback(() => {
            if (
                noMoreItemsAreAvailable.current === true ||
                fetchEndedInError.current === true
            ) return null;
            return <View style={{ height: 80, justifyContent: 'center', alignContent: 'center' }}>
                <ActivityIndicator />
            </View>
        }, []);

        if (itemsAreBeingFetched && itemsArray.length <= 0) {
            return <View style={styles.fullScreenLoaderHolder}>
                <ActivityIndicator size="large" />
            </View>
        } else if (
            itemsAreBeingFetched === false && 
            fetchEndedInError.current && (itemsArray?.length ?? 0) <= 0
        ) {
            return <NoItemsToShowView
                imageSource={AssetImages.warningIconColored}
                imageStyle={{ height: 100, width: 100 }}
                title="Request Failed"
                subtitle="Something went wrong while trying to complete this request."
                buttonTitle="Retry"
                buttonOnPress={() => {
                    fetchMoreItems();
                }}
            />
        } else {
            return props.children({ListFooterComponent,fetchMoreItems, items: itemsArray ?? []});
        }
    }
    return PaginationListHolderView;
})();

export default PaginationListHolderView;
