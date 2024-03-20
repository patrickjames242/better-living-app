import React, { useContext } from 'react';
import { List, Set } from 'immutable';
import { MenuCategory } from '../../../api/orderingSystem/menus/Menu';
import { Optional } from '../../../helpers/general';

export const ALL_CATEGORIES_CATEGORY: MenuCategory = {
  title: 'All',
  productIds: Set(),
};

export interface MenuListViewScreenContextValue {
  allSortedCategories: List<MenuCategory>;
  selectedCategory: MenuCategory;
  setSelectedCategory: (category: MenuCategory) => void;
}

export const MenuListViewScreenContext =
  React.createContext<Optional<MenuListViewScreenContextValue>>(null);

export function useMenulistViewScreenContext() {
  const context = useContext(MenuListViewScreenContext);
  if (context == null) {
    throw new Error(
      'You cannnot call useMenulistViewScreenContext outside of a MenuListViewScreenContext.Provider',
    );
  }
  return context;
}
