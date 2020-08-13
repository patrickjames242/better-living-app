
import React, { useMemo } from 'react';
import {StyleSheet, View} from 'react-native';
import Menu from '../../../../api/orderingSystem/menus/Menu';
import NavigationControllerNavigationBar from '../../../../helpers/NavigationController/NavigationControllerNavigationBar';
import FloatingCellStyleList from '../../../../helpers/Views/FloatingCellStyleList';
import { useSelector } from '../../../../redux/store';
import PlainTextListItem from '../PlainTextListItem';



const MenusListScreen = (() => {
    
    const styles = StyleSheet.create({
        root: {
            flex: 1,
        },
    });

    interface SectionType{
        data: Menu[];
    }
    
    const MenusListScreen = () => {

        const allMenusReduxState = useSelector(state => state.orderingSystem.menus);
        const sections: SectionType[] = useMemo(() => {
            return [{data: allMenusReduxState.toSet().sortBy(x => x.title).toArray()}];
        }, [allMenusReduxState]);

        return <View style={styles.root}>
            <NavigationControllerNavigationBar title="Menus"/>
            <FloatingCellStyleList<Menu, SectionType>
                sections={sections}
                keyExtractor={x => String(x.id)}
                renderItem={item => {
                    return <PlainTextListItem title={item.item.title}/>
                }}
            />         
        </View>
    }
    return MenusListScreen;
})();

export default MenusListScreen;



