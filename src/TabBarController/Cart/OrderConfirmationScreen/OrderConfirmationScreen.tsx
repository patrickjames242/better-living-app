
import React, { useRef } from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import FloatingCellStyleSectionView from '../../../helpers/Views/FloatingCellStyleSectionView';
import { CartItemListTotalSummaryView } from '../CartItemListScreen/CartItemListTotalSummaryView';
import LayoutConstants from '../../../LayoutConstants';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import OrderConfirmationPickUpOrDeliveryView from './OrderConfirmationPickUpOrDeliveryView';
import OrderConfirmationHowToPayView from './OrderConfirmationHowToPayView';
import LongTextAndIconButton from '../../../helpers/Buttons/LongTextAndIconButton';
import Space from '../../../helpers/Spacers/Space';
import { ScrollView, NativeViewGestureHandler } from 'react-native-gesture-handler';




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
    
        const scrollViewRef = useRef<NativeViewGestureHandler>(null);


        return <KeyboardAvoidingView behavior='padding' style={styles.root}>
            <NavigationControllerNavigationBar title="Confirm Order" />
            <NativeViewGestureHandler ref={scrollViewRef}>
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
                        <LongTextAndIconButton
                            text="Submit Order"
                            iconSource={require('./icons/hotel.png')}
                            style={styles.submitButton}
                        />
                    </SpacerView>
                </ScrollView>
            </NativeViewGestureHandler>
        </KeyboardAvoidingView>
    }
    return OrderConfirmationScreen;
})();

export default OrderConfirmationScreen;








