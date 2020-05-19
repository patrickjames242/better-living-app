import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CenteredTitleNavigationBar } from '../../../helpers/NavigationBar';

const MenuItemDetailScreen = (() => {

    const styles = StyleSheet.create({
        root: {
            
        }
    });

    return function MenuItemDetailScreen(){
        return <View style={styles.root}>
            <CenteredTitleNavigationBar title="Pumkin Soup"/>
        </View>
    }
})();


export default MenuItemDetailScreen;