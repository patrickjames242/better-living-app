

import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import { CustomColors } from '../../helpers/colors';
import { View, StyleSheet } from 'react-native';
import SideTabBar from './TabBar/SideTabBar';
import BottomTabBar from './TabBar/BottomTabBar';
import { TabBarPosition, useSetUpWindowDimensionsObserver, calculateCurrentDesiredTabBarPosition, useWindowDimensionsNotificationListener, TabBarControllerContext, TabBarControllerContextValue } from './helpers';
import TabBarControllerContentView from './TabBarControllerContentView';
import { useSafeArea, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector, addSelectedStateListener } from '../../redux/store';
import { changeTabBarPosition, changeCurrentSelection } from '../../redux/tabBarController';
import LogInPopUp, { LogInPopUpRef } from './LogInPopUp';
import { TabBarSelection } from './TabBar/helpers';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigationViewParams } from '../RootNavigationView/helpers';



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

	return function TabBarController(props: StackScreenProps<RootNavigationViewParams, 'MainInterface'>) {


		const safeAreaInsets = useSafeAreaInsets();

		const logInPopUp = useRef<LogInPopUpRef>(null);

		const dispatch = useDispatch();
		const currentTabBarState = useSelector(state => state.tabBarController);
		const authentication = useSelector(state => state.authentication);

		const screensThatRequireUserLoggedIn = [TabBarSelection.cart, TabBarSelection.settings];

		useEffect(() => {
			return addSelectedStateListener(state => state.authentication == null, isUserLoggedOut => {
				if (isUserLoggedOut === true && screensThatRequireUserLoggedIn.includes(currentTabBarState.currentSelection)) {
					dispatch(changeCurrentSelection(TabBarSelection.menu));
				}
			});
		}, [currentTabBarState.currentSelection, dispatch, screensThatRequireUserLoggedIn]);

		const onTabPressed = useCallback((selection: TabBarSelection) => {
			if (authentication == null && [TabBarSelection.cart, TabBarSelection.settings].includes(selection)) {
				logInPopUp.current?.present();
			} else {
				dispatch(changeCurrentSelection(selection));
			}
		}, [authentication, dispatch]);

		const updateTabBarPositionIfNeeded = useCallback((newPosition: TabBarPosition) => {
			if (currentTabBarState.tabBarPosition !== newPosition) {
				dispatch(changeTabBarPosition(newPosition));
			}
		}, [currentTabBarState.tabBarPosition, dispatch]);

		const { rootViewOnLayoutCallback } = useSetUpWindowDimensionsObserver();

		useWindowDimensionsNotificationListener(dimensions => {
			const newPosition = calculateCurrentDesiredTabBarPosition(dimensions.width);
			updateTabBarPositionIfNeeded(newPosition);
		}, [updateTabBarPositionIfNeeded]);

		const tabBarControllerContextValue: TabBarControllerContextValue = useMemo(() => ({
			navigation: props.navigation,
			presentLogInSignUpPopUp: () => {logInPopUp.current?.present()}
		}), [props.navigation])

		return <TabBarControllerContext.Provider value={tabBarControllerContextValue}>
			<View onLayout={rootViewOnLayoutCallback} style={[styles.root, {
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
		</TabBarControllerContext.Provider>


	}
})();


export default TabBarController;

