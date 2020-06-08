
import React, { useLayoutEffect, useRef } from 'react';
import { StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import FloatingCellStyleSectionView from '../../../helpers/FloatingCellStyleSectionView';
import { CartItemListTotalSummaryView } from '../CartItemListScreen/CartItemListTotalSummaryView';
import LayoutConstants from '../../../LayoutConstants';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import OrderConfirmationPickUpOrDeliveryView from './OrderConfirmationPickUpOrDeliveryView';
import OrderConfirmationHowToPayView from './OrderConfirmationHowToPayView';
import GreenTextAndIconButton from '../../../helpers/Buttons/GreenTextAndIconButton';
import Space from '../../../helpers/Spacers/Space';




const OrderConfirmationScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        scrollView: {
            overflow: 'visible',
            zIndex: -1,
        },
        scrollViewContentContainer: {
            padding: LayoutConstants.pageSideInsets,
            paddingTop: LayoutConstants.floatingCellStyles.sectionSpacing,
        },
        scrollViewContentHolder: {
            maxWidth: LayoutConstants.floatingCellStyles.maxWidth,
            width: '100%',
            alignSelf: 'center',
        },
        submitButton: {
            maxWidth: LayoutConstants.bottomScreenButtonWithGradient.maxWidth,
            alignSelf: 'center',
            width: '100%',
        },
    });

    const OrderConfirmationScreen = () => {

        const scrollView = useRef<ScrollView>(null);

        useLayoutEffect(() => {
            scrollView.current?.scrollTo({ x: 0, y: 0 });
        }, []);

        return <KeyboardAvoidingView behavior='padding' style={styles.root}>
            <NavigationControllerNavigationBar title="Confirm Order" />
            <ScrollView
                ref={scrollView}
                style={styles.scrollView}
                alwaysBounceVertical={true}
                contentContainerStyle={styles.scrollViewContentContainer}
            >
                <SpacerView style={styles.scrollViewContentHolder} space={LayoutConstants.floatingCellStyles.sectionSpacing}>
                    <FloatingCellStyleSectionView sectionTitle="Order Total">
                        <CartItemListTotalSummaryView />
                    </FloatingCellStyleSectionView>
                    <OrderConfirmationPickUpOrDeliveryView />
                    <OrderConfirmationHowToPayView />
                    <Space space={LayoutConstants.pageSideInsets} />
                    <GreenTextAndIconButton
                        text="Submit Order"
                        iconSource={require('./icons/hotel.png')}
                        style={styles.submitButton}
                    />
                </SpacerView>
            </ScrollView>
        </KeyboardAvoidingView>
    }
    return OrderConfirmationScreen;
})();

export default OrderConfirmationScreen;








