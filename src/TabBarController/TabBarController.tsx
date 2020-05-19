

import React, { useCallback } from 'react';
import { CustomColors } from '../helpers/colors';
import { View, StyleSheet} from 'react-native';
import SideTabBar from './TabBar/SideTabBar';
import BottomTabBar from './TabBar/BottomTabBar';
import {TabBarPosition, windowDimensionsDidChangeNotification, useSetUpWindowDimensionsObserver, calculateCurrentDesiredTabBarPosition } from './helpers';
import TabBarControllerContentView from './TabBarControllerContentView';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNotificationListener } from '../helpers/Notification';
import { useDispatch, useSelector } from '../redux/store';
import { changeTabBarPosition } from '../redux/tabBarController';



const TabBarController = (() => {

	const styles = StyleSheet.create({
		root: {
			flex: 1,
			backgroundColor: CustomColors.mainBackgroundColor.stringValue,
			flexDirection: 'row',
		},
		sideBarHolder: {
			zIndex: 10,
		},
		mainInterface: {
			flex: 1,
		},
	});

	return function TabBarController() {

		const safeAreaInsets = useSafeArea();

		const dispatch = useDispatch();
		const currentTabBarPosition = useSelector(state => state.tabBarController.tabBarPosition);

		const updateTabBarPositionIfNeeded = useCallback((newPosition: TabBarPosition) => {
			if (currentTabBarPosition !== newPosition){
				dispatch(changeTabBarPosition(newPosition));
			}
		}, [currentTabBarPosition, dispatch])

		const { rootViewOnLayoutCallback } = useSetUpWindowDimensionsObserver();

		useNotificationListener(windowDimensionsDidChangeNotification, dimensions => {
			const newPosition = calculateCurrentDesiredTabBarPosition(dimensions.width);
			updateTabBarPositionIfNeeded(newPosition);
		}, [updateTabBarPositionIfNeeded]);

		return <View onLayout={rootViewOnLayoutCallback} style={[styles.root, {
			paddingLeft: safeAreaInsets.left,
			paddingRight: safeAreaInsets.right,
		}]}>
			{(() => {
				if (currentTabBarPosition === TabBarPosition.side) {
					return <View style={styles.sideBarHolder}>
						<SideTabBar />
					</View>
				}
			})()}
			<View style={styles.mainInterface}>
				<TabBarControllerContentView />
				{(() => {
					if (currentTabBarPosition === TabBarPosition.bottom) {
						return <BottomTabBar />
					}
				})()}
			</View>
		</View>
	}

})();


export default TabBarController;

