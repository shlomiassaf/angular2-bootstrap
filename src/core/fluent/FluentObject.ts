export interface PrivateOf<T> {
    $$: T;
}

/**
 * Describes a fluent assign method.
 * A function that gets a value and returns the instance it works on.
 */
export interface FluentObjectMethod<T, Z> {
    //TODO: Setting 'this' instead of Z does not work, this=ConfigSetter here...
    (value: T): Z;
}

export interface FluentStatic<T> {
    new (defaultValues: T): Fluent<T>;
}
export interface Fluent<T> extends PrivateOf<T> {
    $$: T;
    toJSON(): T;
}


/**
 * Represent an object where every property is a function representing an assignment function.
 * Calling each function with a value will assign the value to the object and return the object.
 * Calling 'toJSON' returns an object with the same properties but this time representing the
 * assigned values.
 *
 * This allows setting an object in a fluent API manner.
 * Example:
 let fluent = new FluentObject<any>(undefined, ['some', 'went']);
 fluent.some('thing').went('wrong').toJSON();
 // { some: 'thing', went: 'wrong' }
 */
export class FluentObject<T> implements Fluent<T> {
    public $$: T;

    constructor(defaultValues?: T) {
        Object.defineProperty(this, '$$', <any>{
            configurable: false,
            enumerable: false,
            writable: false,
            value: {}
        });
        if (defaultValues) {
            Object.getOwnPropertyNames(defaultValues)
                .forEach(name => (<any>this.$$)[name] = (<any>defaultValues)[name]);
        }
    }

    toJSON(): T {
        return this.$$;
    }

}
