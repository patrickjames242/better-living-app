
import React, { useRef } from 'react';
import { CustomFont } from "../fonts/fonts";
import { View, StyleSheet, LayoutChangeEvent, Text, LayoutRectangle } from "react-native";
import BaseNavigationBar from "./BaseNavigationBar";
import CustomizedText from "../Views/CustomizedText";
import Spacer from '../Spacers/Spacer';
import { Optional } from '../general';


const CenteredTitleNavigationBar = (() => {

    const styles = StyleSheet.create({
        contentView: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        titleHolder: {
            flex: 1,
        },
        title: {
            fontFamily: CustomFont.bold,
            fontSize: 18,
            textAlign: 'center',
        },
    });

    return function CenteredTitleNavigationBar(props: {
        title: string,
        leftAlignedView?: React.ReactElement,
        rightAlignedView?: React.ReactElement,
    }) {

        const textRef = useRef<Text>(null);

        const {onContentViewLayout, onTextHolderLayout} = useCenteringTextFunctionality(textRef);

        return <BaseNavigationBar>
            <View onLayout={onContentViewLayout} style={styles.contentView}>
                <Spacer space={10}>
                    {props.leftAlignedView}
                    <View onLayout={onTextHolderLayout} style={styles.titleHolder}>
                        <CustomizedText ref={textRef} numberOfLines={1} style={styles.title}>{props.title}</CustomizedText>
                    </View>
                    {props.rightAlignedView}
                </Spacer>
            </View>
        </BaseNavigationBar>
    };

})();

export default CenteredTitleNavigationBar;


function useCenteringTextFunctionality(textRef: React.RefObject<Text>){

    const latestContentViewLayoutInfo = useRef<Optional<LayoutRectangle>>(null);
    const latestTextHolderLayoutInfo = useRef<Optional<LayoutRectangle>>(null);
    const previousMargins = useRef({ marginLeft: 0, marginRight: 0 });

    function refreshTextMargins(){
        const contentViewWidth = latestContentViewLayoutInfo.current?.width ?? null;
        const textHolderLayout = latestTextHolderLayoutInfo.current ?? null;
        if (contentViewWidth == null || textHolderLayout == null) { return; }

        const contentViewCenter = contentViewWidth / 2;

        const distanceOfClosestEdgeToCenter = Math.min(contentViewCenter - textHolderLayout.x, textHolderLayout.width + textHolderLayout.x - contentViewCenter);

        const newMargins = {
            marginLeft: contentViewCenter - distanceOfClosestEdgeToCenter - textHolderLayout.x,
            marginRight: textHolderLayout.x + textHolderLayout.width - contentViewCenter - distanceOfClosestEdgeToCenter,
        }

        const _previousMargins = previousMargins.current;

        if (
            newMargins.marginLeft === _previousMargins.marginLeft &&
            newMargins.marginRight === _previousMargins.marginRight
        ) {return;}

        textRef.current?.setNativeProps({style: newMargins});
        previousMargins.current = newMargins;
    }

    function onTextHolderLayout(event: LayoutChangeEvent) {
        latestTextHolderLayoutInfo.current = event.nativeEvent.layout
        refreshTextMargins();
    }

    function onContentViewLayout(event: LayoutChangeEvent) {
        latestContentViewLayoutInfo.current = event.nativeEvent.layout;
        refreshTextMargins();
    }

    return {onTextHolderLayout, onContentViewLayout};

}

