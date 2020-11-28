import React from 'react';
import {StyleSheet, View} from 'react-native'
import Order from '../../../api/orders/Order';
import { CustomFont } from '../../../helpers/fonts/fonts';
import Space from '../../../helpers/Spacers/Space';
import Spacer from '../../../helpers/Spacers/Spacer';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import { OrderDetailScreenConstants } from './helpers';
import OrderDetailTitleContainer from './OrderDetailTitleContainer';

interface CustomerProfileSectionProps {
    user: Order['user'];
}

const CustomerProfileSection = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        segmentView: {
            flexDirection: 'row',
        },
        segmentViewTitle: {
            fontFamily: CustomFont.medium,
            fontSize: OrderDetailScreenConstants.regularFontSize,
            color: OrderDetailScreenConstants.subtitleColor,
        },
        segmentViewValue: {
            fontSize: OrderDetailScreenConstants.regularFontSize,
            flex: 1,
            textAlign: 'right',
        }
    });

    const SegmentView = (props: { title: string, value: string }) => {
        return <View style={styles.segmentView}>
            <CustomizedText style={styles.segmentViewTitle}>{props.title}</CustomizedText>
            <Space space={5} />
            <CustomizedText style={styles.segmentViewValue}>{props.value}</CustomizedText>
        </View>
    }

    const CustomerProfileSection = (props: CustomerProfileSectionProps) => {
        return <OrderDetailTitleContainer title="Customer Info">
            <Spacer space={10}>
                <SegmentView title="Name" value={props.user.firstName + ' ' + props.user.lastName} />
                <SegmentView title="Phone" value={props.user.phoneNumber} />
                <SegmentView title="Email" value={props.user.email} />
            </Spacer>
        </OrderDetailTitleContainer>
    }
    return CustomerProfileSection;
})();




export default CustomerProfileSection;

