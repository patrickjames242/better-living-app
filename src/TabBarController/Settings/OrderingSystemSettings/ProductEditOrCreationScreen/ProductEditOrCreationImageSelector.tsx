

import React from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import AspectRatioView from '../../../../helpers/Views/AspectRatioView';
import LayoutConstants from '../../../../LayoutConstants';
import { TextFieldViewContainer } from '../../../../helpers/Views/TextFieldView';
import { displayErrorMessage } from '../../../../helpers/general';
import SpacerView from '../../../../helpers/Spacers/SpacerView';
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker';
import URLParse from 'url-parse';
import SelectableRoundedTextButton from '../SelectableRoundedTextButton';
import { useField } from '../../../../helpers/formik';
import { ProductEditOrCreateValues } from './helpers';

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

    async function getImageFromUser(): Promise<{uri: string, file: File} | null>{

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

            const documentName = (() => {
                const paths = URLParse(result.uri).pathname.split('/').filter(x => x !== '');
                return paths[paths.length - 1];
            })();
        
            return {uri: result.uri, file: new File([await (await fetch(result.uri)).blob()], documentName)};
        } else {

            const documentPickerResult = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
    
            if (documentPickerResult.type !== 'success'){
                return Promise.reject(new Error("An error occured when trying to pick a document from the document picker."));
            }
            if (documentPickerResult.file instanceof File){
                return {uri: documentPickerResult.uri, file: documentPickerResult.file};
            }
            
            const file = new File([await (await fetch(documentPickerResult.uri)).blob()], documentPickerResult.name);
            return {uri: documentPickerResult.uri, file: file};
        }

    }

    const ProductEditOrCreationImageSelector = (props: ProductEditOrCreationImageSelectorProps) => {

        const [,{value}, {setValue}] = useField<ProductEditOrCreateValues, 'imageSource'>('imageSource');

        function onUpdateImagePressed(){
            getImageFromUser().then(result => {
                setValue(result);
            }).catch(error => {
                displayErrorMessage(error.message);
            });
        }

        function onRemoveImage(){
            setValue(null);
        }

        return <TextFieldViewContainer topTitleText="Product Image" >
            <SpacerView style={styles.innerHolder} space={10}>
                {value?.uri &&
                    <AspectRatioView style={styles.imageHolder} heightPercentageOfWidth={LayoutConstants.productImageHeightPercentageOfWidth}>
                        <Image style={styles.image} source={{ uri: value.uri }} />
                    </AspectRatioView>}
                <SpacerView space={10} style={styles.buttonHolder}>
                    <SelectableRoundedTextButton title={value?.uri ? 'Update Image' : 'Add Image'} onPress={onUpdateImagePressed}/>
                    {value?.uri && <SelectableRoundedTextButton title="Remove Image" onPress={onRemoveImage}/>}
                </SpacerView>
            </SpacerView>
        </TextFieldViewContainer>
    }
    return ProductEditOrCreationImageSelector;
})();

export default ProductEditOrCreationImageSelector;




