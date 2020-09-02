import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import { Color } from '../../../helpers/colors';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import { CustomFont } from '../../../helpers/fonts/fonts';



const SettingsListScreenHeader = (() => {
    
    const styles = StyleSheet.create({
        root: {
            alignItems: 'center',
            paddingTop: 50,
            paddingBottom: 30,
        },
        imageHolder: {
            borderWidth: 4,
            borderColor: Color.gray(0.9).stringValue,
            padding: 6,
            borderRadius: 100000000
        },
        image: {
            width: 120,
            height: 120,
            borderRadius: 100000000,
        },
        nameText: {
            fontSize: 25,
            fontFamily: CustomFont.bold,
        },
    });
    
    const SettingsListScreenHeader = () => {
        return <SpacerView style={styles.root} space={15}>
            <View style={styles.imageHolder}>
                <Image style={styles.image} source={require('../../Inquiries/InquiryDetailScreen/random-woman.jpg')}/>
            </View>
            <CustomizedText style={styles.nameText}>Jane Rolle</CustomizedText>
        </SpacerView>
    }
    return SettingsListScreenHeader;
})();

export default SettingsListScreenHeader;
