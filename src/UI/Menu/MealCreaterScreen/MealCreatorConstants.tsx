


import LayoutConstants from "../../../LayoutConstants";



const MealCreatorConstants = {

    foodSections: {
        sectionSpacing: LayoutConstants.floatingCellStyles.sectionSpacing,
        sectionHeaderBottomSpacing: LayoutConstants.floatingCellStyles.sectionHeaderBottomSpacing,
        contentViewPadding: LayoutConstants.floatingCellStyles.padding,
        imageHeightPercentageOfWidth: LayoutConstants.productImageHeightPercentageOfWidth,
        imageWidth: LayoutConstants.productThumbnailImageWidth,
        sectionHeaderTextStyles: LayoutConstants.floatingCellStyles.sectionHeaderTextStyles,
        rowTitleFontSize: 16,

        get rowHeight(){
            return (this.contentViewPadding * 2) + (this.imageHeightPercentageOfWidth * this.imageWidth);
        },

        sectionHeight(numOfRows: number){
            return (this.sectionHeaderTextStyles.fontSize * 1.2) + this.sectionHeaderBottomSpacing + (this.rowHeight * numOfRows);
        }

    },

};

export default MealCreatorConstants;