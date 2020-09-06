

import React from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import AspectRatioView from '../../../../../helpers/Views/AspectRatioView';
import LayoutConstants from '../../../../../LayoutConstants';
import { TextFieldViewContainer } from '../../../../../helpers/Views/TextFieldView';
import { RNFileForUpload } from '../../../../../helpers/general';
import SpacerView from '../../../../../helpers/Spacers/SpacerView';
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker';
import SelectableRoundedTextButton from '../../SelectableRoundedTextButton';
import { useField } from '../../../../../helpers/formik';
import { ProductEditOrCreateValues } from './helpers';
import { displayErrorMessage } from '../../../../../helpers/Alerts';

export interface ProductEditOrCreationImageSelectorProps {

}

const ProductEditOrCreationImageSelector = (() => {

    const styles = StyleSheet.create({
        root: {
            borderRadius: 15,
        },
        innerHolder: {
            alignItems: 'flex-start',
        },
        imageHolder: {
            borderRadius: 15,
            maxWidth: 300,
            overflow: 'hidden',
            alignSelf: 'stretch',
        },
        image: {
            width: '100%',
            height: '100%',
        },
        buttonHolder: {
            flexDirection: 'row',
        },
    });

    async function getImageFromUser(): Promise<{uri: string, fileToUpload: RNFileForUpload} | null>{

        if (Platform.OS === 'ios'){

            if (
                Platform.OS === 'ios' && 
                (await ImagePicker.getCameraRollPermissionsAsync()).granted === false && 
                (await ImagePicker.requestCameraPermissionsAsync()).granted === false
            ){
                return Promise.reject(new Error('You have not given this app permission to access your photo library. Please allow access in your settings.'));
            }
    
            const result = await ImagePicker.launchImageLibraryAsync();
    
            if (result.cancelled){return null;}

            return {uri: result.uri, fileToUpload: new RNFileForUpload({uri: result.uri})};
        } else {

            const documentPickerResult = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });

            if (documentPickerResult.type !== 'success'){
                return Promise.reject(new Error("An error occured when trying to pick a document from the document picker."));
            }

            return {
                uri: documentPickerResult.uri,
                fileToUpload: (() => {
                    if (Platform.OS === 'web'){
                        return new RNFileForUpload({file: documentPickerResult.file!})
                    } else {
                        return new RNFileForUpload({uri: documentPickerResult.uri, name: documentPickerResult.name})
                    }
                })()
            }
        }

    }

    const ProductEditOrCreationImageSelector = (props: ProductEditOrCreationImageSelectorProps) => {

        const [,{value}, {setValue}] = useField<ProductEditOrCreateValues, 'imageSource'>('imageSource');

        function onUpdateImagePressed(){
            getImageFromUser().then(result => {
                result && setValue({uriToDisplayInForm: result.uri, fileToUpload: result.fileToUpload});
            }).catch(error => {
                displayErrorMessage(error.message);
            });
        }

        function onRemoveImage(){
            setValue({fileToUpload: null});
        }

        return <TextFieldViewContainer topTitleText="Product Image" >
            <SpacerView style={styles.innerHolder} space={10}>
                {value?.uriToDisplayInForm &&
                    <AspectRatioView style={styles.imageHolder} heightPercentageOfWidth={LayoutConstants.productImageHeightPercentageOfWidth}>
                        <Image style={styles.image} source={{ uri: value.uriToDisplayInForm }} />
                    </AspectRatioView>}
                <SpacerView space={10} style={styles.buttonHolder}>
                    <SelectableRoundedTextButton title={value?.uriToDisplayInForm ? 'Update Image' : 'Add Image'} onPress={onUpdateImagePressed}/>
                    {value?.uriToDisplayInForm && <SelectableRoundedTextButton title="Remove Image" onPress={onRemoveImage}/>}
                </SpacerView>
            </SpacerView>
        </TextFieldViewContainer>
    }
    return ProductEditOrCreationImageSelector;
})();

export default ProductEditOrCreationImageSelector;




