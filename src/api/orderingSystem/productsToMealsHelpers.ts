import { Map, Set } from "immutable";
import store from "../../redux/store";



export function computeProductsToMealsMap(){

    const orderingSystemState = store.getState().orderingSystem;

    return Map<number, Set<number>>().withMutations(mapToReturn => {
        orderingSystemState.meals.forEach(meal => {
            meal.productCategories.forEach(({id: categoryId}) => {
                const category = orderingSystemState.mealCategories.get(categoryId);
                if (category == null) return;
                category.productIds.forEach(productId => {
                    const product = orderingSystemState.products.get(productId);
                    if (product == null) return;
                    
                    const currentMealsSet = mapToReturn.get(product.id);
    
                    if (currentMealsSet == null){
                        mapToReturn.set(product.id, Set([meal.id]));
                    } else {
                        mapToReturn.set(product.id, currentMealsSet.add(meal.id));
                    }
                });
            });
        });    
    });
    
}




