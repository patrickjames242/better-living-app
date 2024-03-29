import React, { useMemo } from 'react';
import { SectionList, SectionListProps, SectionListData } from 'react-native';
import { NumberOfColumns, useMultipleColumnFunctionality } from './helpers';
import { getNumbersList } from '../../general';
import MultiColumnListRow from './MultiColumnListRow';

export interface MultiColumnSectionListProps<
  ItemType,
  SectionType extends SectionListData<ItemType>,
> extends Omit<
    SectionListProps<ItemType>,
    'renderItem' | 'sections' | 'keyExtractor'
  > {
  keyExtractor: (item: ItemType) => number | string;
  numberOfColumns: NumberOfColumns;
  sections: SectionType[];
  itemSpacing?: number;
  sideInsets?: number;
  renderItem: (item: ItemType, section: SectionType) => React.ReactNode;
}

const MultiColumnSectionList = (() => {
  function MultiColumnSectionList<
    ItemType,
    SectionType extends SectionListData<ItemType>,
  >(props: MultiColumnSectionListProps<ItemType, SectionType>) {
    const { calculatedNumberOfColumns, onListViewLayout } =
      useMultipleColumnFunctionality(props);

    const fakeSections = useMemo(() => {
      return props.sections.map(section => ({
        realSection: section,
        data: (() => {
          if (section.data.length < 1) {
            return [];
          }
          const amountOfRows = Math.ceil(
            section.data.length / calculatedNumberOfColumns,
          );
          return getNumbersList(0, Math.max(amountOfRows - 1, 0));
        })(),
      }));
    }, [calculatedNumberOfColumns, props.sections]);

    return (
      <SectionList
        {...(props as any)}
        onLayout={onListViewLayout}
        sections={fakeSections}
        keyExtractor={(x, y) => '' + x + y}
        renderItem={({ item, section }) => {
          return (
            <MultiColumnListRow
              numberOfColumns={calculatedNumberOfColumns}
              rowIndex={item}
              itemSpacing={props.itemSpacing}
              sideInsets={props.sideInsets}
              itemKeyExtractor={(itemIndex: number) => {
                const realSection = section.realSection;
                const item = realSection.data[itemIndex] as ItemType;
                if (item == null) {
                  return '' + itemIndex + '+' + item;
                }
                return String(props.keyExtractor(item));
              }}
              itemRenderer={(itemIndex: number) => {
                const realSection = section.realSection;
                const item = realSection.data[itemIndex] as ItemType;
                if (item == null) {
                  return null;
                }
                return props.renderItem(item, realSection);
              }}
            />
          );
        }}
      />
    );
  }
  return MultiColumnSectionList;
})();

export default MultiColumnSectionList;
