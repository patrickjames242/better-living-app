
import { getShadowStyle } from "./helpers/general";
import { CustomFont } from "./helpers/fonts/fonts";
import { CustomColors, Color } from "./helpers/colors";

const LayoutConstants = {

    pageSideInsets: 20,
    productImageHeightPercentageOfWidth: 0.55,

    navBar: {
        cornerRadius: 25,
        shadowConfig: getShadowStyle(8),
    },

    sideMenuBar: {
        minWidthToShowSideBar: 600,
        padding: 30,
        barItem: {
            imageSize: 30,
            padding: 15,
        },
        get totalWidth() {
            return (this.padding * 2) +
                (this.barItem.padding * 2) +
                this.barItem.imageSize;
        },
    },

    floatingCellStyles: {
        padding: 15,
        borderRadius: 15,
        backgroundColor: 'white',
        shadowConfig: {
            // ...getShadowStyle(15)
        },
        sectionSpacing: 30,
        sectionHeaderTextStyles: {
            fontSize: 20,
            fontFamily: CustomFont.bold,
            color: CustomColors.offBlackTitle.stringValue,
        },
        sectionHeaderBottomSpacing: 20,
        maxWidth: 660,
    },

    bottomScreenButtonWithGradient: {
        bottomPadding: 15,
        maxWidth: 450,
    },

    maxWidthListContentContainerStyles(maxWidth?: number): {
        alignSelf: 'center',
        width: string;
        maxWidth: number;
        padding: number;
    }{
        return {
            alignSelf: 'center',
            width: '100%',
            maxWidth: (maxWidth ?? LayoutConstants.floatingCellStyles.maxWidth) + (LayoutConstants.pageSideInsets * 2),
            padding: LayoutConstants.pageSideInsets,
        };
    },

    forms: {
        innerContainer: {
            borderRadius: 10,
            backgroundColor: Color.gray(0.965).stringValue,
        },
        textFieldSelectionOutline: {
            color: {
                unselected: Color.gray(0.94).stringValue,
                selected: CustomColors.themeGreen.withAdjustedOpacity(0.8).stringValue,
            },
            width: 2.5,
        },
    },

    

};

export default LayoutConstants;


