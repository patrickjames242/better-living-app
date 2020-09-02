
import React, { useCallback, useMemo, useState } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { tabBarItemsData, TabBarSelection } from './helpers';
import BouncyButton from '../../helpers/Buttons/BouncyButton';
import { CustomColors } from '../../helpers/colors';
import LayoutConstants from '../../LayoutConstants';
import { windowDimensionsDidChangeNotification, WindowDimensions } from '../helpers';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNotificationListener } from '../../helpers/Notification';


interface SideTabBarProps{
	selectedTab: TabBarSelection;
	onTabPress: (selection: TabBarSelection) => void;
}


const SideTabBar = (() => {

	const styles = StyleSheet.create({
		root: {
			flex: 1,
			// backgroundColor: CustomColors.mainBackgroundColor.stringValue,
		},
		scrollView: {
			height: 200,
		},

		scrollViewContentView: {
			padding: LayoutConstants.sideMenuBar.padding,
			
		}
	});

	const marginSizes = {
		tallScreen: 30,
		shortScreen: 20,
	}

	function useItemMarginSize() {

		const getMarginSize = useCallback((dimensions: WindowDimensions) => {
			return dimensions.height > 500 ? marginSizes.tallScreen : marginSizes.shortScreen
		}, []);

		// eslint-disable-next-line react-hooks/exhaustive-deps
		const initialItemMarginSize = useMemo(() => getMarginSize(Dimensions.get('window')), [])

		const [itemMarginSize, setItemMarginSize] = useState(initialItemMarginSize);

		useNotificationListener(windowDimensionsDidChangeNotification, dimensions => {
			setItemMarginSize(getMarginSize(dimensions));
		});

		return itemMarginSize;
	}


	return function SideTabBar(props: SideTabBarProps) {
		const safeAreaInsets = useSafeArea();

		const itemMarginSize = useItemMarginSize();

		return <View style={styles.root}>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[styles.scrollViewContentView, {
					paddingTop: safeAreaInsets.top + LayoutConstants.sideMenuBar.padding
				}]}>
				{(() => {
					return tabBarItemsData.map((item, index) => {
						return <SideBarItem
							marginSize={itemMarginSize}
							isSelected={props.selectedTab === item.selection}
							onPress={() => props.onTabPress(item.selection)}
							key={index}
							imageSource={item.url}
							isFirstInList={index === 0} 
						/>
					})
				})()}
			</ScrollView>
		</View>

	}

})();


export default SideTabBar;


interface SideTabBarItemProps {
	imageSource: any,
	isSelected: boolean,
	onPress: () => void,
	isFirstInList?: boolean,
	marginSize: number,
}

const SideBarItem = (() => {

	const styles = StyleSheet.create({
		root: {
			
		},
		contentView: {
			padding: LayoutConstants.sideMenuBar.barItem.padding,
			borderRadius: 15,
			alignSelf: 'flex-start',
			shadowRadius: 25,
			elevation: 1,
		},
		image: {
			width: LayoutConstants.sideMenuBar.barItem.imageSize,
			height: LayoutConstants.sideMenuBar.barItem.imageSize,
		}
	});

	return function SideBarItem(props: SideTabBarItemProps) {
		return <BouncyButton
			onPress={props.onPress}
			bounceScaleValue={0.8}
			contentViewProps={{
				style: [styles.contentView, {
					marginTop: (props.isFirstInList ?? false) ? undefined : props.marginSize,
					backgroundColor: props.isSelected ? CustomColors.themeGreen.stringValue : 'white',
					shadowColor: props.isSelected ? CustomColors.themeGreen.stringValue : 'black',
					shadowOpacity: props.isSelected ? 0.5 : 0.05,
				}]
			}}
			>
			<Image source={props.imageSource} style={[styles.image, {
				tintColor: props.isSelected ? 'white' : CustomColors.themeGreen.stringValue,
			}]} />
		</BouncyButton>
	}

})();

