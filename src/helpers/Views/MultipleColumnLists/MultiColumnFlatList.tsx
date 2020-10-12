
import React, { useCallback, useMemo } from 'react';
import { FlatList, FlatListProps } from 'react-native';
import { getNumbersList } from '../../general';
import { NumberOfColumns, useMultipleColumnFunctionality } from './helpers';
import MultiColumnFlatListRow from './MultiColumnListRow';




export interface MultiColumnFlatListProps<ItemT> extends Omit<FlatListProps<ItemT>, 'renderItem' | 'numColumns' | 'keyExtractor'> {
    keyExtractor: (item: ItemT) => string | number;
    renderItem: (item: ItemT, index: number) => React.ReactNode;
    numberOfColumns: NumberOfColumns;
    columnSpacing?: number;
}

const MultiColumnFlatList = (() => {

    const MultiColumnFlatList = function MultiColumnFlatList<ItemT>(props: MultiColumnFlatListProps<ItemT>) {

        const {
            calculatedNumberOfColumns,
            onListViewLayout,
        } = useMultipleColumnFunctionality(props);

        const propsData = props.data;

        const fakeItems = useMemo(() => {
            const dataLength = propsData?.length;
            if (dataLength == null || dataLength < 1) { return []; }
            const amountOfRows = Math.ceil(dataLength / calculatedNumberOfColumns);
            return getNumbersList(0, Math.max(amountOfRows - 1, 0));
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [propsData, propsData?.length, calculatedNumberOfColumns]);

        const listRowItemKeyExtractor = useCallback((index: number) => {
            const item = propsData?.[index];
            if (item == null) {
                return String(index);
            }
            return String(props.keyExtractor(item));
        }, [props, propsData]);

        const listRowItemRenderer = useCallback((itemIndex: number) => {
            const item = propsData?.[itemIndex];
            if (item == null) { return null; }
            return props.renderItem(item, itemIndex)
        }, [props, propsData]);

        const renderItem = useCallback((args: { index: number }) => {
            return <MultiColumnFlatListRow
                numberOfColumns={calculatedNumberOfColumns}
                rowIndex={args.index}
                itemSpacing={props.columnSpacing ?? 0}
                itemKeyExtractor={listRowItemKeyExtractor}
                itemRenderer={listRowItemRenderer}
            />
        }, [calculatedNumberOfColumns, listRowItemKeyExtractor, listRowItemRenderer, props.columnSpacing]);

        return <FlatList
            {...props as any}
            onLayout={onListViewLayout}
            data={fakeItems}
            keyExtractor={x => String(x)}
            renderItem={renderItem}
        />
    }
    return MultiColumnFlatList;
})();

export default MultiColumnFlatList;






