
import React from 'react';
import { MenuListItem } from "../../MenuListViewScreen/MenuListView/helpers";
import LayoutConstants from "../../../../LayoutConstants";
import { getShadowStyle } from "../../../../helpers/general";
import { CustomFont } from "../../../../helpers/fonts/fonts";
import BouncyButton from "../../../../helpers/Buttons/BouncyButton";
import Spacer from "../../../../helpers/Spacers/Spacer";
import AspectRatioView from "../../../../helpers/AspectRatioView";
import CustomizedText from "../../../../helpers/CustomizedText";
import {StyleSheet, Image} from 'react-native';


export interface MealCreatorItemInfoBoxProps {
    item: MenuListItem,
    onPress: () => void,
}


const MealCreatorItemInfoBox = (() => {

    const imageBorderRadius = 8;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            paddingLeft: LayoutConstants.floatingCellStyles.padding,
            paddingTop: LayoutConstants.floatingCellStyles.padding,
            paddingBottom: LayoutConstants.floatingCellStyles.padding,
            
            alignItems: 'flex-start',
        },
        contentView: {
            flexDirection: 'row',
            alignItems: 'center',
            
        },
        imageHolder: {
            width: 80,
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
            fontSize: 16,
        },
    });

    const MealCreatorItemInfoBox = (props: MealCreatorItemInfoBoxProps) => {
        return <BouncyButton style={styles.root} bounceScaleValue={0.9} onPress={props.onPress} contentViewProps={{style: styles.contentView}}>
            <Spacer space={LayoutConstants.floatingCellStyles.padding}>
                <AspectRatioView style={styles.imageHolder} heightPercentageOfWidth={LayoutConstants.productImageHeightPercentageOfWidth}>
                    <Image style={styles.image} source={props.item.imageSource} resizeMode="cover" />
                </AspectRatioView>
                <CustomizedText style={styles.titleText}>{props.item.name}</CustomizedText>
            </Spacer>
        </BouncyButton>
    }
    return MealCreatorItemInfoBox;
})();


export default MealCreatorItemInfoBox;

