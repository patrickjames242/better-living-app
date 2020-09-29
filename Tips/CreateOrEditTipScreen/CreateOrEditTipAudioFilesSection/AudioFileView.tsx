
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import CreateOrEditTipAttachmentContainer from '../CreateOrEditTipAttachmentContainer';
import CustomizedText from '../../../src/helpers/Views/CustomizedText';
import AssetImages from '../../../src/images/AssetImages';
import CreateOrEditTipEditButton, { CreateOrEditTipEditButton_EditButtonType } from '../CreateOrEditTipEditButton';
import Spacer from '../../../src/helpers/Spacers/Spacer';
import { CustomFont } from '../../../src/helpers/fonts/fonts';

export interface AudioFileViewProps {
    audioFileName: string;
    onDeleteButtonPressed: () => void;
}

const AudioFileView = (() => {

    const styles = StyleSheet.create({
        root: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        fileIcon: {
            width: 30,
            height: 30,
        },
        fileNameText: {
            flex: 1,
            fontSize: 15,
            fontFamily: CustomFont.medium,
        }
    });

    const AudioFileView = (props: AudioFileViewProps) => {
        return <CreateOrEditTipAttachmentContainer style={styles.root}>
            <Spacer space={15}>
                <Image style={styles.fileIcon} source={AssetImages.audioFileIcon}/>
                <CustomizedText numberOfLines={2} style={styles.fileNameText}>{props.audioFileName}</CustomizedText>
                <CreateOrEditTipEditButton onPress={props.onDeleteButtonPressed} buttonType={CreateOrEditTipEditButton_EditButtonType.delete}/>
            </Spacer>
        </CreateOrEditTipAttachmentContainer>
    }
    return AudioFileView;
})();

export default AudioFileView;
