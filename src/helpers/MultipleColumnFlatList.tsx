
import React, { useMemo, useRef } from 'react';
import { StyleSheet, FlatList, FlatListProps, View, LayoutRectangle, Dimensions } from 'react-native';
import { getNumbersList, Optional, useForceUpdate } from './general';
import Spacer from './Spacers/Spacer';

type NumberOfColumns = number | ((layout: LayoutRectangle) => number);

export interface MultiColumnFlatListProps<ItemT> extends Omit<FlatListProps<ItemT>, 'renderItem' | 'numColumns'> {
    renderItem: (item: ItemT, index: number) => React.ReactNode;
    numberOfColumns: NumberOfColumns;
    columnSpacing?: number;
}

const MultiColumnFlatList = (() => {

    function calculateNumberOfColumns(numberOfColumns: NumberOfColumns, latestLayout: Optional<LayoutRectangle>): number{
        if (typeof numberOfColumns === 'number'){
            return numberOfColumns;
        } else {
            const windowDimensions = Dimensions.get('window');
            const layout: LayoutRectangle = latestLayout ?? {width: windowDimensions.width, height: windowDimensions.height, x: 0, y: 0};
            return numberOfColumns(layout);
        }
    }

    const MultiColumnFlatList = function MultiColumnFlatList<ItemT>(props: MultiColumnFlatListProps<ItemT>) {

        const latestLayout = useRef<Optional<LayoutRectangle>>(null);

        const latestLayoutValue = latestLayout.current;
        const propsNumberOfColumns = props.numberOfColumns;

        const calculatedNumberOfColumns = useMemo(() => {
            return calculateNumberOfColumns(propsNumberOfColumns, latestLayoutValue);            
        }, [propsNumberOfColumns, latestLayoutValue]);
        
        const propsData = props.data;

        const fakeItems = useMemo(() => {
            const dataLength = propsData?.length;
            if (dataLength == null || dataLength < 1) { return []; }
            const amountOfRows = Math.ceil(dataLength / calculatedNumberOfColumns);
            return getNumbersList(0, amountOfRows - 1);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [propsData, propsData?.length, calculatedNumberOfColumns]);

        const forceRerender = useForceUpdate();

        return <FlatList
            {...props as any}
            onLayout={layout => {
                latestLayout.current = layout.nativeEvent.layout;
                const newNumberOfColumns = calculateNumberOfColumns(propsNumberOfColumns, latestLayout.current);
                if (newNumberOfColumns !== calculatedNumberOfColumns) forceRerender();
                props.onLayout?.(layout);
            }}
            data={fakeItems}
            renderItem={(args) => {
                return <MultiColumnFlatListRowView
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




