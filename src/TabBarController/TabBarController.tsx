

import React, { useCallback, useRef } from 'react';
import { CustomColors } from '../helpers/colors';
import { View, StyleSheet} from 'react-native';
import SideTabBar from './TabBar/SideTabBar';
import BottomTabBar from './TabBar/BottomTabBar';
import {TabBarPosition, windowDimensionsDidChangeNotification, useSetUpWindowDimensionsObserver, calculateCurrentDesiredTabBarPosition } from './helpers';
import TabBarControllerContentView from './TabBarControllerContentView';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNotificationListener } from '../helpers/Notification';
import { useDispatch, useSelector } from '../redux/store';
import { changeTabBarPosition, changeCurrentSelection } from '../redux/tabBarController';
import LogInPopUp, { LogInPopUpRef } from './LogInPopUp';
import { TabBarSelection } from './TabBar/helpers';



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

		const logInPopUp = useRef<LogInPopUpRef>(null);

		const dispatch = useDispatch();
		const currentTabBarState = useSelector(state => state.tabBarController);

		const onTabPressed = useCallback((selection: TabBarSelection) => {
			if ([TabBarSelection.cart, TabBarSelection.settings].includes(selection)){
				logInPopUp.current?.present();
			} else {
				dispatch(changeCurrentSelection(selection));
			}
		}, [dispatch]);

		const updateTabBarPositionIfNeeded = useCallback((newPosition: TabBarPosition) => {
			if (currentTabBarState.tabBarPosition !== newPosition){
				dispatch(changeTabBarPosition(newPosition));
			}
		}, [currentTabBarState.tabBarPosition, dispatch]);

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
				if (currentTabBarState.tabBarPosition === TabBarPosition.side) {
					return <View style={styles.sideBarHolder}>
						<SideTabBar selectedTab={currentTabBarState.currentSelection} onTabPress={onTabPressed} />
					</View>
				}
			})()}
			<View style={styles.mainInterface}>
				<TabBarControllerContentView />
				{(() => {
					if (currentTabBarState.tabBarPosition === TabBarPosition.bottom) {
						return <BottomTabBar selectedTab={currentTabBarState.currentSelection} onTabPress={onTabPressed} />
					}
				})()}
			</View>
			<LogInPopUp ref={logInPopUp} />
		</View>
	}
})();


export default TabBarController;

