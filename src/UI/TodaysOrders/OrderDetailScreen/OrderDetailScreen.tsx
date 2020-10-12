
import { StackScreenProps } from '@react-navigation/stack';
import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Order from '../../../api/orders/Order';
import { Color, CustomColors } from '../../../helpers/colors';
import { CustomFont } from '../../../helpers/fonts/fonts';
import Space from '../../../helpers/Spacers/Space';
import Spacer from '../../../helpers/Spacers/Spacer';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import NavigationControllerNavigationBar from '../../../helpers/Views/NavigationControllerNavigationBar';
import ResourceNotFoundView from '../../../helpers/Views/ResourceNotFoundView';
import LayoutConstants from '../../../LayoutConstants';
import { useSelector } from '../../../redux/store';
import { TodaysOrdersNavStackParams } from '../navigationHelpers';
import currency from 'currency.js';
import SpacerView from '../../../helpers/Spacers/SpacerView';


const headingFontSize = 18;
const regularFontSize = 16;
const titleColor = Color.gray(0.3).stringValue;
const subtitleColor = Color.gray(0.7).stringValue;

const OrderDetailScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        scrollView: {
            zIndex: -1,
        },
        scrollViewContainer: {
            ...LayoutConstants.maxWidthListContentContainerStyles(500)
        },
        separatorLine: {
            marginTop: LayoutConstants.floatingCellStyles.padding,
            marginBottom: LayoutConstants.floatingCellStyles.padding,
            height: StyleSheet.hairlineWidth,
            backgroundColor: Color.gray(0.9).stringValue,
        },
    });

    const OrderDetailScreen = (props: StackScreenProps<TodaysOrdersNavStackParams, 'OrderDetail'>) => {
        
        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Order Details" />
            {(() => {
                if (props.route.params.order == null) {
                    return <ResourceNotFoundView />
                } else {
                    return <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
                        <Spacer space={15}>
                            <OrderInfoSection order={props.route.params.order} />
                            <CustomerProfileSection user={props.route.params.order.user} />
                            <OrderItemsView orderDetailsJson={props.route.params.order.detailsJson} />
                            <OrderSubtotalsView order={props.route.params.order}/>
                        </Spacer>
                    </ScrollView>
                }
            })()}
        </View>
    }
    return OrderDetailScreen;
})();

export default OrderDetailScreen;




interface OrderInfoSectionProps {
    order: Order;
}

