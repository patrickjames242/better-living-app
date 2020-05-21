import React from 'react';
import { CustomFont } from "../fonts/fonts";
import { View, StyleSheet } from "react-native";
import BaseNavigationBar from "./BaseNavigationBar";
import CustomizedText from "../CustomizedText";


const CenteredTitleNavigationBar = (() => {

    const styles = StyleSheet.create({
        contentView: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        title: {
            fontFamily: CustomFont.bold,
            fontSize: 18,
        }
    }); 

    return function CenteredTitleNavigationBar(props: {
        title: string,
        leftAlignedView?: React.ReactElement,
        rightAlignedView?: React.ReactElement,
    }){

        const sideElements = [props.leftAlignedView, props.rightAlignedView]
        .filter(x => x != undefined);

        const fakeLeftOrRightAlignedView = (() => {
            if (sideElements.length === 1){
                return <View style={{opacity: 0}}>{sideElements[0]}</View>
            } else {return null;}
        })();

        return <BaseNavigationBar>
            <View style={[styles.contentView, {
                justifyContent: (sideElements.length > 0) ? 'space-between' : 'center',
            }]}>
                {props.leftAlignedView ?? fakeLeftOrRightAlignedView}
                <CustomizedText style={styles.title}>
                    {props.title}
                </CustomizedText>
                {props.rightAlignedView ?? fakeLeftOrRightAlignedView}
            </View>
        </BaseNavigationBar>
    };
})();

export default CenteredTitleNavigationBar;
