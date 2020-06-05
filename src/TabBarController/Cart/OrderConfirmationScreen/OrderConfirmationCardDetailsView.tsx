

import React from 'react';
import {StyleSheet, View, TextInput} from 'react-native';
import LayoutConstants from '../../../LayoutConstants';

export interface OrderConfirmationCardDetailsViewProps{
    
}

const OrderConfirmationCardDetailsView = (() => {
    
    const styles = StyleSheet.create({
        root: {
            height: 200,
            padding: LayoutConstants.floatingCellStyles.padding,
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            backgroundColor: 'white',
        },
        
    });
    
    const OrderConfirmationCardDetailsView = (props: OrderConfirmationCardDetailsViewProps) => {
        return <View style={styles.root}>
            <TextInput style={{
                height: 50,
                backgroundColor: 'red',
            }}/>
        </View>
    }
    return OrderConfirmationCardDetailsView;
})();

export default OrderConfirmationCardDetailsView;



