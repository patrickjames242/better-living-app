
import React, { useEffect, useMemo } from 'react';
import { Image, StyleProp, StyleSheet, TextStyle, View } from 'react-native';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { Color, CustomColors } from '../../../helpers/colors';
import BouncyButton from '../../../helpers/Buttons/BouncyButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodaysOrdersNavStackParams } from '../navigationHelpers';
import Order from '../../../api/orders/Order';
import AssetImages from '../../../images/AssetImages';
import Notification from '../../../helpers/Notification';
import { useForceUpdate } from '../../../helpers/reactHooks';
import Space from '../../../helpers/Spacers/Space';
import currency from 'currency.js';
import { useCallback } from 'react';


export interface TodaysOrdersListItemViewProps {
    order: Order;
    onPress: (order: Order) => void;
}

const TodaysOrdersListItemView = (() => {

    const styles = StyleSheet.create({
        root: {
            backgroundColor: 'white',
            // borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            borderRadius: 12.5,
            overflow: 'hidden',
            flexDirection: 'row',
        },
        unreadSideBar: {
            width: 8,
            backgroundColor: CustomColors.themeGreen.stringValue,
        },
        content: {
            padding: 12.5,
            flex: 1,
        },
        unreadRepliesLabel: {
            color: CustomColors.themeGreen.stringValue,
            fontFamily: CustomFont.medium,
        },
        topLabels: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        subjectTitle: {
            fontSize: 17,
            fontFamily: CustomFont.bold,
            // flex: 1,
            marginBottom: 5,
        },
        orderNumberLabel: {
            fontFamily: CustomFont.medium,
            color: CustomColors.themeGreen.stringValue,
            fontSize: 16,
        },
        description: {
            color: Color.gray(0.65).stringValue,
            marginBottom: 8,
        },
        bottomViewRow: {
            flexDirection: 'row',
        },
        timeView: {
            alignSelf: 'flex-start',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: CustomColors.themeGreen.withAdjustedOpacity(0.1).stringValue,
            padding: 5,
            paddingLeft: 8,
            paddingRight: 8,
            borderRadius: 100,
            flexShrink: 2,
        },
        timeIcon: {
            height: 15,
            width: 15,
            // tintColor: CustomColors.themeGreen.stringValue,
        },
        timeText: {
            fontSize: 14,
            color: CustomColors.themeGreen.stringValue,
            flexShrink: 1,
            marginLeft: 5,
        },
        priceView: {
            backgroundColor: Color.gray(0.94).stringValue, 
            alignSelf: 'center', 
            padding: 5,
            paddingLeft: 8,
            paddingRight: 8,
            borderRadius: 1000,
            marginLeft: 10,
        },
        priceText: {
            fontSize: 14,
            color: Color.gray(0.4).stringValue,
        },
        cardOrMoneyIcon: {
            height: 23,
            width: 23,
            // tintColor: Color.gray(0.85).stringValue, 
            alignSelf: 'flex-end',
        },
        
    });

    const TodaysOrdersListItemView = (props: TodaysOrdersListItemViewProps) => {

        
        const detailsText = useMemo(() => {
            return props.order.detailsJson.map(x => {
                return (x.quantity > 1 ? x.quantity + ' × ' : '') + (() => {
                    if (x.entry_type === 'product') {
                        return x.product_name;
                    } else {
                        return x.meal_name;
                    }
                })();

            }).join(' • ');
        }, [props.order.detailsJson]);

        const order = props.order;
        const propsOnPress = props.onPress;

        const price = useMemo(() => {
            return order.calculatePriceInfo().total;
        }, [order]);

        const onPress = useCallback(() => {
            propsOnPress(order);
        }, [order, propsOnPress]);
        
        return <BouncyButton bounceScaleValue={0.9} contentViewProps={{ style: styles.root }} onPress={onPress}>
            {(props.order.isCompleted === false) &&
                <View style={styles.unreadSideBar} />
            }
            <View style={styles.content}>
                <View style={styles.topLabels}>
                    <CustomizedText style={styles.orderNumberLabel}>{'#' + props.order.orderNum}</CustomizedText>
                    <Image resizeMode="contain" style={styles.cardOrMoneyIcon} source={props.order.userPaidOnline ? require('./credit-card.png') : require('./money.png')}/>
                </View>
                <CustomizedText style={styles.subjectTitle}>
                    {props.order.user.firstName + ' ' + props.order.user.lastName}
                </CustomizedText>
                <CustomizedText numberOfLines={2} style={styles.description}>
                    {detailsText}
                </CustomizedText>
                <View style={styles.bottomViewRow}>
                    <View style={styles.timeView}>
                        <Image resizeMode="contain" style={styles.timeIcon} source={AssetImages.alarmClock} />
                        <TimeText style={styles.timeText} order={props.order}/>
                    </View>
                    <View style={styles.priceView}>
                        <CustomizedText style={styles.priceText}>{currency(price).format()}</CustomizedText>
                    </View>
                </View>
            </View>
        </BouncyButton>
    }
    return React.memo(TodaysOrdersListItemView);
})();

export default TodaysOrdersListItemView;


export const TimeText = (() => {
    
    const updateTimeNotification = Notification<null>();

    setInterval(() => {
        updateTimeNotification.post(null);
    }, 10000);

    const TimeText = function TimeText(props: { style: StyleProp<TextStyle>, order: Order }) {

        const forceUpdate = useForceUpdate();

        useEffect(() => {
            return updateTimeNotification.addListener(() => {
                forceUpdate();
            });
        }, [forceUpdate]);

        return <CustomizedText numberOfLines={1} style={props.style}>
            {props.order.creationDate.fromNow()}
            {/* a few seconds ago */}
        </CustomizedText>
    }
    return React.memo(TimeText);
})();



