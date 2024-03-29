import React, { useMemo } from 'react';
import GenericEditingFormScreen from '../../../helpers/Views/GenericEditingFormScreen';
import { DefaultLongButtonsProps } from '../../../helpers/Buttons/LongTextAndIconButton';
import { Formik } from '../../../helpers/formik';
import { StackScreenProps } from '@react-navigation/stack';
import { FormikTextFieldView } from '../../../helpers/Views/FormikTextFieldView';
import * as yup from 'yup';
import { changeEmail } from '../../../api/authentication/userRequests';
import { useSelector } from '../../../redux/store';
import { SettingsNavStackParams } from '../navigationHelpers';
import { displayErrorMessage } from '../../../helpers/Alerts';
import { DefaultKeyboardConfigs } from '../../../helpers/general';

interface EmailEditingValues {
  email: string;
}

const SettingsEmailEditingScreen = (
  props: StackScreenProps<SettingsNavStackParams, 'EmailEditing'>,
) => {
  const userObject = useSelector(state => state.authentication?.userObject);
  const initialValues: EmailEditingValues = useMemo(
    () => ({
      email: userObject?.email ?? '',
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }),
    [],
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={yup.object({
        email: yup
          .string()
          .trim()
          .required('Email is a required field.')
          .email('Email must be a valid email.'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        if (userObject == null) {
          return;
        }
        changeEmail({
          password: props.route.params.password,
          new_email: values.email.trim(),
        })
          .finally(() => {
            setSubmitting(false);
          })
          .then(() => {
            props.navigation.goBack();
          })
          .catch(error => {
            displayErrorMessage(error.message);
          });
      }}
    >
      {formik => {
        return (
          <GenericEditingFormScreen
            navBarTitle="Edit Email"
            longButtons={[
              {
                ...DefaultLongButtonsProps.saveChanges,
                isLoading: formik.isSubmitting,
                onPress: formik.submitForm,
                isEnabled:
                  formik.isValid &&
                  formik.dirty &&
                  formik.initialValues.email.trim() !==
                    formik.values.email.trim(),
              },
            ]}
          >
            <FormikTextFieldView<EmailEditingValues>
              topTitleText="Email"
              formikFieldName="email"
              textInputProps={DefaultKeyboardConfigs.email}
            />
          </GenericEditingFormScreen>
        );
      }}
    </Formik>
  );
};

export default SettingsEmailEditingScreen;
