import React from 'react';
import { View, StyleSheet } from 'react-native';
import Spacer from '../../Spacers/Spacer';
import { getNumbersList } from '../../general';

interface MultiColumnFlatListRowProps {
  numberOfColumns: number;
  rowIndex: number;
  itemSpacing?: number;
  sideInsets?: number;
  itemKeyExtractor: (itemIndex: number) => string;
  itemRenderer: (itemIndex: number) => React.ReactNode;
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

  const MultiColumnFlatListRow = (props: MultiColumnFlatListRowProps) => {
    const startingIndex = props.numberOfColumns * props.rowIndex;
    const sideInsets = props.sideInsets ?? 0;
    return (
      <View
        style={[
          styles.root,
          {
            paddingLeft: sideInsets,
            paddingRight: sideInsets,
          },
        ]}
      >
        {(() => {
          if (props.numberOfColumns < 1) {
            return undefined;
          }
          return (
            <Spacer space={props.itemSpacing ?? 0}>
              {getNumbersList(0, props.numberOfColumns - 1).map(num => {
                const index = startingIndex + num;
                const key = props.itemKeyExtractor(index);
                const item = props.itemRenderer(index);
                return (
                  <View key={key} style={styles.itemHolder}>
                    {item != null && item}
                  </View>
                );
              })}
            </Spacer>
          );
        })()}
      </View>
    );
  };
  return React.memo(MultiColumnFlatListRow);
})();

export default MultiColumnFlatListRow;
