import { lazilyImport } from "./helpers/general";



const PresentableScreens = {
    MealCreatorScreen: lazilyImport(import('./TabBarController/Menu/MealCreaterScreen/MealCreaterScreen'), module => module.default),
    ProductDetailScreen: lazilyImport(import('./TabBarController/Menu/ProductDetailScreen/ProductDetailScreen'), module => module.default),
    OrderConfirmationScreen: lazilyImport(import('./TabBarController/Cart/OrderConfirmationScreen/OrderConfirmationScreen'), module => module.default),
    TipsDetailScreen: lazilyImport(import('./TabBarController/Tips/TipsDetailScreen/TipsDetailScreen'), module => module.default),
    CreateOrEditTipScreen: lazilyImport(import('./TabBarController/Tips/CreateOrEditTipScreen/CreateOrEditTipScreen'), module => module.default),
    InquiryDetailScreen: lazilyImport(import('./TabBarController/Inquiries/InquiryDetailScreen/InquiryDetailScreen'), module => module.default),
}

export default PresentableScreens;
