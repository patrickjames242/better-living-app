
import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import CustomizedText from '../../../../helpers/CustomizedText';
import LayoutConstants from '../../../../LayoutConstants';
import { MealCreatorSection } from '../helpers';
import Spacer, { BaseSpacer } from '../../../../helpers/Spacers/Spacer';
import { MenuListItem } from '../../MenuListViewScreen/MenuListView/helpers';
import AspectRatioView from '../../../../helpers/AspectRatioView';
import { getShadowStyle } from '../../../../helpers/general';
import { CustomFont } from '../../../../helpers/fonts/fonts';
import { Color } from '../../../../helpers/colors';
import BouncyButton from '../../../../helpers/Buttons/BouncyButton';
import { useNavigationScreenContext } from '../../../../helpers/NavigationController/NavigationScreen';
import MenuPresentableScreens from '../../MenuPresentableScreens';



export interface MealCreatorSectionViewProps {
    section: MealCreatorSection,
}

const MealCreatorSectionView = (() => {

    const styles = StyleSheet.create({
        root: {

        },
        headerText: {
            ...LayoutConstants.floatingCellStyles.sectionHeaderTextStyles,
            marginLeft: LayoutConstants.floatingCellStyles.borderRadius,
        },
        sectionContentHolderView: {
            ...LayoutConstants.floatingCellStyles.shadowConfig,
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            backgroundColor: 'white',
        },
        itemSpacers: {
            height: StyleSheet.hairlineWidth,
            backgroundColor: Color.gray(0.8).withAdjustedOpacity(0.6).stringValue,
        },
    });

    const MealCreatorSectionView = (props: MealCreatorSectionViewProps) => {

        return <View style={styles.root}>
            <Spacer space={LayoutConstants.floatingCellStyles.sectionHeaderBottomSpacing}>
                <CustomizedText style={styles.headerText}>{props.section.title}</CustomizedText>
                <View style={styles.sectionContentHolderView}>
                    <BaseSpacer renderSpacer={() => {
                        return <View style={styles.itemSpacers} />
                    }}>
                        {props.section.data.map((item, index) => {
                            return <MealCreatorSelectionItem key={index} item={item} />
                        })}
                    </BaseSpacer>
                </View>
            </Spacer>
        </View>
    }

    return MealCreatorSectionView;
})();

export default MealCreatorSectionView;





export interface MealCreatorSelectionItemProps {
    item: MenuListItem,
}

const MealCreatorSelectionItem = (() => {

    const imageBorderRadius = 8;

    const styles = StyleSheet.create({
        root: {
            alignItems: 'center',
            flexDirection: 'row',
        },
        itemInfoView: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: LayoutConstants.floatingCellStyles.padding,
        },
        imageHolder: {
            width: 80,
            ...getShadowStyle(10),
            backgroundColor: 'white',
            borderRadius: imageBorderRadius,
        },
        image: {
            width: '100%',
            height: '100%',
            borderRadius: imageBorderRadius,
        },
        titleText: {
            fontFamily: CustomFont.medium,
            fontSize: 15,
        },
    });

    

    const MealCreatorSelectionItem = (props: MealCreatorSelectionItemProps) => {

        const navigationScreenContext = useNavigationScreenContext();

        function onButtonPress(){
            const MenuItemDetailScreen = MenuPresentableScreens.MenuItemDetailScreen();
            if (MenuItemDetailScreen == null){return;}
            navigationScreenContext.present(<MenuItemDetailScreen/>);
        }

        return <View style={styles.root}>
            <BouncyButton style={styles.itemInfoView} bounceScaleValue={0.9} onPress={onButtonPress}>
                <Spacer space={LayoutConstants.floatingCellStyles.padding}>
                    <AspectRatioView style={styles.imageHolder} heightPercentageOfWidth={LayoutConstants.productImageHeightPercentageOfWidth}>
                        <Image style={styles.image} source={props.item.imageSource} resizeMode="cover" />
                    </AspectRatioView>
                    <CustomizedText style={styles.titleText}>{props.item.name}</CustomizedText>
                </Spacer>
            </BouncyButton>

        </View>
    }

    return MealCreatorSelectionItem;

})();



