
import React from 'react';
import {StyleSheet, View} from 'react-native';
import NavigationControllerNavigationBar from '../../../helpers/NavigationController/NavigationControllerNavigationBar';
import { Optional } from '../../../helpers/general';


export interface CreateOrEditTipScreenProps{
    tipIdToEdit: Optional<number>
}


const CreateOrEditTipScreen = (() => {
    
    const styles = StyleSheet.create({
        root: {
            
        },
    });
    
    const CreateOrEditTipScreen = (props: CreateOrEditTipScreenProps) => {
        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Create New Health Tip"/>
            
        </View>
    }
    return CreateOrEditTipScreen;
})();

export default CreateOrEditTipScreen;




