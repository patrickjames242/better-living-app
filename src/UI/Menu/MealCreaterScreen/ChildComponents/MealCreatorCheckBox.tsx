
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MealCreatorConstants from '../MealCreatorConstants';
import CheckMarkButton from '../../../../helpers/Buttons/CheckMarkButton/CheckMarkButton';


const MealCreatorCheckBoxButton = (() => {

    const styles = StyleSheet.create({
        root: {
            padding: MealCreatorConstants.foodSections.contentViewPadding,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    const MealCreatorCheckBoxButton = (props: { onPress: () => void, isSelected: boolean }) => {
        const touchPadding = MealCreatorConstants.foodSections.contentViewPadding;
        return <View style={styles.root}>
            <CheckMarkButton
                isSelected={props.isSelected}
                onPress={props.onPress}
                hitSlop={{ left: touchPadding, right: touchPadding, top: touchPadding, bottom: touchPadding }}
            />
        </View>
    }

    return MealCreatorCheckBoxButton;
})();


export default MealCreatorCheckBoxButton;

