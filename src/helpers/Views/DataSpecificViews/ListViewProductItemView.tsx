
import React from 'react';
import { getShadowStyle } from "../../general";
import { CustomFont } from "../../fonts/fonts";
import BouncyButton from "../../Buttons/BouncyButton";
import Spacer from "../../Spacers/Spacer";
import CustomizedText from "../CustomizedText";
import {StyleSheet, ViewProps} from 'react-native';
import MealCreatorConstants from '../../../UI/Menu/MealCreaterScreen/MealCreatorConstants';
import Product from '../../../api/orderingSystem/products/Product';
import ProductImageThumbnailView from './ProductImageThumbnailView';


export interface ListViewProductItemViewProps extends ViewProps {
    item: Product,
    onPress?: () => void,
}


const ListViewProductItemView = (() => {


    const styles = StyleSheet.create({
        root: {
            alignItems: 'flex-start',
        },
        contentView: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        
        titleText: {
            fontFamily: CustomFont.medium,
            fontSize: MealCreatorConstants.foodSections.rowTitleFontSize,
            flexShrink: 1,
        },
    });

    const ListViewProductItemView = (props: ListViewProductItemViewProps) => {
        return <BouncyButton {...props} style={[styles.root, props.style]} bounceScaleValue={0.9} onPress={props.onPress} contentViewProps={{style: styles.contentView}}>
            <Spacer space={MealCreatorConstants.foodSections.contentViewPadding}>
                <ProductImageThumbnailView imageUrl={props.item.imageUrl}/>
                <CustomizedText style={styles.titleText} numberOfLines={2}>{props.item.title}</CustomizedText>
            </Spacer>
        </BouncyButton>
    }
    return React.memo(ListViewProductItemView);
})();


export default ListViewProductItemView;