const OrderInfoSection = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        segmentView: {

        },
        segmentTitle: {
            fontFamily: CustomFont.medium,
            color: subtitleColor,
            marginBottom: 2.5,
        },
        segmentValueText: {
            fontSize: 16,
            fontFamily: CustomFont.medium,
            color: titleColor,
            flex: 1,
            // backgroundColor: 'red',
        },
        segmentValueWithImageHolder: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 2.5,
        },
        segmentValueImage: {
            height: 20,
            width: 20,
        },
    });

    const SegmentView = (props: React.PropsWithChildren<{ title: string, value?: string, imageSource?: any }>) => {
        return <View style={styles.segmentView}>
            <CustomizedText style={styles.segmentTitle}>{props.title}</CustomizedText>
            {(() => {
                if (props.value == null) return props.children;
                else if (props.value != null) {
                    if (props.imageSource != null) {
                        return <View style={styles.segmentValueWithImageHolder}>
                            <Image style={styles.segmentValueImage} source={props.imageSource} />
                            <Space space={7} />
                            <CustomizedText style={styles.segmentValueText}>{props.value}</CustomizedText>
                        </View>
                    } else {
                        return <CustomizedText style={styles.segmentValueText}>{props.value}</CustomizedText>
                    }
                }
            })()}
        </View>
    }

    const OrderInfoSection = (props: OrderInfoSectionProps) => {

        const totalPrice = useMemo(() => {
            return props.order.calculatePriceInfo().total;
        }, [props.order]);

        return <TitleContainer title="Order Info">
            <View style={{flexDirection: 'row'}}>
                <SpacerView space={15} style={{flex: 1,}}>
                    <SegmentView title="Order Number">
                        <CustomizedText style={styles.segmentValueText}>{'#' + props.order.orderNum}</CustomizedText>
                    </SegmentView>
                    <SegmentView title="Payment Method" imageSource={props.order.userPaidOnline ? require('../../Cart/OrderConfirmationScreen/icons/pay.png') : require('../../Cart/OrderConfirmationScreen/icons/buy.png')} value={props.order.userPaidOnline ? "Paid Online" : "Payment In Person"}/>
                    <SegmentView title="Completion Status" value={props.order.isCompleted ? "Completed" : "Incomplete"}/>
                </SpacerView>
                <Space space={10}/>
                <SpacerView space={15} style={{flex: 1,}}>
                    <SegmentView title="Order Date">
                        <CustomizedText style={styles.segmentValueText}>{props.order.creationDate.format('LLL')}</CustomizedText>
                    </SegmentView>
                    <SegmentView title="Pick Up Or Delivery" imageSource={props.order.userWantsOrderDelivered ? require('../../Cart/OrderConfirmationScreen/icons/motorcycle.png') : require('../../Cart/OrderConfirmationScreen/icons/order.png')} value={props.order.userWantsOrderDelivered ? "Delivery" : "Pick Up"}/>
                    <SegmentView title="Total Price" value={currency(totalPrice).format()}/>
                </SpacerView>
            </View>
            
        </TitleContainer>
    }
    return OrderInfoSection;
})();




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
            fontSize: regularFontSize,
            color: subtitleColor,
        },
        segmentViewValue: {
            fontSize: regularFontSize,
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
        return <TitleContainer title="Customer Info">
            <Spacer space={10}>
                <SegmentView title="Name" value={props.user.firstName + ' ' + props.user.lastName} />
                <SegmentView title="Phone" value={props.user.phoneNumber} />
                <SegmentView title="Email" value={props.user.email} />
            </Spacer>
        </TitleContainer>
    }
    return CustomerProfileSection;
})();







interface OrderItemsViewProps {
    orderDetailsJson: Order['detailsJson'];
}

const OrderItemsView = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        segmentView: {
            flexDirection: 'row',
        },
        segmentLeftText: {
            fontSize: regularFontSize,
            fontFamily: CustomFont.medium,
            color: titleColor,
            marginRight: 10,
        },
        segmentCenter: {
            flex: 1,
        },
        segmentTitleLabel: {
            fontSize: regularFontSize,
            fontFamily: CustomFont.medium,
            color: titleColor,
        },
        segmentSubtitleLabel: {
            fontSize: 14,
            color: subtitleColor,
            marginTop: 4,
        },
        segmentMealChoiceView: {
            marginLeft: 15
        },
        segmentMealChoiceCategoryText: {
            fontFamily: CustomFont.medium,
            fontSize: 15,
        },
        segmentMealChoiceProductTitle: {
            fontSize: 15,
            color: Color.gray(0.4).stringValue,
        },
        segmentPriceLabel: {
            fontSize: regularFontSize,
        }
    });

    const SegmentView = (props: { item: Order['detailsJson'][0] }) => {

        const individualPrice = (() => {
            if (props.item.entry_type === 'product') {
                return props.item.product_price;
            } else {
                return props.item.meal_price;
            }
        })();

        const title = (() => {
            if (props.item.entry_type === 'product') {
                return props.item.product_name;
            } else {
                return props.item.meal_name;
            }
        })();

        return <View style={styles.segmentView}>
            <CustomizedText style={styles.segmentLeftText}>#</CustomizedText>
            <View style={styles.segmentCenter}>
                <CustomizedText style={styles.segmentTitleLabel}>
                    {title + (() => {
                        if (props.item.quantity > 1) return ' × ' + props.item.quantity
                        else return '';
                    })()}
                </CustomizedText>
                {props.item.quantity >= 2 && <CustomizedText style={styles.segmentSubtitleLabel}>{
                    props.item.quantity + ' × ' + currency(individualPrice).format()
                }</CustomizedText>}
                {props.item.entry_type === 'meal' && props.item.choices.length >= 1 && <>
                    <Space space={10} />
                    {/* eslint-disable-next-line react/no-children-prop */}
                    <Spacer space={15} children={
                        props.item.choices.map((x, index) => {
                            return <View key={index} style={styles.segmentMealChoiceView}>
                                <CustomizedText style={styles.segmentMealChoiceCategoryText}>{x.category_name + ":"}</CustomizedText>
                                <CustomizedText style={styles.segmentMealChoiceProductTitle}>{x.chosen_product_name}</CustomizedText>
                            </View>
                        })
                    } />
                </>}
            </View>
            <CustomizedText style={styles.segmentPriceLabel}>{currency(individualPrice * props.item.quantity).format()}</CustomizedText>
        </View>
    }

    const OrderItemsView = (props: OrderItemsViewProps) => {
        return <TitleContainer title="Order Items">
            {/* eslint-disable-next-line react/no-children-prop */}
            <Spacer space={17} children={
                props.orderDetailsJson.map((x, index) => <SegmentView key={index} item={x} />)
            } />
        </TitleContainer>
    }
    return React.memo(OrderItemsView);
})();


