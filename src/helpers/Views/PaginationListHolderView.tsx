

import { OrderedMap } from 'immutable';
import React, { useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FlatListProps, StyleSheet, View } from 'react-native';
import { batch } from 'react-redux';
import AssetImages from '../../images/AssetImages';
import { displayErrorMessage } from '../Alerts';
import { Optional } from '../general';
import CustomActivityIndicator from './ActivityIndicator';
import NoItemsToShowView from './NoItemsToShowView';

export enum PaginationListChangeType {
    insertOrUpdate = 'insertOrUpdate',
    delete = 'delete',
}

export type PaginationListChange<KeyT, ItemT> = { changeType: PaginationListChangeType.delete, deletedItemId: KeyT } |
{ changeType: PaginationListChangeType.insertOrUpdate, changedItem: ItemT }

export interface PaginationListHolderViewRef<KeyT extends string | number, ItemT> {

    // returns true if the change was applied and false if it wasn't
    applyChangeIfNeeded: (change: PaginationListChange<KeyT, ItemT>) => boolean;

    refresh: () => void;
}

export interface PaginationListHolderViewProps<KeyT extends string | number, ItemT> {
    batchSize: number;

    // expects that items fetched will be sorted already
    fetchMoreItems: (maxAmount: number, maxDate?: string) => Promise<ItemT[]>;
    getItemId: (item: ItemT) => KeyT;
    getItemDate: (item: ItemT) => moment.Moment;
    children: (args: { items: ItemT[], fetchMoreItems: () => void, ListFooterComponent: FlatListProps<any>['ListFooterComponent'] }) => JSX.Element;
}


const PaginationListHolderView = (() => {

    const styles = StyleSheet.create({
        fullScreenLoaderHolder: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1
        },
    });

    const initialStateValues = {
        items: OrderedMap<any, any>(),
        itemsAreBeingFetched: false,
        fetchEndedInError: false,
        noMoreItemsAreAvailable: false,
        lastMaxDate: null,
    }

    const PaginationListHolderView = <KeyT extends string | number, ItemT>(
        props: React.PropsWithChildren<PaginationListHolderViewProps<KeyT, ItemT>>,
        ref: Parameters<React.ForwardRefRenderFunction<PaginationListHolderViewRef<KeyT, ItemT>, PaginationListHolderViewProps<KeyT, ItemT>>>[1],
    ) => {

        const { batchSize, fetchMoreItems: propsFetchMoreItems, getItemId, getItemDate } = props;

        const [items, setItems] = useState<OrderedMap<KeyT, ItemT>>(initialStateValues.items);
        const [itemsAreBeingFetched, setItemsAreBeingFetched] = useState(initialStateValues.itemsAreBeingFetched);

        const fetchEndedInError = useRef(initialStateValues.fetchEndedInError);
        const noMoreItemsAreAvailable = useRef(initialStateValues.noMoreItemsAreAvailable);
        const lastMaxDate = useRef<Optional<moment.Moment>>(initialStateValues.lastMaxDate);

        const resetState = useCallback(() => {
            batch(() => {
                fetchEndedInError.current = initialStateValues.fetchEndedInError;
                noMoreItemsAreAvailable.current = initialStateValues.noMoreItemsAreAvailable;
                lastMaxDate.current = initialStateValues.lastMaxDate;
                setItems(initialStateValues.items);
                setItemsAreBeingFetched(initialStateValues.itemsAreBeingFetched);
            });
        }, []);


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



        useImperativeHandle(ref, () => {
            const shouldApplyChange = (change: PaginationListChange<KeyT, ItemT>) => {
                if (change.changeType === PaginationListChangeType.insertOrUpdate){
                    if (lastMaxDate.current == null){
                        return noMoreItemsAreAvailable.current;
                    } else if (
                        getItemDate(change.changedItem).isAfter(lastMaxDate.current) || 
                        getItemDate(change.changedItem).isSame(lastMaxDate.current)
                    ){
                        return true;
                    }
                }
                return true;
            }
            const applyChangeIfNeeded: PaginationListHolderViewRef<KeyT, ItemT>['applyChangeIfNeeded'] = change => {

                if (shouldApplyChange(change) === false) return false;

                setItems(oldItems => {
                    if (change.changeType === PaginationListChangeType.delete) {
                        return oldItems.remove(change.deletedItemId);
                    } else {
                        const id = getItemId(change.changedItem);
                        return oldItems.set(id, change.changedItem).sort((i1, i2) => {
                            if (getItemDate(i1).isAfter(getItemDate(i2))) {
                                return -1;
                            } else if (getItemDate(i1).isBefore(getItemDate(i2))) {
                                return 1;
                            } else { return 0 }
                        });
                    }
                });
                return true;
            }

            const refresh = () => {
                resetState();
                fetchMoreItems();
            }
            
            return {
                applyChangeIfNeeded,
                refresh,
            };
        }, [fetchMoreItems, getItemDate, getItemId, resetState]);



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
                <CustomActivityIndicator />
            </View>
        }, []);

        if (itemsAreBeingFetched && itemsArray.length <= 0) {
            return <View style={styles.fullScreenLoaderHolder}>
                <CustomActivityIndicator size="large" />
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
            return props.children({ ListFooterComponent, fetchMoreItems, items: itemsArray ?? [] });
        }
    }
    return React.forwardRef(PaginationListHolderView) as <KeyT extends number | string, ItemT>(props: PaginationListHolderViewProps<KeyT, ItemT> & {
        ref?: Parameters<React.ForwardRefRenderFunction<PaginationListHolderViewRef<KeyT, ItemT>, PaginationListHolderViewProps<KeyT, ItemT>>>[1]
    }) => JSX.Element;
})();

export default PaginationListHolderView;

