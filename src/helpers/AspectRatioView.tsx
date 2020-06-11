
import React from 'react';
import { View, StyleSheet, ViewProperties } from 'react-native';
import { limitNumber } from './general';


export interface AspectRatioViewProps extends ViewProperties{
    // expects a percentage expressed as a decimal between 0 and 1
    heightPercentageOfWidth: number
}


// this view uses padding to maintain a height equal to the provided percentage of whatever the width currently is
const AspectRatioView = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        contentHolderHolder: {

        },
        contentHolder: {
            ...StyleSheet.absoluteFillObject
        }

    });

    const AspectRatioView: React.ForwardRefRenderFunction<View, React.PropsWithChildren<AspectRatioViewProps>> = function(props, ref){

        const paddingTop = (limitNumber(props.heightPercentageOfWidth, 0, 1) * 100) + "%";

        return <View ref={ref} {...props} style={[props.style, styles.root]}>
            <View style={[styles.contentHolderHolder, {paddingTop}]}>
                <View style={styles.contentHolder}>{props.children}</View>
            </View>
        </View>
    }

    return AspectRatioView;

})();

export default React.forwardRef(AspectRatioView);
