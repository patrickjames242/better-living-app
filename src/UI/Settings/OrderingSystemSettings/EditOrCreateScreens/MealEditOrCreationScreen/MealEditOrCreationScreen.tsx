
import React, { useMemo, useState } from 'react';
import { Formik } from '../../../../../helpers/formik';
import { MealEditOrCreationValues } from './helpers';
import store, { useSelector } from '../../../../../redux/store';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../../navigationHelpers';
import { mapOptional, YUP_EDITING_FORM_PRICE_STRING, Optional, DefaultKeyboardConfigs } from '../../../../../helpers/general';
import { Set } from 'immutable';
import * as yup from 'yup';
import OrderingSystemEditingFormScreen from '../OrderingSystemEditingFormScreen';
import { FormikTextFieldView } from '../../../../../helpers/Views/FormikTextFieldView';
import MealEditOrCreationCategoriesSelector from './MealEditOrCreationCategoriesSelector';
import { MealRequestObj, createNewMeal, updateMeal, deleteMeal } from '../../../../../api/orderingSystem/meals/requests';
import { displayErrorMessage } from '../../../../../helpers/Alerts';
import currency from 'currency.js';

const MealEditOrCreationScreen = (() => {

    function submitForm(mealId: Optional<number>, values: MealEditOrCreationValues) {
        const requestObj: MealRequestObj = {
            title: values.title,
            price: currency(values.priceString.trim()).toJSON(),
            product_categories: values.productCategoryIds.toArray().map(id => ({ id, order_num: 0 })),
        }
        return mealId == null ? createNewMeal(requestObj) : updateMeal(mealId, requestObj);
    }

    const MealEditOrCreationScreen = (props: StackScreenProps<SettingsNavStackParams, 'MealEditOrCreate'>) => {

        const mealId = props.route.params.mealId;

        const meal = useSelector(state => {
            return mapOptional(mealId, x => state.orderingSystem.meals.get(x));
        });


        const initialValues: MealEditOrCreationValues = useMemo(() => {
            const productCategoriesReduxState = store.getState().orderingSystem.mealCategories;
            return {
                title: meal?.title ?? '',
                priceString: mapOptional(meal?.price, x => currency(x).format()) ?? '',
                productCategoryIds: Set<number>().withMutations(set => {
                    const categories = meal?.productCategories;
                    if (categories == null) return;
                    categories.forEach(category => {
                        if (productCategoriesReduxState.has(category.id)) set.add(category.id);
                    });
                }),
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        const [isDeleting, setIsDeleting] = useState(false);

        return <Formik
            initialValues={initialValues}
            validationSchema={yup.object({
                title: yup.string().trim().required(),
                priceString: YUP_EDITING_FORM_PRICE_STRING('price').required("price is a required field"),
            })}
            onSubmit={(values, { setSubmitting }) => {
                submitForm(props.route.params.mealId, values).finally(() => {
                    setSubmitting(false);
                }).then(() => {
                    props.navigation.goBack();
                }).catch(error => {
                    displayErrorMessage(error.message);
                });
            }}
        >{formik => {

            const navBarTitle = mealId == null ? 'Create New Meal' : 'Edit Meal';

            const shouldButtonsBeEnabled = formik.isSubmitting === false && isDeleting === false;

            return <OrderingSystemEditingFormScreen
                navBarTitle={navBarTitle}
                saveButtonProps={{
                    onPress: formik.submitForm,
                    isLoading: formik.isSubmitting,
                    isEnabled: shouldButtonsBeEnabled,
                }}
                shouldShowDeleteButton={typeof mealId === 'number'}
                deleteButtonProps={{
                    text: 'Delete Meal',
                    isLoading: isDeleting,
                    isEnabled: shouldButtonsBeEnabled,
                    onPress: () => {
                        if (typeof mealId !== 'number') { return; }
                        setIsDeleting(true);
                        deleteMeal(mealId).finally(() => {
                            setIsDeleting(false);
                        }).then(() => {
                            props.navigation.goBack();
                        }).catch(error => {
                            displayErrorMessage(error.message);
                        })
                    }
                }}
            >
                <FormikTextFieldView<MealEditOrCreationValues> topTitleText="Title" formikFieldName="title" textInputProps={DefaultKeyboardConfigs.title} />
                <FormikTextFieldView<MealEditOrCreationValues> topTitleText="Price" formikFieldName="priceString" placeholder="e.g. 15.99" textInputProps={DefaultKeyboardConfigs.price} />
                <MealEditOrCreationCategoriesSelector />
            </OrderingSystemEditingFormScreen>
        }}</Formik>
    }
    return MealEditOrCreationScreen;
})();

export default MealEditOrCreationScreen;
