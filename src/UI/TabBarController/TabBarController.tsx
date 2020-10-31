

import React, { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import { CustomColors } from '../../helpers/colors';
import { View, StyleSheet } from 'react-native';
import SideTabBar from './TabBar/SideTabBar';
import BottomTabBar from './TabBar/BottomTabBar';
import { TabBarPosition, useSetUpWindowDimensionsObserver, calculateCurrentDesiredTabBarPosition, useWindowDimensionsNotificationListener, TabBarControllerContext, TabBarControllerContextValue, shouldPopTabBarControllerChildToTop } from './helpers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import store, { addSelectedStateListener, useDispatch, useSelector } from '../../redux/store';
import { changeTabBarPosition } from '../../redux/tabBarController';
import LogInPopUp, { LogInPopUpRef } from './LogInPopUp';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigationViewParams } from '../RootNavigationView/helpers';
import { customerSelections, employeeAndManagerSelections, getDefaultTabBarSelectionForUserObject, getInfoForTabBarSelection, TabBarSelection } from './tabBarSelectionsHelpers';
import createCustomTabBarNavigator from './CustomTabBarContentView';
import TodaysOrders from '../TodaysOrders/TodaysOrders';
import Menu from '../Menu/Menu';
import Cart from '../Cart/Cart';
import Tips from '../Tips/Tips';
import Inquiries from '../Inquiries/Inquiries';
import Settings from '../Settings/Settings';
import { UserType } from '../../api/authentication/validation';






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

	type TabNavigatorProps = {
		[TabBarSelection.todaysOrders]: undefined;
		[TabBarSelection.menu]: undefined;
		[TabBarSelection.cart]: undefined;
		[TabBarSelection.tips]: undefined;
		[TabBarSelection.inquiries]: undefined;
		[TabBarSelection.settings]: undefined;
	}

	const Tab = createCustomTabBarNavigator<TabNavigatorProps>();

	function getCurrentInitialRouteName() {
		const currentUser = store.getState().authentication?.userObject ?? null;
		return getDefaultTabBarSelectionForUserObject(currentUser);
	}

	function _CustomTabBarContentView() {

		const initialRouteName = useMemo(getCurrentInitialRouteName, []);

		return <Tab.Navigator initialRouteName={initialRouteName} >
			<Tab.Screen name={TabBarSelection.todaysOrders} component={TodaysOrders} />
			<Tab.Screen name={TabBarSelection.menu} component={Menu} />
			<Tab.Screen name={TabBarSelection.cart} component={Cart} />
			<Tab.Screen name={TabBarSelection.tips} component={Tips} />
			<Tab.Screen name={TabBarSelection.inquiries} component={Inquiries} />
			<Tab.Screen name={TabBarSelection.settings} component={Settings} />
		</Tab.Navigator>
	}

	const mainInterfaceKey: keyof RootNavigationViewParams = 'MainInterface';

	return function TabBarController(props: StackScreenProps<RootNavigationViewParams, 'MainInterface'>) {

		// console.log(props.navigation.dangerouslyGetState());

		const safeAreaInsets = useSafeAreaInsets();

		const logInPopUp = useRef<LogInPopUpRef>(null);

		const dispatch = useDispatch();
		const currentTabBarState = useSelector(state => state.tabBarController);

		const [currentTabBarSelection, setCurrentTabBarSelection] = useState(getCurrentInitialRouteName());

		// updates currentTabBarSelection state value when navigation state of the navigation object changes
		useEffect(() => {
			return props.navigation.addListener('state', event => {
				const tabBarState = event.data.state.routes.find(x => x.name === mainInterfaceKey)?.state;
				if (tabBarState && 'routeNames' in tabBarState) {
					const newSelection = (tabBarState.routeNames as string[])[tabBarState.index!] as TabBarSelection;
					setCurrentTabBarSelection(newSelection);
				}
			});
		}, [props.navigation]);

		const changeTab = useCallback((selection: TabBarSelection) => {
			const tabBarSelectionInfo = getInfoForTabBarSelection(selection);
			if (store.getState().authentication == null && tabBarSelectionInfo.requiresAuthentication) {
				logInPopUp.current?.present();
			} else if (currentTabBarSelection === selection){
				shouldPopTabBarControllerChildToTop.post(selection);
			} else  {
				props.navigation.navigate(mainInterfaceKey, {
					screen: selection,
				} as any);
			}
		}, [currentTabBarSelection, props.navigation]);

		useEffect(() => {
			return addSelectedStateListener(state => state.authentication, authentication => {

				const selectionsForCurrentUser = (() => {
					switch (authentication?.userObject.userType) {
						case UserType.manager:
						case UserType.employee:
							return employeeAndManagerSelections;
						case UserType.customer:
						default:
							return customerSelections;
					}
				})();

				// changes the current screen if it is unavailable for the current user, when the user logs in or out.

				if (
					selectionsForCurrentUser.includes(currentTabBarSelection) === false ||
					(
						authentication == null &&
						getInfoForTabBarSelection(currentTabBarSelection).requiresAuthentication
					)
				) {
					changeTab(getDefaultTabBarSelectionForUserObject(authentication?.userObject ?? null));
				}
			});
		}, [changeTab, currentTabBarSelection, props.navigation]);

		
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
			presentLogInSignUpPopUp: () => { logInPopUp.current?.present() },
			currentTabBarSelection: currentTabBarSelection,
			changeTabBarSelection: changeTab,
		}), [currentTabBarSelection, changeTab, props.navigation]);

		return <TabBarControllerContext.Provider value={tabBarControllerContextValue}>
			<View onLayout={rootViewOnLayoutCallback} style={[styles.root, {
				paddingLeft: safeAreaInsets.left,
				paddingRight: safeAreaInsets.right,
			}]}>
				{(() => {
					if (currentTabBarState.tabBarPosition === TabBarPosition.side) {
						return <View style={styles.sideBarHolder}>
							<SideTabBar selectedTab={currentTabBarSelection} onTabPress={changeTab} />
						</View>
					}
				})()}
				<View style={styles.mainInterface}>
					<_CustomTabBarContentView />
					{(() => {
						if (currentTabBarState.tabBarPosition === TabBarPosition.bottom) {
							return <BottomTabBar selectedTab={currentTabBarSelection} onTabPress={changeTab} />
						}
					})()}
				</View>
				<LogInPopUp ref={logInPopUp} />
			</View>
		</TabBarControllerContext.Provider>
	}
})();


export default TabBarController;

