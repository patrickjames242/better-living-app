import React from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import AspectRatioView from '../../../../../helpers/Views/AspectRatioView';
import LayoutConstants from '../../../../../LayoutConstants';
import { TextFieldViewContainer } from '../../../../../helpers/Views/TextFieldView';
import { RNFileForUpload } from '../../../../../helpers/RNFileForUpload';
import SpacerView from '../../../../../helpers/Spacers/SpacerView';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import SelectableRoundedTextButton from '../../SelectableRoundedTextButton';
import { useField } from '../../../../../helpers/formik';
import { ProductEditOrCreateValues } from './helpers';
import { displayErrorMessage } from '../../../../../helpers/Alerts';

export interface ProductEditOrCreationImageSelectorProps {}

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

  // ONLY WORKS ON THE WEB
  function getFileForBase64Image(base64: string, fileName: string) {
    if (Platform.OS !== 'web') {
      throw new Error('This function only works on the web!!');
    }

    // extract content type and base64 payload from original string
    const pos = base64.indexOf(';base64,');
    const type = base64.substring(5, pos);
    const b64 = base64.substr(pos + 8);

    // decode base64
    const imageContent = atob(b64);

    // create an ArrayBuffer and a view (as unsigned 8-bit)
    const buffer = new ArrayBuffer(imageContent.length);
    const view = new Uint8Array(buffer);

    // fill the view, using the decoded base64
    for (let n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }

    // convert ArrayBuffer to Blob
    const blob = new Blob([buffer], { type: type });
    return new File([blob], fileName);
  }

  async function compressImage(uri: string) {
    return await ImageManipulator.manipulateAsync(uri, undefined, {
      compress: 0.15,
    });
  }

  async function getImageFromUser(): Promise<{
    uri: string;
    fileToUpload: RNFileForUpload;
  } | null> {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      if (
        Platform.OS === 'ios' &&
        (await ImagePicker.getCameraRollPermissionsAsync()).granted === false &&
        (await ImagePicker.requestCameraPermissionsAsync()).granted === false
      ) {
        return Promise.reject(
          new Error(
            'You have not given this app permission to access your photo library. Please allow access in your settings.',
          ),
        );
      }
      const result = await ImagePicker.launchImageLibraryAsync();
      if (result.cancelled) {
        return null;
      }
      const compressedImageResult = await compressImage(result.uri);
      return {
        uri: compressedImageResult.uri,
        fileToUpload: new RNFileForUpload({ uri: compressedImageResult.uri }),
      };
    } else if (Platform.OS === 'web') {
      const documentPickerResult = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
      });
      if (documentPickerResult.type !== 'success') {
        return Promise.reject(
          new Error(
            'An error occured when trying to pick a document from the document picker.',
          ),
        );
      }
      const compressResult = await compressImage(documentPickerResult.uri);
      return {
        uri: compressResult.uri,
        fileToUpload: new RNFileForUpload({
          file: getFileForBase64Image(
            compressResult.uri,
            documentPickerResult.name,
          ),
        }),
      };
    } else {
      return null;
    }
  }

  const ProductEditOrCreationImageSelector = (
    props: ProductEditOrCreationImageSelectorProps,
  ) => {
    const [, { value }, { setValue }] = useField<
      ProductEditOrCreateValues,
      'imageSource'
    >('imageSource');

    function onUpdateImagePressed() {
      getImageFromUser()
        .then(result => {
          result &&
            setValue({
              uriToDisplayInForm: result.uri,
              fileToUpload: result.fileToUpload,
            });
        })
        .catch(error => {
          displayErrorMessage(error.message);
        });
    }

    function onRemoveImage() {
      setValue({ fileToUpload: null });
    }

    return (
      <TextFieldViewContainer topTitleText="Product Image">
        <SpacerView style={styles.innerHolder} space={10}>
          {value?.uriToDisplayInForm && (
            <AspectRatioView
              style={styles.imageHolder}
              heightPercentageOfWidth={
                LayoutConstants.productImageHeightPercentageOfWidth
              }
            >
              <Image
                style={styles.image}
                source={{ uri: value.uriToDisplayInForm }}
              />
            </AspectRatioView>
          )}
          <SpacerView space={10} style={styles.buttonHolder}>
            <SelectableRoundedTextButton
              title={value?.uriToDisplayInForm ? 'Update Image' : 'Add Image'}
              onPress={onUpdateImagePressed}
            />
            {value?.uriToDisplayInForm && (
              <SelectableRoundedTextButton
                title="Remove Image"
                onPress={onRemoveImage}
              />
            )}
          </SpacerView>
        </SpacerView>
      </TextFieldViewContainer>
    );
  };
  return ProductEditOrCreationImageSelector;
})();

export default ProductEditOrCreationImageSelector;
