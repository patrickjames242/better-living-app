
import React, { useRef, useImperativeHandle } from 'react';
import { StyleSheet } from 'react-native';
import BottomScreenGradientHolder, { BottomScreenGradientHolderProps, BottomScreenGradientHolderRef } from './BottomScreenGradientHolder';
import GreenTextAndIconButton, { GreenTextAndIconButtonProps } from './Buttons/GreenTextAndIconButton';
import LayoutConstants from '../LayoutConstants';
import { Optional } from './general';

export interface BottomScreenButtonWithGradientProps {
    buttonProps: GreenTextAndIconButtonProps;
    gradientHolderProps?: BottomScreenGradientHolderProps;
}

export interface BottomScreenButtonWithGradientRef{
    gradientHolder: Optional<BottomScreenGradientHolderRef>
}

const BottomScreenButtonWithGradient = (() => {

    const styles = StyleSheet.create({
        root: {
            paddingLeft: LayoutConstants.pageSideInsets,
            paddingRight: LayoutConstants.pageSideInsets,
            paddingBottom: LayoutConstants.bottomScreenButtonWithGradient.bottomPadding,
        },
        button: {
            maxWidth: LayoutConstants.bottomScreenButtonWithGradient.maxWidth,
            alignSelf: 'center',
            width: '100%',
        }
    });

    const BottomScreenButtonWithGradient: React.ForwardRefRenderFunction<BottomScreenButtonWithGradientRef, BottomScreenButtonWithGradientProps> = (props, ref) => {

        const gradientHolderRef = useRef<BottomScreenGradientHolderRef>(null);
        
        useImperativeHandle(ref, () => ({
            gradientHolder: gradientHolderRef.current,
        }), [])

        return <BottomScreenGradientHolder
            ref={gradientHolderRef}
            {...props.gradientHolderProps}
            style={[styles.root, props.gradientHolderProps?.style]}
        >
            <GreenTextAndIconButton
                {...props.buttonProps}
                style={[styles.button, props.buttonProps?.style]}
            />
        </BottomScreenGradientHolder>
    }
    return React.forwardRef(BottomScreenButtonWithGradient);
})();

export default BottomScreenButtonWithGradient;
