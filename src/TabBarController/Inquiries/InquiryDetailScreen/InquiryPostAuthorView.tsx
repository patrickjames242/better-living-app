import React from 'react';
import {StyleSheet, Image} from 'react-native';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import CustomizedText from '../../../helpers/CustomizedText';
import { CustomFont } from '../../../helpers/fonts/fonts';
import { Color } from '../../../helpers/colors';


const InquiryPostAuthorView = (() => {

    const imageSize = 40;
    
    const styles = StyleSheet.create({
        root: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        textContainer: {
            flex: 1,
        },
        image: {
            borderRadius: imageSize / 2,
            height: imageSize,
            width: imageSize,
        },
        nameText: {
            fontSize: 17,
            fontFamily: CustomFont.medium,
        },
        timeText: {
            color: Color.gray(0.7).stringValue,
            fontSize: 14,
        },
    });
    
    const InquiryPostAuthorView = () => {
        return <SpacerView space={10} style={styles.root}>
            <Image style={styles.image} source={require('./random-woman.jpg')}/>
            <SpacerView style={styles.textContainer} space={1}>
                <CustomizedText style={styles.nameText}>Patrick Hanna</CustomizedText>
                <CustomizedText style={styles.timeText}>1h ago</CustomizedText>
            </SpacerView>
        </SpacerView>
    }
    return InquiryPostAuthorView;
})();

export default InquiryPostAuthorView;
