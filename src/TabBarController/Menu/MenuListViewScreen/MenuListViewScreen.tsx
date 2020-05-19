
import React from 'react';
import {View, StyleSheet} from 'react-native';
import TopBar from './TopBar/TopBar';
import MenuListView from './MenuListView/MenuListView';


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
		return <View style={styles.root}>
			<TopBar />
			<View style={styles.contentView}>
				<MenuListView />
			</View>
		</View>
	};
})();

export default MenuListScreen;