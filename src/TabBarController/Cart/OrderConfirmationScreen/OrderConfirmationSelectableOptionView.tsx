
import React from 'react';
import {StyleSheet, Image} from 'react-native';
import LayoutConstants from '../../../LayoutConstants';
import OrderConfirmationLayoutConstants from './OrderConfirmationLayoutConstants';
import { CustomFont } from '../../../helpers/fonts/fonts';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import CheckMarkButton from '../../../helpers/Buttons/CheckMarkButton/CheckMarkButton';



interface OrderConfirmationSelectableOptionViewProps {
    isSelected?: boolean;
    imageSource: any;
    title: string;
    onCheckMarkPressed?: () => void;
}

const OrderConfirmationSelectableOptionView = (() => {

    const styles = StyleSheet.create({
        root: {
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            padding: LayoutConstants.floatingCellStyles.padding,
            flexDirection: 'row',
            backgroundColor: 'white',
            alignItems: 'center',
            borderWidth: OrderConfirmationLayoutConstants.selectionOutline.width,
        },
        image: {
            height: 30,
            width: 30,
        },
        title: {
            flex: 1,
            fontFamily: CustomFont.medium,
            fontSize: 16,
        }
    });

    const OrderConfirmationSelectableOptionView = (props: OrderConfirmationSelectableOptionViewProps) => {
        const checkMarkButtonHitSlop = (() => {
            const x = LayoutConstants.floatingCellStyles.padding;
            return { left: x, right: x, top: x, bottom: x };
        })();
        return <SpacerView style={[styles.root, {
            borderColor: props.isSelected ? OrderConfirmationLayoutConstants.selectionOutline.color.selected : OrderConfirmationLayoutConstants.selectionOutline.color.unselected,
        }]} space={15}>
            <Image source={props.imageSource} style={styles.image} />
            <CustomizedText style={styles.title}>{props.title}</CustomizedText>
            <CheckMarkButton isSelected={props.isSelected} onPress={props.onCheckMarkPressed} hitSlop={checkMarkButtonHitSlop} />
        </SpacerView>
    }
    return OrderConfirmationSelectableOptionView;
})();

export default OrderConfirmationSelectableOptionView;


