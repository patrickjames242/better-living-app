
import React, { PropsWithChildren } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import CustomKeyboardAvoidingView from './CustomKeyboardAvoidingView';
import LayoutConstants from '../../LayoutConstants';
import LongTextAndIconButton, { LongTextAndIconButtonProps } from '../Buttons/LongTextAndIconButton';
import NavigationControllerNavigationBar from '../NavigationController/NavigationControllerNavigationBar';
import SpacerView from '../Spacers/SpacerView';
import Space from '../Spacers/Space';
import { PartialBy } from '../general';
import AssetImages from '../../images/AssetImages';


export interface GenericEditingFormScreenProps extends PropsWithChildren<{}> {
    navBarTitle: string;
    saveChangesButtonProps: PartialBy<LongTextAndIconButtonProps, 'text' | 'iconSource'>,
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
                <SpacerView style={styles.inputsHolder} space={25}>
                    {props.children}
                </SpacerView>
                <Space space={15} />
                <LongTextAndIconButton
                    {...props.saveChangesButtonProps}
                    iconSource={props.saveChangesButtonProps.iconSource ?? AssetImages.saveIcon}
                    style={[styles.saveChangesButton, props.saveChangesButtonProps.style]}
                    text={props.saveChangesButtonProps.text ?? "Save Changes"}
                />
            </ScrollView>
        </CustomKeyboardAvoidingView>
    }
    return GenericEditingFormScreen;
})();

export default GenericEditingFormScreen;

