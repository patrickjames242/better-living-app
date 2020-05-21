
import React from 'react';
import { StyleSheet, ImageStyle, Image, View } from 'react-native';
import SpacerView from '../../../../helpers/Spacers/SpacerView';
import LayoutConstants from '../../../../LayoutConstants';
import { CustomFont } from '../../../../helpers/fonts/fonts';
import { CustomColors } from '../../../../helpers/colors';
import CustomizedText from '../../../../helpers/CustomizedText';
import Space, { SpaceDimension } from '../../../../helpers/Spacers/Space';

const TitleBox = (() => {

    const styles = StyleSheet.create({
        root: {
            backgroundColor: 'white',
            padding: LayoutConstants.floatingCellStyles.padding,
            borderRadius: LayoutConstants.floatingCellStyles.borderRadius,
            ...LayoutConstants.floatingCellStyles.shadowConfig,
        },
        titleText: {
            fontFamily: CustomFont.bold,
            fontSize: 25,
        },
        categoryBox: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        categoryIcon: (() => {
            const size = 16;
            const styles: ImageStyle = {
                width: size,
                height: size,
                tintColor: CustomColors.offBlackSubtitle.stringValue,
            };
            return styles;
        })(),
        categoryText: {
            color: CustomColors.offBlackSubtitle.stringValue,
            fontSize: 18,
        },
        foodTagViewsHolder: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
        },
    });

    return function TitleBox(){
        return <SpacerView style={styles.root} space={10}>
        <CustomizedText style={styles.titleText}>Pumpkin Soup</CustomizedText>
        <Space space={3}/>
        <SpacerView style={styles.categoryBox} space={4} dimension={SpaceDimension.onlyHorizontal}>
            <Image style={styles.categoryIcon} source={require('./forkAndKnife.png')}/>
            <CustomizedText style={styles.categoryText}>Soups</CustomizedText>
        </SpacerView>
        <SpacerView space={10} style={styles.foodTagViewsHolder}>
            <FoodTagView title={"Vegan"} />
            <FoodTagView title={"Gluten Free"} />
            <FoodTagView title={"Low Soduim"} />
        </SpacerView>
    </SpacerView>
    }
})();


export default TitleBox;

const FoodTagView = (() => {

    const styles = StyleSheet.create({
        root: {
            padding: 5,
            paddingLeft: 8,
            paddingRight: 8,
            backgroundColor: CustomColors.themeGreen.stringValue,
            borderRadius: 5,
        },
        text: {
            color: 'white',
            fontSize: 13,
            fontFamily: CustomFont.medium,
        }
    });

    return function FoodTagView(props: { title: string }) {
        return <View style={styles.root}>
            <CustomizedText style={styles.text}>
                {props.title}
            </CustomizedText>
        </View>
    }

})();

