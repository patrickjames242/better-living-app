
import React, { useLayoutEffect, useRef, useState} from 'react';
import { MenuListItem } from "../../MenuListViewScreen/MenuListView/helpers";
import { useNavigationScreenContext } from "../../../../helpers/NavigationController/NavigationScreen";
import PresentableScreens from "../../../../PresentableScreens";
import { StyleSheet, Animated, View } from "react-native";
import { CustomColors } from "../../../../helpers/colors";
import MealCreatorCheckBoxButton from './MealCreatorCheckBox';
import MealCreatorListViewItemInfoBox from './MealCreatorListViewItemInfoBox';
import { mapOptional, Optional } from '../../../../helpers/general';
import ValueBox from '../../../../helpers/ValueBox';



export interface MealCreatorListViewItemProps {
    // the number is the id of the item,
    sectionSelectionValue: ValueBox<Optional<number>>,
    item: MenuListItem,
}

const MealCreatorListViewItem = (() => {

    const styles = StyleSheet.create({
        root: {
            flexDirection: 'row',
        },
        backgroundSelectionView: {
            ...StyleSheet.absoluteFillObject
        },
    });

    const MealCreatorListViewItem = (props: MealCreatorListViewItemProps) => {

        const navigationScreenContext = useNavigationScreenContext();

        function onButtonPress() {
            mapOptional(PresentableScreens.MenuItemDetailScreen(), X => {
                navigationScreenContext.present(<X />)
            });
        }

        const [shouldBeSelected, setShouldBeSelected] = useState(false);
    
        // 0 is translucent, 1 is green
        const backgroundColor = useRef(new Animated.Value(shouldBeSelected ? 1 : 0));


        //i'm observing the value because depending on props for selectionState is too slow, because all cells in the list would have to be rerendered.
        useLayoutEffect(() => {
            const listener = (newValue: Optional<number>) => {
                const _shouldBeSelected = newValue === props.item.id;
                setShouldBeSelected(_shouldBeSelected);
            }
            listener(props.sectionSelectionValue.value);
            return props.sectionSelectionValue.observer.addListener(listener);
        }, [props.item.id, props.sectionSelectionValue.observer, props.sectionSelectionValue.value]);

        useLayoutEffect(() => {
            Animated.timing(backgroundColor.current, {
                toValue: shouldBeSelected ? 1 : 0,
                duration: 150,
            }).start();
        }, [shouldBeSelected]);

        return <View style={styles.root}>
            <Animated.View style={[styles.backgroundSelectionView, {
                backgroundColor: backgroundColor.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [CustomColors.themeGreen.withAdjustedOpacity(0).stringValue, CustomColors.themeGreen.withAdjustedOpacity(0.15).stringValue],
                }),
            }]} />
            <MealCreatorListViewItemInfoBox item={props.item} onPress={onButtonPress} />
            <MealCreatorCheckBoxButton onPress={() => {props.sectionSelectionValue.value = props.item.id}} isSelected={shouldBeSelected} />
        </View>
    }

    return MealCreatorListViewItem;

})();

export default MealCreatorListViewItem;









