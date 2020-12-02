import React, { useMemo } from 'react';
import { DefaultLongButtonsProps } from '../../../../helpers/Buttons/LongTextAndIconButton';
import { Formik } from '../../../../helpers/formik';
import { DefaultKeyboardConfigs } from '../../../../helpers/general';
import { FormikTextFieldView } from '../../../../helpers/Views/FormikTextFieldView';
import GenericEditingFormScreen from '../../../../helpers/Views/GenericEditingFormScreen';
import store from '../../../../redux/store';
import * as yup from 'yup';
import { updateGlobalSettings } from '../../../../api/globalSettings/requests';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../navigationHelpers';
import { displayErrorMessage } from '../../../../helpers/Alerts';

interface Values {
    vatPercentage: string;
}

function parsePercentageString(string: string){
    const trimmedPercentString = string.trim();
    return Number(trimmedPercentString.substring(0, trimmedPercentString.length - 1)) / 100
}

const EditVatPercentageScreen = (props: StackScreenProps<SettingsNavStackParams, 'EditVatPercentageScreen'>) => {

    const intialValues: Values = useMemo(() => {
        return {
            vatPercentage: (store.getState().globalSettings.vatPercentage * 100) + '%'
        };
    }, []);

    return <Formik
        initialValues={intialValues}
        validationSchema={yup.object({
            vatPercentage: yup.string().trim().required('Vat Percentage field is required').matches(/^\d+(\.\d+)?%$/, 'Vat Percentage must follow the format 15% or 15.5%'),
        })}
        onSubmit={(values, {setSubmitting}) => {
            const percentage = parsePercentageString(values.vatPercentage);
            updateGlobalSettings({vat_percentage: percentage}).finally(() => {
                setSubmitting(false);
            }).then(() => {
                props.navigation.goBack();
            }).catch(errorMessage => {
                displayErrorMessage(errorMessage);
            });
        }}
    >{formik => {
        return <GenericEditingFormScreen
            navBarTitle="Vat Percentage"
            longButtons={[{
                ...DefaultLongButtonsProps.saveChanges,
                onPress: formik.submitForm,
                isLoading: formik.isSubmitting,
                isEnabled: formik.isValid && formik.dirty && parsePercentageString(formik.initialValues.vatPercentage) !== parsePercentageString(formik.values.vatPercentage),
            }]}
        >
            <FormikTextFieldView<Values> formikFieldName="vatPercentage" topTitleText="Vat Percentage" textInputProps={DefaultKeyboardConfigs.price} />
        </GenericEditingFormScreen>
    }}</Formik>

}

export default EditVatPercentageScreen;
