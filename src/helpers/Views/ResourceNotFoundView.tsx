
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import AssetImages from '../../images/AssetImages';
import CustomizedText from './CustomizedText';
import SpacerView from '../Spacers/SpacerView';
import { CustomFont } from '../fonts/fonts';
import LayoutConstants from '../../LayoutConstants';
import { Color } from '../colors';

export interface ResourceNotFoundViewProps{
    
}

const ResourceNotFoundView = (() => {
    
    const imageSize = 100;
    const styles = StyleSheet.create({
        root: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            padding: LayoutConstants.pageSideInsets,
        },
        image: {
            height: imageSize,
            width: imageSize,
        },
        text: {
            fontSize: 18,
            fontFamily: CustomFont.medium,
            maxWidth: 250,
            textAlign: 'center',
            color: Color.gray(0.35).stringValue,
        }
    });
    
    const ResourceNotFoundView = (props: ResourceNotFoundViewProps) => {
        return <SpacerView style={styles.root} space={20}>
            <Image style={styles.image} source={AssetImages.warningIconColored}/>
            <CustomizedText style={styles.text}>This resource could not be found. It may have been deleted.</CustomizedText>
        </SpacerView>
    }
    return ResourceNotFoundView;
})();

export default ResourceNotFoundView;
