
import React, { useMemo, useState } from 'react';
import { SettingsNavStackParams } from '../../../navigationHelpers';
import { StackScreenProps } from '@react-navigation/stack';
import ProductEditOrCreationInfoTagsSelector from './ProductEditOrCreationInfoTagsSelector';
import { Set } from 'immutable';
import { useSelector } from '../../../../../redux/store';
import { mapOptional, displayErrorMessage, Optional, RNFileForUpload } from '../../../../../helpers/general';
import ProductEditOrCreationImageSelector from './ProductEditOrCreationImageSelector';
import ProductEditOrCreationIndividualPriceSelector from './ProductEditOrCreationIndividualPriceSelector';
import { Formik } from '../../../../../helpers/formik';
import { ProductEditOrCreateValues } from './helpers';
import { FormikMultilineTextFieldView, FormikTextFieldView } from '../../../../../helpers/Views/FormikTextFieldView';
import * as Yup from 'yup';
import { ProductRequestObj, createNewProduct, updateProduct, deleteProduct } from '../../../../../api/orderingSystem/products/requests';
import OrderingSystemEditingFormScreen from '../OrderingSystemEditingFormScreen';


const ProductEditOrCreationScreen = (() => {

    function submitForm(values: ProductEditOrCreateValues, initialValues: ProductEditOrCreateValues, productId: Optional<number>){
        const individual_price = (() => {
            const price = Number(values.priceString);
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
            priceString: mapOptional(product?.individualPrice, x => x.toFixed(2)) ?? '',
            shouldBeSoldIndividually: product?.shouldBeSoldIndividually ?? false,
            description: product?.description ?? '',
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }), []);


        return <Formik<ProductEditOrCreateValues>
            initialValues={initialValues}
            validationSchema={Yup.object({
                title: Yup.string().trim().required(),
                priceString: Yup.string().matches(/^[0-9]+(.[0-9]{2})?$/, "price format is invalid, it must follow the format: '15' or '15.99'"),
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
                <FormikTextFieldView<ProductEditOrCreateValues> formikFieldName="title" topTitleText="Title" />
                <ProductEditOrCreationInfoTagsSelector />
                <ProductEditOrCreationImageSelector />
                <ProductEditOrCreationIndividualPriceSelector />
                <FormikMultilineTextFieldView<ProductEditOrCreateValues> formikFieldName="description" topTitleText="Description" />
            </OrderingSystemEditingFormScreen>
        }}</Formik>


    }
    return ProductEditOrCreationScreen;
})();

export default ProductEditOrCreationScreen;

