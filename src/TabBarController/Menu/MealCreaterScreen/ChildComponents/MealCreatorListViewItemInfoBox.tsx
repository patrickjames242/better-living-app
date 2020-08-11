
import React from 'react';
import { getShadowStyle } from "../../../../helpers/general";
import { CustomFont } from "../../../../helpers/fonts/fonts";
import BouncyButton from "../../../../helpers/Buttons/BouncyButton";
import Spacer from "../../../../helpers/Spacers/Spacer";
import AspectRatioView from "../../../../helpers/Views/AspectRatioView";
import CustomizedText from "../../../../helpers/Views/CustomizedText";
import {StyleSheet, Image, ViewProps} from 'react-native';
import MealCreatorConstants from '../MealCreatorConstants';
import Product from '../../../../api/orderingSystem/products/Product';
import LayoutConstants from '../../../../LayoutConstants';


export interface ListViewProductItemViewProps extends ViewProps {
    item: Product,
    onPress: () => void,
}


const ListViewProductItemView = (() => {

    const imageBorderRadius = 8;

    const styles = StyleSheet.create({
        root: {
            flex: 1,
            padding: LayoutConstants.floatingCellStyles.padding,
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

    const MealCreatorListViewItemInfoBox = (props: ListViewProductItemViewProps) => {
        return <BouncyButton {...props} style={[styles.root, props.style]} bounceScaleValue={0.9} onPress={props.onPress} contentViewProps={{style: styles.contentView}}>
            <Spacer space={MealCreatorConstants.foodSections.contentViewPadding}>
                <AspectRatioView style={styles.imageHolder} heightPercentageOfWidth={MealCreatorConstants.foodSections.imageHeightPercentageOfWidth}>
                    {props.item.imageUrl &&
                        <Image style={styles.image} source={{uri: props.item.imageUrl}} resizeMode="cover" />}
                </AspectRatioView>
                <CustomizedText style={styles.titleText}>{props.item.title}</CustomizedText>
            </Spacer>
        </BouncyButton>
    }
    return MealCreatorListViewItemInfoBox;
})();


export default ListViewProductItemView;

