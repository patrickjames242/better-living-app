
import React from 'react';
import { Color } from './colors';

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
export function useUpdateEffect(effect: React.EffectCallback, dependencies?: React.DependencyList){
	
	const flag = React.useRef(true);

    React.useEffect(() => {
        if (flag.current === true) {
            flag.current = false;
        } else {
            return effect();
        }
    }, dependencies);
}

