
import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import MealCreatorSectionView from './ChildComponents/MealCreatorSection';
import { listData } from './helpers';
import LayoutConstants from '../../../LayoutConstants';
import Space from '../../../helpers/Spacers/Space';
import { CustomColors } from '../../../helpers/colors';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import CustomizedText from '../../../helpers/CustomizedText';
import { getShadowStyle } from '../../../helpers/general';
import { CustomFont } from '../../../helpers/fonts/fonts';

console.log("find a way to calculate what the bottom padding of the flat list should be to accomodate for the button");

const MealCreatorScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        flatList: {
            overflow: 'visible',
            zIndex: -1,
            
        },
        flatListContentContainer: {
            padding: LayoutConstants.pageSideInsets,
            paddingTop: LayoutConstants.floatingCellStyles.sectionSpacing,

            
            paddingBottom: 80,
        },
    });

    const MealCreatorScreen = () => {
        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Large Plate" />
            <FlatList
                ItemSeparatorComponent={() => <Space space={LayoutConstants.floatingCellStyles.sectionSpacing} />}
                contentContainerStyle={styles.flatListContentContainer}
                style={styles.flatList}
                data={listData}
                keyExtractor={item => item.title}
                renderItem={({ item }) => <MealCreatorSectionView section={item} />}
            />
            <AddToCartButton />
        </View>
    }

    return MealCreatorScreen;

})();

export default MealCreatorScreen;


console.warn("add a gradient at the bottom of this");


export interface AddToCartButtonProps {
    onPress?: () => void;
}

const AddToCartButton = (() => {

    const styles = StyleSheet.create({
        root: {
            position: 'absolute',
            bottom: 15, left: LayoutConstants.pageSideInsets, right: LayoutConstants.pageSideInsets,
        },
        contentView: {
            backgroundColor: CustomColors.themeGreen.stringValue,
            borderRadius: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 15,
            paddingLeft: 18,
            paddingRight: 18,
            ...getShadowStyle(10),
            // shadowColor: CustomColors.themeGreen.stringValue,
        },
        text: {
            color: 'white',
            fontSize: 16,
            fontFamily: CustomFont.bold,
        },
        
    });

    const AddToCartButton = (props: AddToCartButtonProps) => {
        return <BouncyButton style={styles.root} contentViewProps={{ style: styles.contentView }} onPress={props.onPress} bounceScaleValue={0.9}>
            <CustomizedText style={styles.text}>Add to Cart</CustomizedText>
            <CustomizedText style={styles.text}>$11:88</CustomizedText>
        </BouncyButton>

    }
    return AddToCartButton;
})();




