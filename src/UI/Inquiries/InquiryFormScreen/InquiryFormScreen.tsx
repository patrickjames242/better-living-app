import React, { useMemo } from 'react';
import { DefaultLongButtonsProps } from '../../../helpers/Buttons/LongTextAndIconButton';
import { Formik } from '../../../helpers/formik';
import { DefaultKeyboardConfigs, mapOptional } from '../../../helpers/general';
import {
  FormikMultilineTextFieldView,
  FormikTextFieldView,
} from '../../../helpers/Views/FormikTextFieldView';
import GenericEditingFormScreen from '../../../helpers/Views/GenericEditingFormScreen';
import store from '../../../redux/store';
import * as Yup from 'yup';
import { submitInquiry } from '../../../api/submitInquiry';
import { displayErrorMessage } from '../../../helpers/Alerts';
import { StackScreenProps } from '@react-navigation/stack';
import { InquiriesNavStackParams } from '../navigationHelpers';

const InquiryFormScreen = (() => {
  interface Values {
    email: string;
    name: string;
    subject: string;
    description: string;
    phoneNumber: string;
  }

  const fieldIsRequired = (fieldName: string) =>
    fieldName + ' is a required field.';

  const InquiryFormScreen = (
    props: StackScreenProps<InquiriesNavStackParams, 'InquiryForm'>,
  ) => {
    const initialValues: Values = useMemo(() => {
      const currentUser = store.getState().authentication?.userObject;
      return {
        email: currentUser?.email ?? '',
        name:
          mapOptional(currentUser, x => x.firstName + ' ' + x.lastName) ?? '',
        subject: '',
        description: '',
        phoneNumber: currentUser?.phoneNumber ?? '',
      };
    }, []);

    return (
      <Formik<Values>
        initialValues={initialValues}
        validationSchema={Yup.object({
          email: Yup.string().trim().required(fieldIsRequired('Contact Email')),
          name: Yup.string().trim().required(fieldIsRequired('Full Name')),
          subject: Yup.string().trim().required(fieldIsRequired('Subject')),
          description: Yup.string()
            .trim()
            .required(fieldIsRequired('Description')),
          phoneNumber: Yup.string(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          submitInquiry({
            email: values.email.trim(),
            name: values.name.trim(),
            subject: values.subject.trim(),
            description: values.description.trim(),
            phone_number: (() => {
              const x = values.phoneNumber.trim();
              return x.length >= 1 ? x : undefined;
            })(),
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
              navBarTitle="Ask a Question"
              longButtons={[
                {
                  ...DefaultLongButtonsProps.saveChanges,
                  isLoading: formik.isSubmitting,
                  onPress: formik.submitForm,
                },
              ]}
            >
              <FormikTextFieldView<Values>
                formikFieldName="email"
                topTitleText="Contact Email"
                textInputProps={DefaultKeyboardConfigs.email}
              />
              <FormikTextFieldView<Values>
                formikFieldName="phoneNumber"
                topTitleText="Phone Number"
                textInputProps={DefaultKeyboardConfigs.phoneNumber}
              />
              <FormikTextFieldView<Values>
                formikFieldName="name"
                topTitleText="Full Name"
                textInputProps={DefaultKeyboardConfigs.name}
              />
              <FormikTextFieldView<Values>
                formikFieldName="subject"
                topTitleText="Subject"
                textInputProps={DefaultKeyboardConfigs.title}
              />
              <FormikMultilineTextFieldView<Values>
                formikFieldName="description"
                topTitleText="Description"
                textInputProps={DefaultKeyboardConfigs.description}
              />
            </GenericEditingFormScreen>
          );
        }}
      </Formik>
    );
  };

  return InquiryFormScreen;
})();

export default InquiryFormScreen;
