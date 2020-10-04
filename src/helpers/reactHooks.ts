import React, { useState, useRef, useEffect } from 'react';

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

export function useIsUnmounted(){
    const isUnmounted = useRef(false);
    useEffect(() => {
        return () => {isUnmounted.current = true};
    }, []);
    return isUnmounted;
}





export function useForceUpdate() {
    // eslint-disable-next-line react-hooks/rules-of-hooks,  @typescript-eslint/no-unused-vars
    const [_, setRandomState] = useState({});
    const _forceUpdate = useRef(() => setRandomState({}));
    return _forceUpdate.current;
}


