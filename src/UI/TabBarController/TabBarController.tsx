

import React, { useCallback, useRef, useEffect, useMemo, useState } from 'react';
import { CustomColors } from '../../helpers/colors';
import { View, StyleSheet } from 'react-native';
import SideTabBar from './TabBar/SideTabBar';
import BottomTabBar from './TabBar/BottomTabBar';
import { TabBarPosition, useSetUpWindowDimensionsObserver, calculateCurrentDesiredTabBarPosition, useWindowDimensionsNotificationListener, TabBarControllerContext, TabBarControllerContextValue } from './helpers';
import TabBarControllerContentView from './TabBarControllerContentView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector, addSelectedStateListener } from '../../redux/store';
import { changeTabBarPosition } from '../../redux/tabBarController';
import LogInPopUp, { LogInPopUpRef } from './LogInPopUp';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigationViewParams } from '../RootNavigationView/helpers';
import { getInfoForTabBarSelection, TabBarSelection, useDefaultTabBarSelectionForCurrentUser } from './tabBarSelectionsHelpers';



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
		const defaultTabBarSelection = useDefaultTabBarSelectionForCurrentUser();

		// eslint-disable-next-line react-hooks/exhaustive-deps
		const initialCurrentTabBarSelection = useMemo(() => defaultTabBarSelection, []);

		const [currentTabBarSelection, setCurrentTabBarSelection] = useState(initialCurrentTabBarSelection);

		useEffect(() => {
			return addSelectedStateListener(state => state.authentication == null, isUserLoggedOut => {
				if (isUserLoggedOut === true && currentTabBarSelection) {
					setCurrentTabBarSelection(defaultTabBarSelection);
				}
			});
		}, [currentTabBarSelection, defaultTabBarSelection]);

		const onTabPressed = useCallback((selection: TabBarSelection) => {
			const tabBarSelectionInfo = getInfoForTabBarSelection(selection);
			if (authentication == null && tabBarSelectionInfo.requiresAuthentication) {
				logInPopUp.current?.present();
			} else {
				setCurrentTabBarSelection(selection);
			}
		}, [authentication]);

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
			presentLogInSignUpPopUp: () => {logInPopUp.current?.present()},
			currentTabBarSelection: currentTabBarSelection,
			changeTabBarSelection: setCurrentTabBarSelection,
		}), [currentTabBarSelection, props.navigation]);

		return <TabBarControllerContext.Provider value={tabBarControllerContextValue}>
			<View onLayout={rootViewOnLayoutCallback} style={[styles.root, {
				paddingLeft: safeAreaInsets.left,
				paddingRight: safeAreaInsets.right,
			}]}>
				{(() => {
					if (currentTabBarState.tabBarPosition === TabBarPosition.side) {
						return <View style={styles.sideBarHolder}>
							<SideTabBar selectedTab={currentTabBarSelection} onTabPress={onTabPressed} />
						</View>
					}
				})()}
				<View style={styles.mainInterface}>
					<TabBarControllerContentView />
					{(() => {
						if (currentTabBarState.tabBarPosition === TabBarPosition.bottom) {
							return <BottomTabBar selectedTab={currentTabBarSelection} onTabPress={onTabPressed} />
						}
					})()}
				</View>
				<LogInPopUp ref={logInPopUp} />
			</View>
		</TabBarControllerContext.Provider>


	}
})();


export default TabBarController;

