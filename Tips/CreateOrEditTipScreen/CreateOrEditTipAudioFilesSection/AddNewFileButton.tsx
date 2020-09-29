
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import CustomizedText from '../../../src/helpers/Views/CustomizedText';
import RoundedBouncyButton from '../../../src/helpers/Buttons/RoundedBouncyButton';
import AssetImages from '../../../src/images/AssetImages';
import Space from '../../../src/helpers/Spacers/Space';
import { CustomFont } from '../../../src/helpers/fonts/fonts';
import * as DocumentPicker from 'expo-document-picker';
import RoundedTextAndIconBouncyButton from '../../../src/helpers/Buttons/RoundedTextAndIconBouncyButton';


export interface AddNewFileButtonProps {
    onUserWantsToAddFile: (file: File) => void;
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
                    props.onUserWantsToAddFile(documentPickerResult.file);
                    return;
                }
                
                fetch(documentPickerResult.uri).then(result => 
                    result.blob()
                ).then(result => {
                    const file = new File([result], documentPickerResult.name);
                    props.onUserWantsToAddFile(file);
                });  
            });
        }

        return <RoundedTextAndIconBouncyButton iconSource={AssetImages.plusIcon} text="Add New File" onPress={onPress}/>
    }
    return AddNewFileButton;
})();

export default AddNewFileButton;

