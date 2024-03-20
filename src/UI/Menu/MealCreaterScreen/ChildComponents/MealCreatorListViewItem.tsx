import React, { useLayoutEffect, useRef } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import { CustomColors } from '../../../../helpers/colors';
import MealCreatorCheckBoxButton from './MealCreatorCheckBox';
import ListViewProductItemView from '../../../../helpers/Views/DataSpecificViews/ListViewProductItemView';
import Product from '../../../../api/orderingSystem/products/Product';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MenuNavStackParams } from '../../navigationHelpers';
import LayoutConstants from '../../../../LayoutConstants';

export interface MealCreatorListViewItemProps {
  // the number is the id of the item,
  isSelected: boolean;
  categoryId: number;
  updateSelectedProductIdForCategory: (
    categoryId: number,
    productId: number,
  ) => void;
  item: Product;
}

const MealCreatorListViewItem = (() => {
  const styles = StyleSheet.create({
    root: {
      flexDirection: 'row',
    },
    productInfoItemView: {
      padding: LayoutConstants.floatingCellStyles.padding,
      paddingRight: 0,
      flex: 1,
    },
    backgroundSelectionView: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  const MealCreatorListViewItem = (props: MealCreatorListViewItemProps) => {
    const navigation =
      useNavigation<StackNavigationProp<MenuNavStackParams, 'MealCreator'>>();

    function onButtonPress() {
      navigation.push('ProductDetail', { productId: props.item.id });
    }

    // 0 is translucent, 1 is green
    const backgroundColor = useRef(
      new Animated.Value(props.isSelected ? 1 : 0),
    );

    useLayoutEffect(() => {
      Animated.timing(backgroundColor.current, {
        toValue: props.isSelected ? 1 : 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }, [props.isSelected]);

    return (
      <View style={styles.root}>
        <Animated.View
          style={[
            styles.backgroundSelectionView,
            {
              backgroundColor: backgroundColor.current.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  CustomColors.themeGreen.withAdjustedOpacity(0).stringValue,
                  CustomColors.themeGreen.withAdjustedOpacity(0.15).stringValue,
                ],
              }),
            },
          ]}
        />
        <ListViewProductItemView
          style={styles.productInfoItemView}
          item={props.item}
          onPress={onButtonPress}
        />
        <MealCreatorCheckBoxButton
          onPress={() => {
            props.updateSelectedProductIdForCategory(
              props.categoryId,
              props.item.id,
            );
          }}
          isSelected={props.isSelected}
        />
      </View>
    );
  };

  return React.memo(MealCreatorListViewItem);
})();

export default MealCreatorListViewItem;
