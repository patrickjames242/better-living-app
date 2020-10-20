
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import LargeHeadingNavigationBar from '../../../helpers/NavigationBar/LargeHeadingNavigationBar';
import NoItemsToShowView from '../../../helpers/Views/NoItemsToShowView';
import { InquiriesNavStackParams } from '../navigationHelpers';


const InquiriesMainScreen = (() => {
    
    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
    });
    
    const InquiriesMainScreen = (props: StackScreenProps<InquiriesNavStackParams, 'InquiriesMain'>) => {
        return <View style={styles.root}>
            <LargeHeadingNavigationBar title="Ask a Question"/>
            <NoItemsToShowView 
                title="Ask a Question"
                subtitle="Is there something you'd like to know? Ask us a question!"
                buttonTitle="Ask a Question"
                imageSource={require('./confused.png')}
                imageStyle={{transform: [{translateX: 15}]}}
                buttonOnPress={() => {
                    props.navigation.push('InquiryForm');
                }}
            />
        </View>
    }
    return InquiriesMainScreen;
})();

export default InquiriesMainScreen;
