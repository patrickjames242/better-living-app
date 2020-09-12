import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Color, CustomColors } from '../../../helpers/colors';
import CustomizedText from '../../../helpers/Views/CustomizedText';
import SpacerView from '../../../helpers/Spacers/SpacerView';
import { CustomFont } from '../../../helpers/fonts/fonts';
import Space from '../../../helpers/Spacers/Space';
import { User } from '../../../api/authentication/User';

interface SettingsListScreenHeaderProps {
    userObject: User;
}

const SettingsListScreenHeader = (() => {

    const styles = StyleSheet.create({
        root: {
            alignItems: 'center',
            paddingTop: 50,
            paddingBottom: 40,
        },
        initialsViewHolder: {
            borderWidth: 4,
            borderColor: Color.gray(0.9).stringValue,
            padding: 6,
            borderRadius: 100000000
        },
        initialsView: {
            borderRadius: 100000000,
            backgroundColor: CustomColors.themeGreen.withAdjustedOpacity(0.2).stringValue,
            width: 110,
            height: 110,
            alignItems: 'center',
            justifyContent: 'center',
        },
        initialsText: {
            fontSize: 40,
            fontFamily: CustomFont.bold,
            color: CustomColors.themeGreen.stringValue
        },
        nameText: {
            fontSize: 25,
            fontFamily: CustomFont.bold,
            textAlign: 'center',
        },
        emailText: {
            color: CustomColors.offBlackSubtitle.stringValue,
            fontFamily: CustomFont.medium,
            fontSize: 16,
            textAlign: 'center',
        },
    });

    const getUppercaseFirstLetter = (s: string) => s.substring(0, 1).toUpperCase();

    const SettingsListScreenHeader = (props: SettingsListScreenHeaderProps) => {
        return <SpacerView style={styles.root} space={15}>
            <View style={styles.initialsViewHolder}>
                <View style={styles.initialsView}>
                    <CustomizedText style={styles.initialsText}>{
                        getUppercaseFirstLetter(props.userObject.firstName) + getUppercaseFirstLetter(props.userObject.lastName)
                    }</CustomizedText>
                </View>
            </View>
            <CustomizedText style={styles.nameText}>{props.userObject.getFullName()}</CustomizedText>
            <Space space={8}/>
            <CustomizedText style={styles.emailText}>{props.userObject.email}</CustomizedText>
        </SpacerView>
    }
    return SettingsListScreenHeader;
})();

export default SettingsListScreenHeader;
