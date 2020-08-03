
import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TopBar from './TopBar/TopBar';
import MenuListView from './MenuListView/MenuListView';
import { useCurrentMenu } from '../../../api/orderingSystem/menus/helpers';
import { MenuListViewScreenContextValue, ALL_CATEGORIES_CATEGORY, MenuListViewScreenContext } from './helpers';
import { List } from 'immutable';
import { MenuCategory } from '../../../api/orderingSystem/menus/Menu';


const MenuListScreen = (() => {

	const styles = StyleSheet.create({
		root: {
			flex: 1,
		},
		contentView: {
			zIndex: -1,
			flex: 1,
			height: 1,
		},
	});

	return function MenuListScreen() {

		const menu = useCurrentMenu();

		const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES_CATEGORY);

		const contextValue: MenuListViewScreenContextValue = useMemo(() => {
			return {
				allSortedCategories: menu?.categories.sort((a, b) => a.title.localeCompare(b.title)) ?? List(),
				selectedCategory: selectedCategory,
				setSelectedCategory: (category: MenuCategory) => {
					setSelectedCategory(category);
				},
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [menu?.categories, selectedCategory]);

		return <MenuListViewScreenContext.Provider value={contextValue}>
			<View style={styles.root}>
				<TopBar />
				<View style={styles.contentView}>
					<MenuListView />
				</View>
			</View>
		</MenuListViewScreenContext.Provider>


	};
})();

export default MenuListScreen;



