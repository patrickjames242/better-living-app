
import React from 'react';
import { MenuListItem } from "../../MenuListViewScreen/MenuListView/helpers";
import { useNavigationScreenContext } from "../../../../helpers/NavigationController/NavigationScreen";
import MenuPresentableScreens from "../../MenuPresentableScreens";
import { View, StyleSheet } from "react-native";
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

        return <View style={[styles.root, {
            backgroundColor: props.isSelected ? CustomColors.themeGreen.withAdjustedOpacity(0.15).stringValue : undefined
        }]}>
            <MealCreatorItemInfoBox item={props.item} onPress={onButtonPress} />
            <MealCreatorCheckBoxButton onPress={props.onCheckMarkButtonPress} isSelected={props.isSelected} />
        </View>
    }

    return MealCreatorSelectionItem;

})();

export default MealCreatorSelectionItem;









