
import { Formik as DefaultFormik, FormikValues, FormikProps, FieldInputProps, FieldMetaProps, FieldHelperProps, useFormikContext as defaultUseFormikContext, useFormik as defaultUseFormik , FormikContextType, FormikConfig, FieldHookConfig, useField as defaultUseField } from 'formik';



type HandleChange<Key extends string> = (name: Key) => (newValue: string) => void;

type HandleBlur<Key extends string> = (name: Key) => (e: any) => void;

interface CustomFieldInputProps<Key extends string, Value> extends Omit<FieldInputProps<Value>, 'onChange' | 'onBlur'>{
    name: Key;
    onChange: HandleChange<Key>;
    onBlur: HandleBlur<Key>;
}

type AdjustedFormikPropsType<Type, Values extends FormikValues = FormikValues> = Omit<Type, 'handleChange' | 'getFieldProps' | 'getFieldMeta' | 'getFieldHelpers' | 'handleBlur'> & {

    handleChange: HandleChange<keyof Values & string>;
    getFieldProps: <Key extends keyof Values & string>(name: Key) => CustomFieldInputProps<Key, Values[Key]>;
    getFieldMeta: <Key extends keyof Values & string>(name: Key) => FieldMetaProps<Values[Key]>;
    getFieldHelpers: <Key extends keyof Values & string>(name: Key) => FieldHelperProps<Values[Key]>;
    handleBlur: HandleBlur<keyof Values & string>;
    // setFieldValue: (field: keyof Values & string, value: any, shouldValidate?: boolean) => void;
    // setFieldError: (field: keyof Values & string) => void;
    // setFieldTouched: (field: keyof Values & string, isTouched?: boolean, shouldValidate?: boolean) => void;

}

export function useFormikContext<Values>(): AdjustedFormikPropsType<FormikContextType<Values>, Values>{
    return defaultUseFormikContext as any;
}

type CustomFormikProps<Values extends FormikValues = FormikValues> = AdjustedFormikPropsType<FormikProps<Values>, Values>;


interface CustomFormikConfig<Values> extends FormikConfig<Values>{
    children?: ((props: CustomFormikProps<Values>) => React.ReactNode) | React.ReactNode;
}

export const Formik: <Values extends FormikValues = FormikValues, ExtraProps = {}>(props: CustomFormikConfig<Values> & ExtraProps) => JSX.Element = DefaultFormik;


export const useFormik: <Values extends FormikValues = FormikValues>(config: CustomFormikConfig<Values>) => CustomFormikProps<Values> = defaultUseFormik as any;


export const useField: <Values extends object, Key extends keyof Values & string>(propsOrFieldName: Key | FieldHookConfig<Values[Key]>) => [CustomFieldInputProps<Key, Values[Key]>, FieldMetaProps<Values[Key]>, FieldHelperProps<Values[Key]>] = defaultUseField as any;


