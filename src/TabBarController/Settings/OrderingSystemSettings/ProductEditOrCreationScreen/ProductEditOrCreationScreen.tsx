
import React from 'react';
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
import { Formik } from '../../../../helpers/formik';
import { ProductEditOrCreateValues } from './helpers';



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

        const navBarTitle = (() => {
            if (props.route.params.productId == null) {
                return "Create Product";
            } else {
                return "Edit Product";
            }
        })();

        return <Formik<ProductEditOrCreateValues>
            initialValues={{
                title: product?.title ?? '',
                infoTagIds: product?.infoTagIds ?? Set<number>(),
                imageSource: undefined,
                priceString: mapOptional(product?.individualPrice, x => x.toFixed(2)) ?? '',
                shouldBeSoldIndividually: product?.shouldBeSoldIndividually ?? false,
                description: product?.description ?? '',
            }}
            onSubmit={values => {

            }}
        >{formik => (
            <GenericEditingFormScreen
                navBarTitle={navBarTitle}
                saveChangesButtonProps={{
                    onPress: formik.submitForm,
                    isLoading: formik.isSubmitting,
                }}
            >
                <TextFieldView
                    topTitleText="Title"
                    value={formik.values.title}
                    onValueChange={formik.handleChange('title')}
                    textInputProps={{onBlur: formik.handleBlur('title')}}
                />
                <ProductEditOrCreationInfoTagsSelector/>
                <ProductEditOrCreationImageSelector/>
                <ProductEditOrCreationIndividualPriceSelector/>
                <MultilineTextFieldView
                    topTitleText="Description"
                    value={formik.values.description}
                    onValueChange={formik.handleChange('description')}
                    textInputProps={{onBlur: formik.handleBlur('description')}}
                />
            </GenericEditingFormScreen>
        )}</Formik>


    }
    return ProductEditOrCreationScreen;
})();

export default ProductEditOrCreationScreen;

