
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import GenericEditingFormScreen from '../../../../helpers/Views/GenericEditingFormScreen';
import { TextFieldView, MultilineTextFieldView } from '../../../../helpers/Views/TextFieldView';
import { SettingsNavStackParams } from '../../navigationHelpers';
import { StackScreenProps } from '@react-navigation/stack';
import ProductEditOrCreationInfoTagsSelector from './ProductEditOrCreationInfoTagsSelector';
import { Set } from 'immutable';
import { useSelector } from '../../../../redux/store';
import { mapOptional } from '../../../../helpers/general';
import ProductEditOrCreationImageSelector from './ProductEditOrCreationImageSelector';
import ProductEditOrCreationIndividualPriceSelector from './ProductEditOrCreationIndividualPriceSelector';



const ProductEditOrCreationScreen = (() => {

    const styles = StyleSheet.create({
        root: {

        },
    });

    const ProductEditOrCreationScreen = (props: StackScreenProps<SettingsNavStackParams, 'ProductEditOrCreate'>) => {

        const product = useSelector(state => {
            return mapOptional(props.route.params.productId, id => {
                return state.orderingSystem.products.get(id);
            });
        });

        const [title, setTitle] = useState(product?.title ?? '');
        const [infoTagIds, setInfoTagIds] = useState(product?.infoTagIds ?? Set<number>());
        const [imageSource, setImageSource] = useState<{ uri: string, file: File } | null | undefined>(undefined);
        const [priceString, setPriceString] = useState(mapOptional(product?.individualPrice, x => x.toFixed(2)) ?? '');
        const [shouldBeSoldIndividually, setShouldBeSoldIndividually] = useState(product?.shouldBeSoldIndividually ?? false);
        const [description, setDescription] = useState(product?.description ?? '');

        const navBarTitle = (() => {
            if (props.route.params.productId == null) {
                return "Create Product";
            } else {
                return "Edit Product";
            }
        })();

        return <GenericEditingFormScreen
            navBarTitle={navBarTitle}
            saveChangesButtonProps={{
                onPress: () => { },
            }}
        >
            <TextFieldView
                topTitleText="Title"
                value={title}
                onValueChange={setTitle}
            />
            <ProductEditOrCreationInfoTagsSelector
                selectedInfoTagIds={infoTagIds}
                onSelectedIdsChanged={setInfoTagIds}
            />
            <ProductEditOrCreationImageSelector
                imageUri={(() => {
                    return (imageSource === undefined) ? (product?.imageUrl ?? null) : (imageSource?.uri ?? null);
                })()}
                onImageUpdate={(imageSource) => {
                    setImageSource(imageSource);
                }}
            />
            <ProductEditOrCreationIndividualPriceSelector
                priceString={priceString}
                onPriceDidChange={setPriceString}
                shouldBeSoldIndividually={shouldBeSoldIndividually}
                onShouldBeSoldIndividuallyDidChange={setShouldBeSoldIndividually}
            />
            <MultilineTextFieldView
                topTitleText="Description"
                value={description}
                onValueChange={setDescription}
            />
        </GenericEditingFormScreen>
    }
    return ProductEditOrCreationScreen;
})();

export default ProductEditOrCreationScreen;

