import LayoutConstants from "../../../LayoutConstants";



const MealCreatorConstants = {

    addToCartButton: {
        padding: 17.5,
        fontSize: 16,
        bottomInset: 15,
    },

    get scrollViewBotomInset(){
        return (this.addToCartButton.bottomInset * 2) +
        (this.addToCartButton.padding * 2) + 
        (this.addToCartButton.fontSize * 1.2);
    },

    foodSections: {
        sectionSpacing: LayoutConstants.floatingCellStyles.sectionSpacing,
        sectionHeaderBottomSpacing: LayoutConstants.floatingCellStyles.sectionHeaderBottomSpacing,
        contentViewPadding: LayoutConstants.floatingCellStyles.padding,
        imageHeightPercentageOfWidth: LayoutConstants.productImageHeightPercentageOfWidth,
        imageWidth: 80,
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