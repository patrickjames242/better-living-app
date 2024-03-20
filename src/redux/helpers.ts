import { Action as ReduxAction } from 'redux';
import { AppState } from 'react-native';
import { Optional } from '../helpers/general';
import { useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';

export type CustomReduxAction<Payload extends object> = ReduxAction<string> &
  Payload;

export interface ActionStringsObject {
  [key: string]: string | ActionStringsObject;
}

export function nestReduxActionStrings<
  _ActionStringsObject extends ActionStringsObject,
>(actionsObj: _ActionStringsObject): _ActionStringsObject {
  function addPrefixToValue(prefix: string | undefined, value: string): string {
    return [prefix, value].filter(x => x != undefined).join(' -> ');
  }

  function prefixAllValues<_ActionStringsObject extends ActionStringsObject>(
    object: _ActionStringsObject,
    prefix?: string,
  ): _ActionStringsObject {
    const _object = { ...object };

    for (const key of Object.getOwnPropertyNames(_object)) {
      if (typeof key !== 'string') {
        continue;
      }

      const oldValue = _object[key];

      if (typeof oldValue === 'string') {
        (_object as any)[key] = addPrefixToValue(prefix, oldValue);
      } else if (typeof oldValue === 'object') {
        (_object as any)[key] = prefixAllValues(
          oldValue,
          addPrefixToValue(prefix, key),
        );
      }
    }

    return _object;
  }

  return prefixAllValues(actionsObj);
}

export function useCachingSelector<ValueType>(
  selector: (state: AppState) => ValueType,
) {
  const previousValueHolder = useRef<Optional<ValueType>>(null);

  const currentValue = useSelector(selector);

  const isInitialRender = useRef(true);

  const previousValue = useMemo(() => {
    const _previous = previousValueHolder.current;
    if (isInitialRender.current === false) {
      previousValueHolder.current = currentValue;
    } else {
      isInitialRender.current = false;
    }
    return _previous;
  }, [currentValue]);

  return {
    currentValue,
    previousValue,
  };
}
