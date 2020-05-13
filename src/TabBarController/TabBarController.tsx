

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { CustomColors } from '../helpers/colors';

import { Dimensions, View, SafeAreaView, StyleSheet, LayoutChangeEvent, ScaledSize } from 'react-native';
import LayoutConstants from '../LayoutConstants';
import SideTabBar from './TabBar/SideTabBar';
import BottomTabBar from './TabBar/BottomTabBar';
import { TabBarControllerContext, TabBarControllerContextValue, TabBarPosition, WindowDimensions, windowDimensionsDidChangeNotification } from './helpers';
import { TabBarSelection } from './TabBar/helpers';
import TabBarControllerContentView from './TabBarControllerContentView';
import { useSafeArea } from 'react-native-safe-area-context';
import { Optional } from '../helpers/general';
import { useNotificationListener } from '../helpers/Notification';

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

	function calculateCurrentDesiredTabBarPosition(screenWidth?: number): TabBarPosition {
		const windowWidth = screenWidth ?? Dimensions.get('window').width;
		if (windowWidth >= LayoutConstants.sideMenuBar.minWidthToShowSideBar) {
			return TabBarPosition.side;
		} else {
			return TabBarPosition.bottom;
		}
	}



	function useTabBarControllerContextState():
		[TabBarControllerContextValue,
			React.Dispatch<React.SetStateAction<TabBarControllerContextValue>>] {

		// because if useState sees a different value as its parameter after the first call, react starts complaining
		const initialScreenContextValue = useMemo<TabBarControllerContextValue>(() => {
			return {
				currentSelection: TabBarSelection.menu,
				currentTabBarPosition: calculateCurrentDesiredTabBarPosition(),
				setCurrentSelection,
			};
		}, []);

		const [tabBarControllerContextValue, setTabBarControllerContextValue] = useState(initialScreenContextValue);

		function setCurrentSelection(newSelection: TabBarSelection) {
			setTabBarControllerContextValue(oldState => {
				return { ...oldState, currentSelection: newSelection };
			});
		}

		return [tabBarControllerContextValue, setTabBarControllerContextValue];
	}

	function useSetUpWindowDimensionsObserver(){

		const latestWindowDimensions = useRef<Optional<WindowDimensions>>(null);

		const updateWindowDimensionsIfNeeded = (dimensions: WindowDimensions) => {
			const current = latestWindowDimensions.current
			if (current?.height !== dimensions.height || current?.width !== dimensions.width){
				latestWindowDimensions.current = dimensions;
				windowDimensionsDidChangeNotification.post(dimensions);
			}
		}

		useEffect(() => {
			const listenerType = 'change';
			const listener = (props: {window: ScaledSize}) => {
				updateWindowDimensionsIfNeeded(props.window);	
			}
			Dimensions.addEventListener(listenerType, listener);
			return () => Dimensions.removeEventListener(listenerType, listener);
		}, []);

		function rootViewOnLayoutCallback(event: LayoutChangeEvent){
			updateWindowDimensionsIfNeeded(event.nativeEvent.layout);
		}

		return {rootViewOnLayoutCallback};
	}

	return function () {

		const [tabBarControllerContextValue, setTabBarControllerContextValue] = useTabBarControllerContextState();

		const safeAreaInsets = useSafeArea();
		
		function updateTabBarPositionIfNeeded(newPosition: TabBarPosition){
			setTabBarControllerContextValue(oldState => {
				if (newPosition === oldState.currentTabBarPosition){return oldState;}
				return { ...oldState, currentTabBarPosition: newPosition };
			});
		}

		const { rootViewOnLayoutCallback } = useSetUpWindowDimensionsObserver();

		useNotificationListener(windowDimensionsDidChangeNotification, dimensions => {
			const newPosition = calculateCurrentDesiredTabBarPosition(dimensions.width);
			updateTabBarPositionIfNeeded(newPosition);
		});

		return <TabBarControllerContext.Provider value={tabBarControllerContextValue}>
			<View onLayout={rootViewOnLayoutCallback} style={[styles.root, {
				paddingLeft: safeAreaInsets.left,
				paddingRight: safeAreaInsets.right,	
			}]}>
				{(() => {
					if (tabBarControllerContextValue.currentTabBarPosition === TabBarPosition.side) {
						return <View style={styles.sideBarHolder}>
							<SideTabBar />
						</View>
					}
				})()}
				<View style={styles.mainInterface}>
					<TabBarControllerContentView/>
					{(() => {
						if (tabBarControllerContextValue.currentTabBarPosition === TabBarPosition.bottom) {
							return <BottomTabBar />
						}
					})()}
				</View>
			</View>
		</TabBarControllerContext.Provider>
	}

})();


export default TabBarController;


