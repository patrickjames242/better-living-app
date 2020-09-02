
import React from 'react';
import GenericEditingFormScreen, { GenericEditingFormScreenProps } from '../../../../helpers/Views/GenericEditingFormScreen';
import { LongTextAndIconButtonProps, DefaultLongButtonsProps } from '../../../../helpers/Buttons/LongTextAndIconButton';

interface OrderingSystemEditingFormScreenProps extends Omit<GenericEditingFormScreenProps, 'longButtons'>{
    saveButtonProps?: Partial<LongTextAndIconButtonProps>;
    shouldShowDeleteButton?: boolean;
    deleteButtonProps?: Partial<LongTextAndIconButtonProps>;
}

const OrderingSystemEditingFormScreen = (props: OrderingSystemEditingFormScreenProps) => {
    return <GenericEditingFormScreen {...props} longButtons={[
        {
            ...DefaultLongButtonsProps.saveChanges,
            ...props.saveButtonProps,
        },
        ...(props.shouldShowDeleteButton ?? false ? [{
            ...DefaultLongButtonsProps.delete,
            ...props.deleteButtonProps,
        }] : [])
    ]}/>
}


export default OrderingSystemEditingFormScreen;
