
import React, { useMemo, useState } from 'react';
import GenericEditingFormScreen from '../../../../helpers/Views/GenericEditingFormScreen';
import { SettingsNavStackParams } from '../../navigationHelpers';
import { StackScreenProps } from '@react-navigation/stack';
import ProductEditOrCreationInfoTagsSelector from './ProductEditOrCreationInfoTagsSelector';
import { Set } from 'immutable';
import { useSelector } from '../../../../redux/store';
import { mapOptional, displayErrorMessage, Optional } from '../../../../helpers/general';
import ProductEditOrCreationImageSelector from './ProductEditOrCreationImageSelector';
import ProductEditOrCreationIndividualPriceSelector from './ProductEditOrCreationIndividualPriceSelector';
import { Formik } from '../../../../helpers/formik';
import { ProductEditOrCreateValues } from './helpers';
import { FormikMultilineTextFieldView, FormikTextFieldView } from '../../../../helpers/Views/FormikTextFieldView';
import * as Yup from 'yup';
import { ProductRequestObj, createNewProduct, updateProduct, deleteProduct } from '../../../../api/orderingSystem/products/requests';
import { DefaultLongButtonsProps } from '../../../../helpers/Buttons/LongTextAndIconButton';


const ProductEditOrCreationScreen = (() => {

    function submitForm(values: ProductEditOrCreateValues, initialValues: ProductEditOrCreateValues, productId: Optional<number>){
        const individual_price = (() => {
            const price = Number(values.priceString);
            return isNaN(price) ? null : price;
        })();

        const setImage: File | null | undefined = (() => {
            if (values.imageSource?.file instanceof File) {
                return values.imageSource.file;
            } else if (values.imageSource === null && initialValues.imageSource !== null) {
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

        const initialValues = useMemo(() => ({
            title: product?.title ?? '',
            infoTagIds: product?.infoTagIds ?? Set<number>(),
            imageSource: mapOptional(product?.imageUrl, x => ({ uri: x })) ?? null,
            priceString: mapOptional(product?.individualPrice, x => x.toFixed(2)) ?? '',
            shouldBeSoldIndividually: product?.shouldBeSoldIndividually ?? false,
            description: product?.description ?? '',
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }), []);


        return <Formik<ProductEditOrCreateValues>
            initialValues={initialValues}
            validationSchema={Yup.object({
                title: Yup.string().required(),
                priceString: Yup.string().matches(/^[0-9]+(.[0-9]{2})?$/, "price format invalid, must follow format: '15' or '15.99'"),
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
        >{formik => (
            <GenericEditingFormScreen
                navBarTitle={navBarTitle}
                longButtons={[
                    {
                        ...DefaultLongButtonsProps.saveChanges,
                        onPress: formik.submitForm,
                        isLoading: formik.isSubmitting,
                        isEnabled: isDeleteLoading === false,
                    },
                    ...(productId ? [{
                        ...DefaultLongButtonsProps.delete,
                        isLoading: isDeleteLoading,
                        isEnabled: formik.isSubmitting === false,
                        onPress: () => {
                            setIsDeleteLoading(true);
                            deleteProduct(productId).finally(() => {
                                setIsDeleteLoading(false);
                            }).then(() => {
                                props.navigation.goBack();
                            }).catch(error => {
                                displayErrorMessage(error.message);
                            });
                        }
                    }] : [])
                ]}
            >
                <FormikTextFieldView<ProductEditOrCreateValues> formikFieldName="title" topTitleText="Title" />
                <ProductEditOrCreationInfoTagsSelector />
                <ProductEditOrCreationImageSelector />
                <ProductEditOrCreationIndividualPriceSelector />
                <FormikMultilineTextFieldView<ProductEditOrCreateValues> formikFieldName="description" topTitleText="Description" />
            </GenericEditingFormScreen>
        )}</Formik>


    }
    return ProductEditOrCreationScreen;
})();

export default ProductEditOrCreationScreen;

