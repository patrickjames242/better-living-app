
import React, { useLayoutEffect, useRef } from 'react';
import { MenuListItem } from "../../MenuListViewScreen/MenuListView/helpers";
import { useNavigationScreenContext } from "../../../../helpers/NavigationController/NavigationScreen";
import MenuPresentableScreens from "../../MenuPresentableScreens";
import { StyleSheet, Animated } from "react-native";
import { CustomColors } from "../../../../helpers/colors";
import MealCreatorCheckBoxButton from './MealCreatorCheckBox';
import MealCreatorItemInfoBox from './MealCreatorItemInfoBox';
import { mapOptional } from '../../../../helpers/general';


export interface MealCreatorSelectionItemProps {
    isSelected: boolean,
    item: MenuListItem,
    onCheckMarkButtonPress: () => void,
}

const MealCreatorSelectionItem = (() => {

    const styles = StyleSheet.create({
        root: {
            flexDirection: 'row',
        },

    });

    const MealCreatorSelectionItem = (props: MealCreatorSelectionItemProps) => {

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

        return <Animated.View style={[styles.root, {
            backgroundColor: backgroundColor.current.interpolate({
                inputRange: [0, 1],
                outputRange: [CustomColors.themeGreen.withAdjustedOpacity(0).stringValue, CustomColors.themeGreen.withAdjustedOpacity(0.15).stringValue],
            }),
        }]}>
            <MealCreatorItemInfoBox item={props.item} onPress={onButtonPress} />
            <MealCreatorCheckBoxButton onPress={props.onCheckMarkButtonPress} isSelected={props.isSelected} />
        </Animated.View>
    }

    return MealCreatorSelectionItem;

})();

export default MealCreatorSelectionItem;









