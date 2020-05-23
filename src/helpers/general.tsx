
import React from 'react';

export type Optional<Wrapped> = Wrapped | null;



export function getNumbersList(first: number, last: number): number[] {
    if (first > last) { throw new Error("first cannot be greater than last!!"); }
    let numbers: number[] = [];
    for (let x = first; x <= last; x++) {
        numbers.push(x);
    }
    return numbers;
}

// works just like useEffect, except that the effect is not called after the first render, as is the case with useEffect.
export function useUpdateEffect(effect: React.EffectCallback, dependencies?: React.DependencyList) {

    const flag = React.useRef(true);

    React.useEffect(() => {
        if (flag.current === true) {
            flag.current = false;
        } else {
            return effect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
}


// works just like useEffect, except that the effect is not called after the first render, as is the case with useEffect.
export function useUpdateLayoutEffect(effect: React.EffectCallback, dependencies?: React.DependencyList) {
    const flag = React.useRef(true);

    React.useLayoutEffect(() => {
        if (flag.current === true) {
            flag.current = false;
        } else {
            return effect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, dependencies);
}


export function getShadowStyle(elevation: number) {
    return {
        elevation,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0.4 * elevation },
        shadowOpacity: 0.12,
        shadowRadius: 0.8 * elevation
    };
}

// returns min if the number is less than or equal to min, returns max if the number is greater than or equal to max, otherwise returns the same number
export function limitNumber(number: number, min: number, max: number): number{
    return Math.max(Math.min(number, max), min);
}



export function lazilyImport<ModuleType, ImportedItem>(importCall: Promise<ModuleType>, elementGetter: (module: ModuleType) => ImportedItem): () => Optional<ImportedItem>{
	
	const ref: {current: Optional<ImportedItem>} = {
		current: null,
	}

	importCall.then(module => {
		ref.current = elementGetter(module);
	})

	return () => {
		return ref.current;
	}

}