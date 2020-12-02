import React, { useMemo } from 'react';
import GenericEditingFormScreen from '../../../helpers/Views/GenericEditingFormScreen';
import { DefaultLongButtonsProps } from '../../../helpers/Buttons/LongTextAndIconButton';
import { Formik } from '../../../helpers/formik';
import { StackScreenProps } from '@react-navigation/stack';
import { FormikTextFieldView } from '../../../helpers/Views/FormikTextFieldView';
import * as yup from 'yup';
import { updateUserInfo } from '../../../api/authentication/userRequests';
import { useSelector } from '../../../redux/store';
import { SettingsNavStackParams } from '../navigationHelpers';
import { displayErrorMessage } from '../../../helpers/Alerts';
import { DefaultKeyboardConfigs } from '../../../helpers/general';



interface PhoneNumberEditingValues {
    phoneNumber: string;
}

const SettingsPhoneNumberEditingScreen = (props: StackScreenProps<SettingsNavStackParams, 'PhoneNumberEditing'>) => {

    const userObject = useSelector(state => state.authentication?.userObject);
    
    const initialValues: PhoneNumberEditingValues = useMemo(() => ({
        phoneNumber: userObject?.phoneNumber ?? '',
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

    return <Formik
        initialValues={initialValues}
        validationSchema={yup.object({
            phoneNumber: yup.string().trim().required('Phone number is a required field.'),
        })}
        onSubmit={(values, {setSubmitting}) => {
            if (userObject == null){return;}
            updateUserInfo(userObject.id, {
                phone_number: values.phoneNumber.trim(),
            }).finally(() => {
                setSubmitting(false);
            }).then(() => {
                props.navigation.goBack();
            }).catch(error => {
                displayErrorMessage(error.message);
            });
        }}
    >{formik => {
        return <GenericEditingFormScreen
            navBarTitle="Edit Phone Number"
            longButtons={[{
                ...DefaultLongButtonsProps.saveChanges,
                isLoading: formik.isSubmitting,
                onPress: formik.submitForm,
                isEnabled: formik.isValid && formik.dirty && formik.values.phoneNumber.trim() !== formik.initialValues.phoneNumber.trim(),
            }]}
        >
            <FormikTextFieldView<PhoneNumberEditingValues> topTitleText="First Name" formikFieldName="phoneNumber" textInputProps={DefaultKeyboardConfigs.phoneNumber}/>
        </GenericEditingFormScreen>
    }}</Formik>


}

export default SettingsPhoneNumberEditingScreen;

