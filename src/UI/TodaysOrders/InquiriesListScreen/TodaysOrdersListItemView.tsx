
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import LayoutConstants from '../../../LayoutConstants';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { Color, CustomColors } from '../../../helpers/colors';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodaysOrdersNavStackParams } from '../navigationHelpers';
import Order from '../../../api/orders/Order';




export interface InquiriesListItemViewProps {
    order: Order;
}

const InquiriesListItemView = (() => {

    const styles = StyleSheet.create({
        root: {
            backgroundColor: 'white',
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            overflow: 'hidden',
            flexDirection: 'row',
        },
        unreadSideBar: {
            width: 10,
            backgroundColor: CustomColors.themeGreen.stringValue,
        },
        content: {
            padding: LayoutConstants.floatingCellStyles.padding,
            flex: 1,
        },
        unreadRepliesLabel: {
            color: CustomColors.themeGreen.stringValue,
            fontFamily: CustomFont.medium,
        },
        topLabels: {
            flexDirection: 'row',
        },
        subjectTitle: {
            fontSize: 18,
            fontFamily: CustomFont.bold,
            flex: 1,
        },
        orderNumberLabel: {
            fontFamily: CustomFont.bold,
            color: CustomColors.themeGreen.stringValue,
            fontSize: 17,
        },
        subtitle: {
            color: Color.gray(0.7).stringValue,
            fontSize: 13,
        },
        description: {
            color: Color.gray(0.65).stringValue,
        },
    });

    const InquiriesListItemView = (props: InquiriesListItemViewProps) => {

        const navigation = useNavigation<StackNavigationProp<TodaysOrdersNavStackParams, 'TodaysOrdersList'>>();

        const detailsText = useMemo(() => {
            return props.order.detailsJson.map(x => {
                return (x.quantity > 1 ? x.quantity + ' × ' : '') + (() => {
                    if (x.entry_type === 'product'){
                        return x.product_name;
                    } else {
                        return x.meal_name;
                    }
                })();
                
            }).join(' • ');
        }, [props.order.detailsJson]);

        function respondToButtonPressed(){
            // navigation.push('InquiryDetail');
        }

        return <BouncyButton bounceScaleValue={0.9} contentViewProps={{style: styles.root}} onPress={respondToButtonPressed}>
            {
                (props.order.isCompleted === false) && <View style={styles.unreadSideBar} />
            }
            <SpacerView style={styles.content} space={8}>
                <SpacerView style={styles.topLabels} space={10}>
                    <CustomizedText style={styles.subjectTitle}>
                        {props.order.user.firstName + ' ' + props.order.user.lastName}
                    </CustomizedText>
                    <CustomizedText style={styles.orderNumberLabel}>{'#' + props.order.orderNum}</CustomizedText>
                </SpacerView>
                <CustomizedText style={styles.subtitle}>
                    5 hours ago • 5 replies
                </CustomizedText>
                <CustomizedText numberOfLines={2} style={styles.description}>
                    {detailsText}
                </CustomizedText>

            </SpacerView>
        </BouncyButton>
    }
    return InquiriesListItemView;
})();

export default InquiriesListItemView;


