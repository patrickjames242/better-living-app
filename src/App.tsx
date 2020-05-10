
import React, { useState, useEffect, useMemo } from 'react';
import { View, StatusBar, StyleSheet, Image, Dimensions, ScaledSize, SafeAreaView } from 'react-native';

import { registerRootComponent, AppLoading } from 'expo';
import TabBar, { tabBarItemsData, TabBarSelection } from './TabBar/TabBar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CustomColors } from './helpers/colors';
import { loadFonts } from './helpers/fonts/fonts';
import TopBar from './TopBar/TopBar';
import MenuListView from './MenuListView/MenuListView';
import BouncyButton from './helpers/BouncyButton';

registerRootComponent(App);

export default function App() {

	const [appIsReady, setAppIsReady] = useState(false);

	useEffect(() => {
		loadFonts().then(() => setAppIsReady(true));
	}, [])

	if (appIsReady === false) {
		return <AppLoading />
	} else {
		return <SafeAreaProvider>
			<StatusBar barStyle="dark-content" />
			<Screen />
		</SafeAreaProvider>
	}
}

const Screen = (() => {

	const styles = StyleSheet.create({
		root: {
			flex: 1,
			backgroundColor: CustomColors.mainBackgroundColor.stringValue,
			flexDirection: 'row',
		},
		sideBarHolder: {

		},
		mainInterface: {
			flex: 1,
		},
		mainInterfaceContentView: {
			zIndex: -1,
			flex: 1,
			height: 1,
		},
	});

	function getCurrentShouldShowSideBarValue(): boolean {
		const windowWidth = Dimensions.get('window').width;
		return windowWidth > 800;
	}

	return function () {

		const initial_shouldShowSideBar = useMemo(() => getCurrentShouldShowSideBarValue(), []);
		const [shouldShowSideBar, setShouldShowSideBar] = useState(initial_shouldShowSideBar);

		useEffect(() => {
			const listenerType = 'change';
			const listener = () => {
				console.log()
				setShouldShowSideBar(getCurrentShouldShowSideBarValue());
			}
			Dimensions.addEventListener(listenerType, listener);
			return () => Dimensions.removeEventListener(listenerType, listener);
		}, []);

		return <View style={styles.root}>
			{(() => {
				if (shouldShowSideBar) {
					return <SafeAreaView style={styles.sideBarHolder}>
						<SideBar />
					</SafeAreaView>
				}
			})()}

			<View style={styles.mainInterface}>
				<TopBar />
				<View style={styles.mainInterfaceContentView}>
					<MenuListView />
				</View>
				{(() => {
					if (shouldShowSideBar === false){
						return <TabBar />
					}
				})()}
				
			</View>
		</View>
	}

})();


const SideBar = (() => {

	const styles = StyleSheet.create({
		root: {
			padding: 30,
			flex: 1,
		},
	});

	return function () {

		const [selectedItem, setSelectedItem] = useState(TabBarSelection.menu);

		return <View style={styles.root}>
			{(() => {
				return tabBarItemsData.map((item, index) => {
					return <SideBarItem
						isSelected={selectedItem === item.selection}
						onPress={() => setSelectedItem(item.selection)}
						key={index}
						imageSource={item.url}
						isFirstInList={index === 0} />
				})
			})()}
		</View>
	}

})();





interface SideBarItemProps {
	imageSource: any,
	isSelected: boolean,
	onPress: () => void,
	isFirstInList?: boolean
}

const SideBarItem = (() => {

	const styles = StyleSheet.create({
		root: {
			padding: 15,
			borderRadius: 15,
			shadowRadius: 25,
			elevation: 1,
		},
		image: {
			width: 30,
			height: 30,
		}
	});

	return function (props: SideBarItemProps) {
		return <BouncyButton
			onPress={props.onPress}
			bounceScaleValue={0.8}
			style={[styles.root, {
				marginTop: (props.isFirstInList ?? false) ? undefined : 30,
				backgroundColor: props.isSelected ? CustomColors.themeGreen.stringValue : 'white',
				shadowColor: props.isSelected ? CustomColors.themeGreen.stringValue : 'black',
				shadowOpacity: props.isSelected ? 0.5 : 0.05,
			}]}>
			<Image source={props.imageSource} style={[styles.image, {
				tintColor: props.isSelected ? 'white' : CustomColors.themeGreen.stringValue,
			}]} />
		</BouncyButton>
	}

})();
