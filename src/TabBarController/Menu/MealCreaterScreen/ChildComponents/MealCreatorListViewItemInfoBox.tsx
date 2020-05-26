
import React from 'react';
import { MenuListItem } from "../../MenuListViewScreen/MenuListView/helpers";
import { getShadowStyle } from "../../../../helpers/general";
import { CustomFont } from "../../../../helpers/fonts/fonts";
import BouncyButton from "../../../../helpers/Buttons/BouncyButton";
import Spacer from "../../../../helpers/Spacers/Spacer";
import AspectRatioView from "../../../../helpers/AspectRatioView";
import CustomizedText from "../../../../helpers/CustomizedText";
import {StyleSheet, Image} from 'react-native';
import MealCreatorConstants from '../MealCreatorConstants';


export interface MealCreatorListViewItemInfoBoxProps {
    item: MenuListItem,
    onPress: () => void,
}


const MealCreatorListViewItemInfoBox = (() => {

    const imageBorderRadius = 8;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            paddingLeft: MealCreatorConstants.foodSections.contentViewPadding,
            paddingTop: MealCreatorConstants.foodSections.contentViewPadding,
            paddingBottom: MealCreatorConstants.foodSections.contentViewPadding,
            alignItems: 'flex-start',
        },
        contentView: {
            flexDirection: 'row',
            alignItems: 'center',
            
        },
        imageHolder: {
            width: MealCreatorConstants.foodSections.imageWidth,
            ...getShadowStyle(10),
            backgroundColor: 'white',
            borderRadius: imageBorderRadius,
        },
        image: {
            width: '100%',
            height: '100%',
            borderRadius: imageBorderRadius,
        },
        titleText: {
            fontFamily: CustomFont.medium,
            fontSize: MealCreatorConstants.foodSections.rowTitleFontSize,
        },
    });

    const MealCreatorListViewItemInfoBox = (props: MealCreatorListViewItemInfoBoxProps) => {
        return <BouncyButton style={styles.root} bounceScaleValue={0.9} onPress={props.onPress} contentViewProps={{style: styles.contentView}}>
            <Spacer space={MealCreatorConstants.foodSections.contentViewPadding}>
                <AspectRatioView style={styles.imageHolder} heightPercentageOfWidth={MealCreatorConstants.foodSections.imageHeightPercentageOfWidth}>
                    <Image style={styles.image} source={props.item.imageSource} resizeMode="cover" />
                </AspectRatioView>
                <CustomizedText style={styles.titleText}>{props.item.name}</CustomizedText>
            </Spacer>
        </BouncyButton>
    }
    return MealCreatorListViewItemInfoBox;
})();


export default MealCreatorListViewItemInfoBox;

