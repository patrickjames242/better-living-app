
import React, { useMemo } from 'react';
import {StyleSheet, View} from 'react-native';
import Menu from '../../../../api/orderingSystem/menus/Menu';
import NavigationControllerNavigationBar from '../../../../helpers/Views/NavigationControllerNavigationBar';
import FloatingCellStyleList from '../../../../helpers/Views/FloatingCellStyleList';
import { useSelector } from '../../../../redux/store';
import PlainTextListItem from '../PlainTextListItem';
import { caseInsensitiveStringSort } from '../../../../helpers/general';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsNavStackParams } from '../../navigationHelpers';
import PlusButton from '../../../../helpers/Buttons/PlusButton';



const MenusListScreen = (() => {
    
    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
    });

    interface SectionType{
        data: Menu[];
    }
    
    const MenusListScreen = (props: StackScreenProps<SettingsNavStackParams, 'MenusList'>) => {

        const allMenusReduxState = useSelector(state => state.orderingSystem.menus);
        const sections: SectionType[] = useMemo(() => {
            return [{data: allMenusReduxState.toSet().sort(caseInsensitiveStringSort(x => x.title)).toArray()}];
        }, [allMenusReduxState]);

        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Menus" rightAlignedView={
                <PlusButton
                    onPress={() => {
                        props.navigation.push('MenuEditOrCreate', {menuId: null});
                    }}
                />
            }/>
            <FloatingCellStyleList<Menu, SectionType>
                sections={sections}
                keyExtractor={x => String(x.id)}
                renderItem={item => {
                    return <PlainTextListItem title={item.item.title} onPress={() => {
                        props.navigation.push('MenuEditOrCreate', {menuId: item.item.id})
                    }}/>
                }}
            />         
        </View>
    }
    return MenusListScreen;
})();

export default MenusListScreen;



