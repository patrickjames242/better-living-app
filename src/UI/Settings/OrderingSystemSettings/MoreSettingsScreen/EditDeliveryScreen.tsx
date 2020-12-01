
import React, { useMemo } from 'react';
import { DefaultLongButtonsProps } from '../../../../helpers/Buttons/LongTextAndIconButton';
import { Formik } from '../../../../helpers/formik';
import { DefaultKeyboardConfigs, YUP_EDITING_FORM_PRICE_STRING } from '../../../../helpers/general';
import { FormikTextFieldView } from '../../../../helpers/Views/FormikTextFieldView';
import GenericEditingFormScreen from '../../../../helpers/Views/GenericEditingFormScreen';
import store from '../../../../redux/store';
import * as yup from 'yup';
import { updateGlobalSettings } from '../../../../api/globalSettings/requests';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../navigationHelpers';
import { displayErrorMessage } from '../../../../helpers/Alerts';
import currency from 'currency.js';

interface Values {
    deliveryFee: string;
}

const EditDeliveryFeeScreen = (props: StackScreenProps<SettingsNavStackParams, 'EditDeliveryFee'>) => {

    const intialValues: Values = useMemo(() => {
        return {
            deliveryFee: currency(store.getState().globalSettings.deliveryFee).format(),
        };
    }, []);

    return <Formik
        initialValues={intialValues}
        validationSchema={yup.object({
            deliveryFee: YUP_EDITING_FORM_PRICE_STRING('Vat Percentage').required('Vat Percentage field is required'),
        })}
        onSubmit={(values, {setSubmitting}) => {
            const deliveryFee = currency(values.deliveryFee.trim()).toJSON();
            updateGlobalSettings({delivery_fee: deliveryFee}).finally(() => {
                setSubmitting(false);
            }).then(() => {
                props.navigation.goBack();
            }).catch(errorMessage => {
                displayErrorMessage(errorMessage);
            });
        }}
    >{formik => {
        return <GenericEditingFormScreen
            navBarTitle="Delivery Fee"
            longButtons={[{
                ...DefaultLongButtonsProps.saveChanges,
                onPress: formik.submitForm,
                isLoading: formik.isSubmitting,
            }]}
        >
            <FormikTextFieldView<Values> formikFieldName="deliveryFee" topTitleText="Delivery Fee" textInputProps={DefaultKeyboardConfigs.price} />
        </GenericEditingFormScreen>
    }}</Formik>

}

export default EditDeliveryFeeScreen;
