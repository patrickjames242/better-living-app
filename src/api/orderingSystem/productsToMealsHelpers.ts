import { Map, Set, is, List } from 'immutable';
import store, {
  addSelectedStateListener,
  useSelector,
} from '../../redux/store';
import ValueBox from '../../helpers/ValueBox';
import { useState, useEffect, useMemo, useCallback } from 'react';
import Meal from './meals/Meal';

export type ProductsToMealsMap = Map<number, Set<number>>;

export function computeProductsToMealsMap(): ProductsToMealsMap {
  const orderingSystemState = store.getState().orderingSystem;

  return Map<number, Set<number>>().withMutations(mapToReturn => {
    orderingSystemState.meals.forEach(meal => {
      meal.productCategories.forEach(({ id: categoryId }) => {
        const category = orderingSystemState.mealCategories.get(categoryId);
        if (category == null) return;

        category.productIds.forEach(productId => {
          const product = orderingSystemState.products.get(productId);
          if (product == null) return;

          const currentMealsSet = mapToReturn.get(product.id);

          if (currentMealsSet == null) {
            mapToReturn.set(product.id, Set([meal.id]));
          } else {
            mapToReturn.set(product.id, currentMealsSet.add(meal.id));
          }
        });
      });
    });
  });
}

const productsToMealsMap = new ValueBox<ProductsToMealsMap>(
  computeProductsToMealsMap(),
);

function updateProductsToMealsMapIfNeeded() {
  const newValue = computeProductsToMealsMap();
  const oldValue = productsToMealsMap.value;
  if (is(newValue, oldValue) === false) {
    productsToMealsMap.value = newValue;
  }
}

addSelectedStateListener(
  state => state.orderingSystem.products,
  () => {
    updateProductsToMealsMapIfNeeded();
  },
);

addSelectedStateListener(
  state => state.orderingSystem.meals,
  () => {
    updateProductsToMealsMapIfNeeded();
  },
);

addSelectedStateListener(
  state => state.orderingSystem.mealCategories,
  () => {
    updateProductsToMealsMapIfNeeded();
  },
);

export const getProductsToMealsMap = () => productsToMealsMap.value;

export function addProductstoMealsMapListener(
  listener: (map: ProductsToMealsMap) => void,
) {
  return productsToMealsMap.observer.addListener(listener);
}

export function useProductsToMealsMap() {
  const initialValue = useMemo(() => getProductsToMealsMap(), []);
  const [map, setMap] = useState(initialValue);
  useEffect(() => {
    return addProductstoMealsMapListener(setMap);
  }, []);
  return map;
}

export function useMealsForProduct(productId: number) {
  const computeMealIds = useCallback(
    (map: ProductsToMealsMap) => {
      return map.get(productId) ?? Set<number>();
    },
    [productId],
  );

  const initialValue = useMemo(
    () => computeMealIds(computeProductsToMealsMap()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const allMealsState = useSelector(state => state.orderingSystem.meals);

  const [mealIds, setMealIds] = useState(initialValue);

  const meals = useMemo(() => {
    return List<Meal>().withMutations(list => {
      mealIds.forEach(mealId => {
        const meal = allMealsState.get(mealId);
        meal instanceof Meal && list.push(meal);
      });
    });
  }, [allMealsState, mealIds]);

  useEffect(() => {
    return addProductstoMealsMapListener(map => {
      const newValue = computeMealIds(map);
      setMealIds(prevState => {
        if (is(prevState, newValue)) {
          return prevState;
        }
        return newValue;
      });
    });
  }, [computeMealIds]);

  return meals;
}
