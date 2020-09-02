
import React from 'react';
import { StyleSheet } from 'react-native';
import { CustomFont } from '../../../../helpers/fonts/fonts';
import CustomizedText from '../../../../helpers/Views/CustomizedText';
import { MenuCategory } from '../../../../api/orderingSystem/menus/Menu';


const MenuListViewSectionHeader = (() => {

    const styles = StyleSheet.create({
        root: {
            fontFamily: CustomFont.bold,
            fontSize: 25,
        }
    });

    return function MenuListViewSectionHeader(props: { section: MenuCategory, sideInsets: number }) {
        return <CustomizedText style={[styles.root, {
            marginLeft: props.sideInsets,
            marginRight: props.sideInsets
        }]}>
            {props.section.title}
        </CustomizedText>
    }
})();


export default MenuListViewSectionHeader;
