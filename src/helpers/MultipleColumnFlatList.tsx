
import React, { useMemo } from 'react';
import { StyleSheet, FlatList, FlatListProps, View } from 'react-native';
import { getNumbersList } from './general';
import Spacer from './Spacers/Spacer';


export interface MultiColumnFlatListProps<ItemT> extends Omit<FlatListProps<ItemT>, 'renderItem' | 'numColumns'> {
    renderItem: (item: ItemT, index: number) => React.ReactNode;
    numberOfColumns: number;
    columnSpacing?: number;
}

const MultiColumnFlatList = (() => {

    const MultiColumnFlatList = function MultiColumnFlatList<ItemT>(props: MultiColumnFlatListProps<ItemT>) {

        const numberOfColumns = props.numberOfColumns;
        const data = props.data;

        const fakeItems = useMemo(() => {
            const dataLength = data?.length;
            if (dataLength == null || dataLength < 1) { return []; }
            const amountOfRows = Math.ceil(dataLength / numberOfColumns);
            return getNumbersList(0, amountOfRows - 1);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [data, data?.length, numberOfColumns]);

        return <FlatList
            {...props as any}
            data={fakeItems}
            renderItem={(args) => {
                return <MultiColumnFlatListRowView
                    numberOfColumns={numberOfColumns}
                    rowIndex={args.index}
                    itemSpacing={props.columnSpacing ?? 0}
                    itemRenderer={(itemIndex: number) => {
                        const item = data?.[itemIndex];
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








interface MultiColumnFlatListRowViewProps {
    numberOfColumns: number,
    rowIndex: number,
    itemSpacing: number,
    itemRenderer: (itemIndex: number) => React.ReactNode
}

const MultiColumnFlatListRowView = (() => {

    const styles = StyleSheet.create({
        root: {
            flexDirection: 'row',
        },
        itemHolder: {
            flex: 1,
            flexDirection: 'row',
        },
    });

    return function MenuListSectionItemRow(props: MultiColumnFlatListRowViewProps) {
        const startingIndex = props.numberOfColumns * props.rowIndex;
        return <View style={[styles.root]}>
            {(() => {
                if (props.numberOfColumns < 1) { return undefined; }
                return <Spacer space={props.itemSpacing}>
                    {getNumbersList(0, props.numberOfColumns - 1).map(num => {
                        const item = props.itemRenderer(startingIndex + num);
                        return <View key={num} style={styles.itemHolder}>
                            {item != null && item}
                        </View>
                    })}
                </Spacer>
            })()}
        </View>
    }
})();
