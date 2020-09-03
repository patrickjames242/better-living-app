
import React, { PropsWithChildren } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import CustomKeyboardAvoidingView from './CustomKeyboardAvoidingView';
import LayoutConstants from '../../LayoutConstants';
import LongTextAndIconButton, { LongTextAndIconButtonProps } from '../Buttons/LongTextAndIconButton';
import NavigationControllerNavigationBar from './NavigationControllerNavigationBar';
import SpacerView from '../Spacers/SpacerView';
import Space from '../Spacers/Space';
import { TextFieldViewContainer } from './TextFieldView';

export const GenericEditingFormScreenConstants = {
    childrenSpacing: 25,
}

export interface GenericEditingFormScreenProps extends PropsWithChildren<{}> {
    navBarTitle: string;
    longButtons?: LongTextAndIconButtonProps[],
    formHasErrors?: boolean;
}

const GenericEditingFormScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
        scrollView: {
            flex: 1,
            zIndex: -1,
        },
        scrollViewContentContainer: {
            ...LayoutConstants.maxWidthListContentContainerStyles(),
        },
        inputsHolder: {
            backgroundColor: 'white',
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            padding: LayoutConstants.floatingCellStyles.padding,
        },
        saveChangesButton: {
            maxWidth: LayoutConstants.bottomScreenButtonWithGradient.maxWidth,
            width: '100%',
            alignSelf: 'center',
        }
    });

    const GenericEditingFormScreen = (props: GenericEditingFormScreenProps) => {
        return <CustomKeyboardAvoidingView style={styles.root}>
            <NavigationControllerNavigationBar title={props.navBarTitle} />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContentContainer}>
                <TextFieldViewContainer errorMessage={(props.formHasErrors ?? false) ? 'This form has errors above.' : undefined}>
                    <SpacerView style={styles.inputsHolder} space={GenericEditingFormScreenConstants.childrenSpacing}>
                        {props.children}
                    </SpacerView>
                </TextFieldViewContainer>
                <Space space={15} />
                {/* eslint-disable react/no-children-prop */}
                <SpacerView
                    space={10}
                    children={props.longButtons?.map((x, index) => {
                        return <LongTextAndIconButton key={index} {...x} style={[styles.saveChangesButton, x.style]} />
                    }) ?? []}
                />
                {/* eslint-enable react/no-children-prop */}
            </ScrollView>
        </CustomKeyboardAvoidingView>
    }
    return GenericEditingFormScreen;
})();

export default GenericEditingFormScreen;

