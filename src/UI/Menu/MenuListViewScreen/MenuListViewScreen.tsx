import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MenuListView from './MenuListView/MenuListView';
import { useCurrentMenu } from '../../../api/orderingSystem/menus/helpers';
import {
  MenuListViewScreenContextValue,
  ALL_CATEGORIES_CATEGORY,
  MenuListViewScreenContext,
} from './helpers';
import { List } from 'immutable';
import { MenuCategory } from '../../../api/orderingSystem/menus/Menu';
import { caseInsensitiveStringSort } from '../../../helpers/general';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import ListLoadingHolderView from '../../../helpers/Views/ListLoadingView';
import NoItemsToShowView from '../../../helpers/Views/NoItemsToShowView';
import {
  shouldPopTabBarControllerChildToTop,
  useTabBarControllerChildRootScreenPopToTopFunctionality,
} from '../../TabBarController/helpers';
import { TabBarSelection } from '../../TabBarController/tabBarSelectionsHelpers';
import { StackScreenProps } from '@react-navigation/stack';
import { MenuNavStackParams } from '../navigationHelpers';

const MenuListScreen = (() => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    contentView: {
      flex: 1,
      height: 1,
    },
  });

  return function MenuListScreen(
    props: StackScreenProps<MenuNavStackParams, 'MenuListView'>,
  ) {
    const menu = useCurrentMenu();

    const [selectedCategory, setSelectedCategory] = useState(
      ALL_CATEGORIES_CATEGORY,
    );

    useTabBarControllerChildRootScreenPopToTopFunctionality(
      TabBarSelection.menu,
      props,
    );

    const contextValue: MenuListViewScreenContextValue = useMemo(() => {
      return {
        allSortedCategories:
          menu?.categories.sort(caseInsensitiveStringSort(x => x.title)) ??
          List(),
        selectedCategory: selectedCategory,
        setSelectedCategory: (category: MenuCategory) => {
          setSelectedCategory(category);
        },
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menu?.categories, selectedCategory]);

    return (
      <MenuListViewScreenContext.Provider value={contextValue}>
        <View style={styles.root}>
          <LargeHeadingNavigationBar title={"Today's Menu"} />
          <ListLoadingHolderView>
            {(() => {
              if (contextValue.allSortedCategories.size < 1) {
                return (
                  <NoItemsToShowView
                    imageSource={require('./shop-closed.png')}
                    title="Nothing Available 😞"
                    subtitle="Nothing is available for purchase at this time. Try again later."
                  />
                );
              } else {
                return (
                  <View style={styles.contentView}>
                    <MenuListView />
                  </View>
                );
              }
            })()}
          </ListLoadingHolderView>
        </View>
      </MenuListViewScreenContext.Provider>
    );
  };
})();

export default MenuListScreen;
