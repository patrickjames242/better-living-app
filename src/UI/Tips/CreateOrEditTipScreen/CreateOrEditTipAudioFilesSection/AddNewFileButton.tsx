
import React from 'react';
import { StyleSheet } from 'react-native';
import AssetImages from '../../../../images/AssetImages';
import { CustomFont } from '../../../../helpers/fonts/fonts';
import * as DocumentPicker from 'expo-document-picker';
import RoundedTextAndIconBouncyButton from '../../../../helpers/Buttons/RoundedTextAndIconBouncyButton';
import { RNFileForUpload } from '../../../../helpers/RNFileForUpload';


export interface AddNewFileButtonProps {
    onUserWantsToAddFile: (file: RNFileForUpload) => void;
}

const AddNewFileButton = (() => {

    const styles = StyleSheet.create({
        root: {
            alignSelf: 'flex-start',
        },
        contentView: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            paddingLeft: 15,
            paddingRight: 15,
        },
        plusIcon: {
            height: 17.5,
            width: 17.5,
            tintColor: 'white',
        },
        text: {
            fontFamily: CustomFont.medium,
            fontSize: 15,
            color: 'white',
        },
    });

    const AddNewFileButton = (props: AddNewFileButtonProps) => {

        function onPress() {
            DocumentPicker.getDocumentAsync({ type: 'audio/*' }).then(documentPickerResult => {
                if (documentPickerResult.type !== 'success'){
                    return Promise.reject(new Error("An error occured when trying to pick a document from the document picker."));
                }

                if (documentPickerResult.file instanceof File){
                    props.onUserWantsToAddFile(new RNFileForUpload({file: documentPickerResult.file}));
                    return;
                }

                props.onUserWantsToAddFile(new RNFileForUpload({name: documentPickerResult.name, uri: documentPickerResult.uri, defaultFileType: 'audio/mpeg'}));
                
            });
        }

        return <RoundedTextAndIconBouncyButton iconSource={AssetImages.plusIcon} text="Add New File" onPress={onPress}/>
    }
    return AddNewFileButton;
})();

export default AddNewFileButton;

