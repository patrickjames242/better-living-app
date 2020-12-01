
import React, { useMemo, useState } from 'react';
import { SettingsNavStackParams } from '../../../navigationHelpers';
import { StackScreenProps } from '@react-navigation/stack';
import { Set } from 'immutable';
import { useSelector } from '../../../../../redux/store';
import { DefaultKeyboardConfigs, mapOptional, Optional, YUP_EDITING_FORM_PRICE_STRING } from '../../../../../helpers/general';
import ProductEditOrCreationImageSelector from './ProductEditOrCreationImageSelector';
import ProductEditOrCreationIndividualPriceSelector from './ProductEditOrCreationIndividualPriceSelector';
import { Formik } from '../../../../../helpers/formik';
import { ProductEditOrCreateValues } from './helpers';
import { FormikMultilineTextFieldView, FormikTextFieldView } from '../../../../../helpers/Views/FormikTextFieldView';
import * as Yup from 'yup';
import { ProductRequestObj, createNewProduct, updateProduct, deleteProduct } from '../../../../../api/orderingSystem/products/requests';
import OrderingSystemEditingFormScreen from '../OrderingSystemEditingFormScreen';
import ProductEditOrCreationInfoTagsSelector from './ProductEditOrCreationInfoTagsSelector';
import { displayErrorMessage } from '../../../../../helpers/Alerts';
import { RNFileForUpload } from '../../../../../helpers/RNFileForUpload';
import currency from 'currency.js';


const ProductEditOrCreationScreen = (() => {

    function submitForm(values: ProductEditOrCreateValues, initialValues: ProductEditOrCreateValues, productId: Optional<number>){
        const individual_price = (() => {
            const price = currency(values.priceString.trim()).toJSON();
            return isNaN(price) ? null : price;
        })();

        const setImage: RNFileForUpload | null | undefined = (() => {
            if (values.imageSource?.fileToUpload instanceof RNFileForUpload) {
                return values.imageSource.fileToUpload;
            } else if (values.imageSource?.fileToUpload === null && initialValues.imageSource !== null) {
                return null;
            } else {
                return undefined;
            }
        })();

        const description = (() => {
            const x = values.description.trim();
            return (x.length >= 1) ? x : null;
        })();

        const requestObj: ProductRequestObj = {
            title: values.title.trim(),
            description,
            individual_price,
            should_be_sold_individually: values.shouldBeSoldIndividually,
            info_tag_ids: values.infoTagIds.toArray(),
            setImage,
        }
    
        return (() => {
            if (productId == null) {
                return createNewProduct(requestObj);
            } else {
                return updateProduct(productId, requestObj);
            }
        })();
    }

    const ProductEditOrCreationScreen = (props: StackScreenProps<SettingsNavStackParams, 'ProductEditOrCreate'>) => {

        const [isDeleteLoading, setIsDeleteLoading] = useState(false);

        const productId = props.route.params.productId

        const product = useSelector(state => {
            return mapOptional(productId, id => {
                return state.orderingSystem.products.get(id);
            });
        });

        const navBarTitle = (() => {
            if (productId == null) {
                return "Create Product";
            } else {
                return "Edit Product";
            }
        })();

        const initialValues: ProductEditOrCreateValues = useMemo(() => ({
            title: product?.title ?? '',
            infoTagIds: product?.infoTagIds ?? Set<number>(),
            imageSource: {uriToDisplayInForm: product?.imageUrl ?? undefined},
            priceString: currency(product?.individualPrice ?? 0).format(),
            shouldBeSoldIndividually: product?.shouldBeSoldIndividually ?? false,
            description: product?.description ?? '',
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }), []);

        return <Formik<ProductEditOrCreateValues>
            initialValues={initialValues}
            validationSchema={Yup.object({
                title: Yup.string().trim().required(),
                priceString: YUP_EDITING_FORM_PRICE_STRING('price'),
            })}
            onSubmit={(values, { setSubmitting }) => {
                submitForm(values, initialValues, props.route.params.productId).finally(() => {
                    setSubmitting(false);
                }).then(() => {
                    props.navigation.goBack();
                }).catch(error => {
                    displayErrorMessage(error.message);
                });
            }}
        >{formik => {

            const shouldButtonsBeEnabled = formik.isSubmitting === false && isDeleteLoading === false;

            return <OrderingSystemEditingFormScreen
                navBarTitle={navBarTitle}
                saveButtonProps={{
                    onPress: formik.submitForm,
                    isLoading: formik.isSubmitting,
                    isEnabled: shouldButtonsBeEnabled,
                }}
                shouldShowDeleteButton={typeof productId === 'number'}
                deleteButtonProps={{
                    text: 'Delete Product',
                    isLoading: isDeleteLoading,
                    isEnabled: shouldButtonsBeEnabled,
                    onPress: () => {
                        if (typeof productId !== 'number'){return;}
                        setIsDeleteLoading(true);
                        deleteProduct(productId).finally(() => {
                            setIsDeleteLoading(false);
                        }).then(() => {
                            props.navigation.goBack();
                        }).catch(error => {
                            displayErrorMessage(error.message);
                        });
                    }
                }}
            >
                <FormikTextFieldView<ProductEditOrCreateValues> formikFieldName="title" topTitleText="Title" textInputProps={DefaultKeyboardConfigs.title}/>
                <ProductEditOrCreationInfoTagsSelector />
                <ProductEditOrCreationImageSelector />
                <ProductEditOrCreationIndividualPriceSelector />
                <FormikMultilineTextFieldView<ProductEditOrCreateValues> formikFieldName="description" topTitleText="Description" textInputProps={DefaultKeyboardConfigs.description}/>
            </OrderingSystemEditingFormScreen>
        }}</Formik>


    }
    return ProductEditOrCreationScreen;
})();

export default ProductEditOrCreationScreen;

