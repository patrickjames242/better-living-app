import { hash, ValueObject } from 'immutable';
import Notification from './Notification';

export default class ValueBox<Value> implements ValueObject {
  private _value: Value;
  readonly observer = Notification<Value>();

  constructor(initialValue: Value) {
    this._value = initialValue;
  }

  get value() {
    return this._value;
  }

  set value(newValue: Value) {
    this._value = newValue;
    this.observer.post(newValue);
  }

  equals(other: any) {
    if (other instanceof ValueBox === false) {
      return false;
    }
    return other.value === this.value;
  }

  hashCode() {
    return hash(this.value);
  }
}
