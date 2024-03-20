import React, { useState, useMemo, useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import LayoutConstants from '../../../../../LayoutConstants';
import SpacerView from '../../../../../helpers/Spacers/SpacerView';
import BouncySquareIconButton from '../../../../../helpers/Buttons/BouncySquareIconButton';
import AssetImages from '../../../../../images/AssetImages';
import { CustomColors } from '../../../../../helpers/colors';
import { Set } from 'immutable';
import BottomScreenButtonWithGradient, {
  BottomScreenButtonWithGradientRef,
} from '../../../../../helpers/Views/BottomScreenButtonWithGradient';
import NavigationControllerNavigationBar from '../../../../../helpers/Views/NavigationControllerNavigationBar';
import FloatingCellStyleList from '../../../../../helpers/Views/FloatingCellStyleList';
import { DefaultLongButtonsProps } from '../../../../../helpers/Buttons/LongTextAndIconButton';

export interface OrderingSystemItem {
  id: number;
}

export interface OrderingSystemItemPickerScreenProps<
  Item extends OrderingSystemItem,
> {
  navBarTitle: string;
  selectedSectionTitleText?: string;
  unselectedSectionTitleText?: string;

  initialSelectedIds: Set<number>;
  allUnsortedItems: Item[];
  itemSorter: (i1: Item, i2: Item) => number;
  renderItem: (item: Item) => React.ReactNode;
  onSubmit: (newIds: Set<number>) => void;
}

const OrderingSystemItemPickerScreen = (() => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
  });

  const OrderingSystemItemPickerScreen = function <
    Item extends OrderingSystemItem,
  >(props: OrderingSystemItemPickerScreenProps<Item>) {
    interface SectionType {
      title: string;
      data: Item[];
    }

    const [selectedIds, setSelectedIds] = useState(props.initialSelectedIds);

    const items = useMemo(() => {
      const selectedProducts: Item[] = [];
      const unselectedProducts: Item[] = [];

      props.allUnsortedItems.sort(props.itemSorter).forEach(x => {
        if (selectedIds.contains(x.id)) {
          selectedProducts.push(x);
        } else {
          unselectedProducts.push(x);
        }
      });

      return {
        selected: selectedProducts,
        unselected: unselectedProducts,
      };
    }, [props.allUnsortedItems, props.itemSorter, selectedIds]);

    const sections: SectionType[] = useMemo(() => {
      const x: SectionType[] = [];
      if (items.selected.length >= 1) {
        x.push({
          title: props.selectedSectionTitleText ?? 'Selected',
          data: items.selected,
        });
      }

      if (items.unselected.length >= 1) {
        x.push({
          title: props.unselectedSectionTitleText ?? 'Unselected',
          data: items.unselected,
        });
      }
      return x;
    }, [
      items.selected,
      items.unselected,
      props.selectedSectionTitleText,
      props.unselectedSectionTitleText,
    ]);

    const bottomButtonWithGradientRef =
      useRef<BottomScreenButtonWithGradientRef>(null);
    const [bottomButtonHeight, setBottomButtonHeight] = useState(0);

    return (
      <View style={styles.root}>
        <NavigationControllerNavigationBar title="Select Products" />
        <FloatingCellStyleList<Item, SectionType>
          onScroll={x =>
            bottomButtonWithGradientRef?.current?.gradientHolder?.notifyThatScrollViewScrolled(
              x,
            )
          }
          contentContainerStyle={{
            paddingBottom:
              bottomButtonHeight +
              LayoutConstants.bottomScreenButtonWithGradient.bottomPadding,
          }}
          sections={sections}
          titleForSection={section => section.title}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => {
            return (
              <ListItemView
                item={item}
                isSelected={selectedIds.contains(item.id)}
                onSelectButtonPressed={() => {
                  setSelectedIds(oldState => {
                    if (oldState.contains(item.id)) {
                      return oldState.remove(item.id);
                    } else {
                      return oldState.add(item.id);
                    }
                  });
                }}
              >
                {props.renderItem(item)}
              </ListItemView>
            );
          }}
        />
        <BottomScreenButtonWithGradient
          ref={bottomButtonWithGradientRef}
          buttonProps={{
            ...DefaultLongButtonsProps.saveChanges,
            onPress: () => {
              props.onSubmit(selectedIds);
            },
          }}
          gradientHolderProps={{
            onLayout: layout => {
              setBottomButtonHeight(layout.nativeEvent.layout.height);
            },
          }}
        />
      </View>
    );
  };
  return OrderingSystemItemPickerScreen;
})();

export default OrderingSystemItemPickerScreen;

interface ListItemViewProps<Item> extends React.PropsWithChildren<{}> {
  item: Item;
  isSelected: boolean;
  onSelectButtonPressed: () => void;
}

const ListItemView = (() => {
  const styles = StyleSheet.create({
    root: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: LayoutConstants.floatingCellStyles.padding,
    },
  });

  const ListItemView = function <Item>(props: ListItemViewProps<Item>) {
    return (
      <SpacerView
        style={styles.root}
        space={LayoutConstants.floatingCellStyles.padding}
      >
        {props.children}
        <BouncySquareIconButton
          onPress={props.onSelectButtonPressed}
          iconSources={{
            white: props.isSelected
              ? AssetImages.xIcon.white
              : AssetImages.plusIcon.white,
          }}
          backgroundColor={
            (props.isSelected ? CustomColors.redColor : CustomColors.themeGreen)
              .stringValue
          }
        />
      </SpacerView>
    );
  };
  return ListItemView;
})();
