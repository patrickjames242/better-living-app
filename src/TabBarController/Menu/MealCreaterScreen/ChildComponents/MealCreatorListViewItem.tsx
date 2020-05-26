
import React, { useLayoutEffect, useRef } from 'react';
import { MenuListItem } from "../../MenuListViewScreen/MenuListView/helpers";
import { useNavigationScreenContext } from "../../../../helpers/NavigationController/NavigationScreen";
import MenuPresentableScreens from "../../MenuPresentableScreens";
import { StyleSheet, Animated, View } from "react-native";
import { CustomColors } from "../../../../helpers/colors";
import MealCreatorCheckBoxButton from './MealCreatorCheckBox';
import MealCreatorListViewItemInfoBox from './MealCreatorListViewItemInfoBox';
import { mapOptional } from '../../../../helpers/general';
import LayoutConstants from '../../../../LayoutConstants';


export interface MealCreatorListViewItemProps {
    isSelected: boolean,
    isFirstInSection: boolean,
    isLastInSection: boolean,
    item: MenuListItem,
    onCheckMarkButtonPress: () => void,
}

const MealCreatorListViewItem = (() => {

    const styles = StyleSheet.create({
        root: {
            flexDirection: 'row',
            backgroundColor: 'white',
            overflow: 'hidden',
        },
        backgroundSelectionView: {
            ...StyleSheet.absoluteFillObject
        },
    });

    const MealCreatorListViewItem = (props: MealCreatorListViewItemProps) => {

        const navigationScreenContext = useNavigationScreenContext();

        function onButtonPress() {
            mapOptional(MenuPresentableScreens.MenuItemDetailScreen(), X => {
                navigationScreenContext.present(<X />)
            });
        }

        // 0 is translucent, 1 is green
        const backgroundColor = useRef(new Animated.Value(props.isSelected ? 1 : 0));

        useLayoutEffect(() => {

            Animated.timing(backgroundColor.current, {
                toValue: props.isSelected ? 1 : 0,
                duration: 150,
            }).start();

        }, [props.isSelected]);

        return <View style={[styles.root, {
            borderTopLeftRadius: props.isFirstInSection ? LayoutConstants.floatingCellStyles.borderRadius : 0,
            borderTopRightRadius: props.isFirstInSection ? LayoutConstants.floatingCellStyles.borderRadius : 0,
            borderBottomLeftRadius: props.isLastInSection ? LayoutConstants.floatingCellStyles.borderRadius : 0,
            borderBottomRightRadius: props.isLastInSection ? LayoutConstants.floatingCellStyles.borderRadius : 0,
        }]}>
            <Animated.View style={[styles.backgroundSelectionView, {
                backgroundColor: backgroundColor.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [CustomColors.themeGreen.withAdjustedOpacity(0).stringValue, CustomColors.themeGreen.withAdjustedOpacity(0.15).stringValue],
                }),
            }]} />
            <MealCreatorListViewItemInfoBox item={props.item} onPress={onButtonPress} />
            <MealCreatorCheckBoxButton onPress={props.onCheckMarkButtonPress} isSelected={props.isSelected} />
        </View>
    }

    return MealCreatorListViewItem;

})();

export default MealCreatorListViewItem;









