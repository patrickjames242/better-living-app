
import React, { useMemo } from 'react';
import { FlatList, FlatListProps } from 'react-native';
import { getNumbersList } from '../../general';
import { NumberOfColumns, useMultipleColumnFunctionality } from './helpers';
import MultiColumnFlatListRow from './MultiColumnListRow';




export interface MultiColumnFlatListProps<ItemT> extends Omit<FlatListProps<ItemT>, 'renderItem' | 'numColumns'> {
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
            return getNumbersList(0, amountOfRows - 1);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [propsData, propsData?.length, calculatedNumberOfColumns]);

        return <FlatList
            {...props as any}
            onLayout={onListViewLayout}
            data={fakeItems}
            renderItem={(args) => {
                return <MultiColumnFlatListRow
                    numberOfColumns={calculatedNumberOfColumns}
                    rowIndex={args.index}
                    itemSpacing={props.columnSpacing ?? 0}
                    itemRenderer={(itemIndex: number) => {
                        const item = propsData?.[itemIndex];
                        if (item == null){return null;}
                        return props.renderItem(item, itemIndex)
                    }}
                />
            }}
        />
    }
    return MultiColumnFlatList;
})();

export default MultiColumnFlatList;






