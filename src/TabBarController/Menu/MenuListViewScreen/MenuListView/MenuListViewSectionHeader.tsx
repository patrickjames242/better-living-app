
import React from 'react';
import { StyleSheet } from 'react-native';
import { CustomFont } from '../../../../helpers/fonts/fonts';
import { MenuListSection } from './helpers';
import CustomizedText from '../../../../helpers/CustomizedText';


const MenuListViewSectionHeader = (() => {

    const styles = StyleSheet.create({
        root: {
            fontFamily: CustomFont.bold,
            fontSize: 25,
        }
    });

    return function MenuListViewSectionHeader(props: { section: MenuListSection, sideInsets: number }) {
        return <CustomizedText style={[styles.root, {
            marginLeft: props.sideInsets,
            marginRight: props.sideInsets
        }]}>
            {props.section.title}
        </CustomizedText>
    }
})();


export default MenuListViewSectionHeader;
