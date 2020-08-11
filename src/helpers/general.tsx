
import { Alert, Platform } from 'react-native';
import { ValidateFunction } from 'ajv';
import { CustomColors } from './colors';

export type Optional<Wrapped> = Wrapped | null;

// makes specific properties optional
export type PartialBy<T, Keys extends keyof T> = Omit<T, Keys> & Partial<Pick<T, Keys>>

export const DEFAULT_NAV_SCREEN_OPTIONS = {headerShown: false, cardStyle: {backgroundColor: CustomColors.mainBackgroundColor.stringValue}};

export function getNumbersList(first: number, last: number): number[] {
    if (first > last) { throw new Error("first cannot be greater than last!!"); }
    let numbers: number[] = [];
    for (let x = first; x <= last; x++) {
        numbers.push(x);
    }
    return numbers;
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
export function limitNumber(number: number, min: number, max: number): number {
    return Math.max(Math.min(number, max), min);
}



export function lazilyImport<ModuleType, ImportedItem>(importCall: Promise<ModuleType>, elementGetter: (module: ModuleType) => ImportedItem): () => Optional<ImportedItem> {

    const ref: { current: Optional<ImportedItem> } = {
        current: null,
    }

    importCall.then(module => {
        ref.current = elementGetter(module);
    })

    return () => {
        return ref.current;
    }

}

// executes closure if value is not null or undefined and returns its result, otherwise returns null.
export function mapOptional<Unwrapped, ReturnVal>(optional: Unwrapped | undefined | null, action: (unwrapped: Unwrapped) => ReturnVal): ReturnVal | null {
    if (optional == null) {
        return null;
    } else {
        return action(optional);
    }
}

export function compactMap<InputType, OutputType>(items: Array<InputType>, transformer: (input: InputType) => OutputType | undefined | null){
    const newItems: OutputType[] = [];
    for (const item of items){
        const result = transformer(item);
        result != null && newItems.push(result);
    }
    return newItems;
}


export function isDigit(string: string): boolean {
    const regex = /^\d$/;
    return regex.test(string);
}



export function computeNumberOfListColumns(props: { listWidth: number, maxItemWidth: number, sideInsets: number, horizontalItemSpacing: number }) {
    return Math.ceil((props.listWidth + props.horizontalItemSpacing - (2 * props.sideInsets)) / (props.maxItemWidth + props.horizontalItemSpacing));
}




export interface SectionSeparatorComponentInfo<
    Item = any,
    Section extends object = {}
    > {
    readonly highlighted: boolean;
    readonly leadingItem?: Item;
    readonly leadingSection?: Section;
    readonly section?: Section;
    readonly trailingItem?: Item;
    readonly trailingSection?: Section;
}



export function displayErrorMessage(message: string){
    if (Platform.OS === 'web'){
        alert("Oops! " + message);
    } else {
        Alert.alert('Oops!', message, [{text: 'Ok'}]);
    }
}


export function getJsonValidatorErrorsText(validator: ValidateFunction): Optional<string>{
    const errors = validator.errors;
    if (errors == null){return null;}
    return '[' + '\n' + errors.map(x => `\tdataPath: '${x.dataPath}', message: ${x.message}`).join(',\n') + '\n]'
}

// export function filterObjectOwnProps<ObjType extends object>(obj: ObjType, filterer: <Key extends keyof ObjType>(key: Key, value: ObjType[Key]) => boolean){
//     const newObj: Partial<ObjType> = {};
//     for (const key in obj){
//         const value = obj[key];
//         if (filterer(key, value) === true){
//             newObj[key] = value;
//         }
//     }
//     return newObj;
// }


/** filters out any properties whose key is not in the included props array and whose value is not equal to undefiend*/
export function getPropsFromObject<ObjType extends object>(obj: ObjType, includedProps: (keyof ObjType)[]){
    const resultObj: Partial<ObjType> = {};
    for (const key of includedProps){
        const value = obj[key];
        if (value === undefined){continue;}
        resultObj[key] = value;
    }
    return resultObj;
}






