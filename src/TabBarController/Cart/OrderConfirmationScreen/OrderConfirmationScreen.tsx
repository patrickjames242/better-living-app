
import React from 'react';
import { StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import FloatingCellStyleSectionView from '../../../helpers/FloatingCellStyleSectionView';
import { CartItemListTotalSummaryView } from '../CartItemListScreen/CartItemListTotalSummaryView';
import LayoutConstants from '../../../LayoutConstants';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import OrderConfirmationPickUpOrDeliveryView from './OrderConfirmationPickUpOrDeliveryView';
import OrderConfirmationHowToPayView from './OrderConfirmationHowToPayView';




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
    });

    const OrderConfirmationScreen = () => {

        return <KeyboardAvoidingView behavior="height" style={styles.root}>
            <NavigationControllerNavigationBar title="Confirm Order" />
            <ScrollView
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
                </SpacerView>
            </ScrollView>
        </KeyboardAvoidingView>
    }
    return OrderConfirmationScreen;
})();

export default OrderConfirmationScreen;








