
import Notification from "./Notification";




export default class ValueBox<Value>{

    private _value: Value;
    readonly observer = Notification<Value>();

    constructor(initialValue: Value){
        this._value = initialValue
    }

    get value(){
        return this._value;
    }

    set value(newValue: Value){
        this._value = newValue;
        this.observer.post(newValue);
    }

}