interface OrderSubtotalsViewProps{
    order: Order
}

const OrderSubtotalsView = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        segmentView: {
            flexDirection: 'row',
        },
        segmentViewTitle: {
            fontFamily: CustomFont.medium,
            fontSize: regularFontSize,
        },
        segmentViewValue: {
            fontSize: regularFontSize,
            flex: 1,
            textAlign: 'right',
        },
        segmentViewValueIsTotal: {
            fontFamily: CustomFont.bold,
        }
    });

    const SegmentView = (props: { title: string, value: string, isTotal?: boolean }) => {
        return <View style={styles.segmentView}>
            <CustomizedText style={styles.segmentViewTitle}>{props.title}</CustomizedText>
            <Space space={5} />
            <CustomizedText style={[styles.segmentViewValue, props.isTotal ? styles.segmentViewValueIsTotal : undefined]}>{props.value}</CustomizedText>
        </View>
    }

    const OrderSubtotalsView = (props: OrderSubtotalsViewProps) => {

        const priceInfo = useMemo(() => {
            return props.order.calculatePriceInfo();
        }, [props.order]);

        return <TitleContainer>
            <Spacer space={10}>
                <SegmentView title="Subtotal" value={currency(priceInfo.subtotal).format()} />
                <SegmentView title="VAT" value={currency(priceInfo.vat).format()} />
                <SegmentView title="Total" value={currency(priceInfo.total).format()} isTotal/>
            </Spacer>
        </TitleContainer>
    }
    return OrderSubtotalsView;
})();



interface TitleContainerProps {
    title?: string;
}

const TitleContainer = (() => {

    const styles = StyleSheet.create({
        root: {
            padding: LayoutConstants.floatingCellStyles.padding,
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            backgroundColor: 'white',
        },
        title: {
            fontSize: headingFontSize,
            fontFamily: CustomFont.bold,
            color: CustomColors.themeGreen.stringValue,
        }
    });

    const TitleContainer = (props: React.PropsWithChildren<TitleContainerProps>) => {
        return <View style={styles.root}>
            {(() => {
                if (props.title == null) {
                    return props.children
                } else {
                    return <>
                        <CustomizedText style={styles.title}>{props.title}</CustomizedText>
                        <Space space={15} />
                        {props.children}
                    </>
                }
            })()}
        </View>
    }
    return React.memo(TitleContainer);
})();

