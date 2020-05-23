import { lazilyImport } from "../../helpers/general";


const MenuPresentableScreens = {
    MealCreatorScreen: lazilyImport(import('./MealCreaterScreen/MealCreaterScreen'), module => module.default),
    MenuItemDetailScreen: lazilyImport(import('./MenuItemDetailScreen/MenuItemDetailScreen'), module => module.default),
}

export default MenuPresentableScreens;
