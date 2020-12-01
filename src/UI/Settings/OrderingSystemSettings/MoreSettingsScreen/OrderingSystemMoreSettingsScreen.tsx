import { StackScreenProps } from '@react-navigation/stack';
import React, { useMemo } from 'react';
import { useSelector } from '../../../../redux/store';
import GenericSettingsScreen, { GenericSettingsScreenSection } from '../../GenericSettingsScreen/GenericSettingsScreen';
import { useAllowOrderingSwitchSettingsItem } from '../../helpers';
import { SettingsNavStackParams } from '../../navigationHelpers';
import currency from 'currency.js';


const OrderingSystemMoreSettingsScreen = (props: StackScreenProps<SettingsNavStackParams, 'OrderingSystemMoreSettings'>) => {
    
    const allowOrderingSwitchSettingsItem = useAllowOrderingSwitchSettingsItem();
    const globalSettings = useSelector(state => state.globalSettings);

    const sections: GenericSettingsScreenSection[] = useMemo(() => {
        return [{
            title: null,
            data: [
                allowOrderingSwitchSettingsItem,
                {
                    title: "Delivery Fee",
                    imageSource: require('../../../Cart/OrderConfirmationScreen/icons/motorcycle.png'),
                    rightSubtitleText: currency(globalSettings.deliveryFee).format(),
                    onPress: () => {props.navigation.push('EditDeliveryFee')}
                },
                {
                    title: "Vat Percentage",
                    rightSubtitleText: (globalSettings.vatPercentage * 100) + '%',
                    imageSource: require('../../icons/price-tag.png'),
                    onPress: () => {props.navigation.push('EditVatPercentageScreen')},
                }
            ]
        }]
    }, [allowOrderingSwitchSettingsItem, globalSettings.deliveryFee, globalSettings.vatPercentage, props.navigation]);
    return <GenericSettingsScreen
        navBarTitle="More"
        sections={sections}
    />
}


export default OrderingSystemMoreSettingsScreen;
