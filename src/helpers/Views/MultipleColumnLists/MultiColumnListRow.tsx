
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Spacer from '../../Spacers/Spacer';
import { getNumbersList } from '../../general';


interface MultiColumnFlatListRowProps {
    numberOfColumns: number,
    rowIndex: number,
    itemSpacing?: number,
    sideInsets?: number,
    itemRenderer: (itemIndex: number) => React.ReactNode
}

const MultiColumnFlatListRow = (() => {

    const styles = StyleSheet.create({
        root: {
            flexDirection: 'row',
        },
        itemHolder: {
            flex: 1,
        },
    });

    return function MultiColumnFlatListRow(props: MultiColumnFlatListRowProps) {
        const startingIndex = props.numberOfColumns * props.rowIndex;
        const sideInsets = props.sideInsets ?? 0;
        return <View style={[styles.root, {
            paddingLeft: sideInsets,
            paddingRight: sideInsets,
        }]}>
            {(() => {
                if (props.numberOfColumns < 1) { return undefined; }
                return <Spacer space={props.itemSpacing ?? 0}>
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




export default MultiColumnFlatListRow;