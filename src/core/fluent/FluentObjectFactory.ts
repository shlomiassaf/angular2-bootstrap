import {FluentObject, PrivateOf} from './FluentObject';

export enum FLUENT_MEMBER_TYPE {
    /**
     * Instruction for assigning a value on the FluentObject instance.
     * This can be either anything. If a method is assigned note that it will not
     * return the FluentObject instance.
     */
    Value,
    /**
     * Instruction for a fluent Setter on the FluentObject instance.
     * A Setter is function that get a value, set it on the POCO object under the same name
     * as the setter's name and return the FluentObject instance.
     */
    Setter,
    /**
     * Instruction for a assigning a value on the POCO object directly.
     * Default implementation will use a predefined Setter, so make sure an appropriate Setter
     * instruction precedes this instruction.
     */
    DirectValue
}

/**
 * Instruction metadata for a fluent member
 */
export interface FluentMemberMeta {
    type: FLUENT_MEMBER_TYPE;
    name: string;
    value?: any;
    once?: boolean;
}

/**
 * Interface for a method that get's an object and set a fluent setter on it using a given name.
 */
export interface SetterFactory<T extends FluentObject<any>> {
    (obj: T, instructions: FluentMemberMeta): void;
}

/**
 * Interface for a method that get's an object and set a fluent method on it using a given name.
 */
export interface MethodFactory<T extends FluentObject<any>> {
    (obj: T, instructions: FluentMemberMeta): void;
}

/**
 * Describe's the private value of FluentObjectFactory instance holding
 * the FluentObject instance and the method factory.
 */
export interface FluentObjectMetadata<T extends FluentObject<any>> {
    /**
     * The FluentObject instance created by this factory.
     */
    fluentObject: T;

    /**
     * The method used to created setters on the instance
     * that implement the fluent API.
     */
    setterFactory: SetterFactory<T>;

    /**
     * The method used to created setters on the instance
     * that implement the fluent API.
     */
    methodFactory: MethodFactory<T>;
}

export interface FluentFactory<T extends FluentObject<any>>
                                                    extends PrivateOf<FluentObjectMetadata<T>> {

    fluentObject: T;

    /**
     * Create a fluent item method on the FluentObject instance.
     * @returns {FluentAssignFactory}
     */
    setFluent(fi: FluentMemberMeta | FluentMemberMeta[]): FluentFactory<T>;

    setDynamic<Z>(fi: FluentMemberMeta | FluentMemberMeta[]): FluentFactory<T & Z>;
}

export function validateMethodName(name: string) {
    if (!name) {
        throw new Error(`Illegal method name. Empty method name is not allowed`);
    } else if (name in this) {
        throw new Error(`A member name '${name}' already defined.`);
    }
}


/**
 * Create a function for setting a value for a property on a given object.
 * @param obj The object to apply the key & setter on.
 * @param instructions Instruction metadata for a fluent setter
 */
export function defaultSetterFactory<T>(obj: FluentObject<T>,
                                        instructions: FluentMemberMeta): void {
    validateMethodName.call(obj, instructions.name);

    Object.defineProperty(obj, instructions.name, <any>{
        configurable: false,
        enumerable: false,
        writable: false,
        value: function (value: any) {
            if ( (<any>obj.$$)[instructions.name] === value) return;

            // TODO: When 'Specifying this types for functions' lands in TypeScript
            // use 'this' instead of 'obj'.
            // SEE: https://github.com/Microsoft/TypeScript/issues/3694
            if (instructions.once && obj.$$.hasOwnProperty(instructions.name)) {
                throw new Error(`Overriding config property ${instructions.name} is not allowed.`);
            }
            (<any>obj.$$)[instructions.name] = value;
            return this;
        }
    });

    if (instructions.value !== undefined) {
        (<any>obj)[instructions.name](instructions.value);
    }
}

/**
 * Create a method on the FluentObject instance.
 * @param obj
 * @param instructions Instruction metadata for a fluent method
 */
export function defaultMethodFactory<T>(obj: FluentObject<T>,
                                        instructions: FluentMemberMeta): void {
    validateMethodName.call(obj, instructions.name);

    Object.defineProperty(obj, instructions.name, <any>{
        configurable: false,
        enumerable: false,
        writable: !!instructions.once,
        value: instructions.value
    });
}

function setFluent(fi: FluentMemberMeta) {
    // TODO: Set 'this' type when #3694 (Specifying this types for functions) in TypeScript lands
    // https://github.com/Microsoft/TypeScript/issues/3694
    switch (fi.type) {
        case FLUENT_MEMBER_TYPE.Setter:
            this.$$.setterFactory(this.$$.fluentObject, <any>fi);
            break;
        case FLUENT_MEMBER_TYPE.Value:
            this.$$.methodFactory(this.$$.fluentObject, <any>fi);
            break;
        case FLUENT_MEMBER_TYPE.DirectValue:
            this.$$.fluentObject[fi.name](fi.value);
            break;
    }
}

/**
 * Represent a fluent API factory wrapper for defining FluentObject instances.
 */
export class FluentObjectFactory<T extends FluentObject<any>> implements FluentFactory<T> {
    public $$: FluentObjectMetadata<T>;

    constructor(fluentObject: T, setterFactory?: SetterFactory<T>) {
        this.$$ = {
            fluentObject: fluentObject,
            setterFactory: setterFactory || defaultSetterFactory,
            methodFactory: defaultMethodFactory
        };
    }

    /**
     * Create a setter method on the FluentObject instance.
     * @returns {FluentFactory}
     */
    setFluent(fi: FluentMemberMeta | FluentMemberMeta[]): FluentFactory<T> {
        if (fi instanceof Array) {
            fi.forEach(s => setFluent.call(this, s));
        } else {
            setFluent.call(this, <any>fi);
        }
        return this;
    }

    /**
     * Like setSetter but creates a dynamic type on the way.
     * @param fi
     * @returns {FluentFactory}
     */
    setDynamic<Z>(fi: FluentMemberMeta | FluentMemberMeta[]): FluentFactory<T & Z> {
        this.setFluent(fi);
        return <any>this;
    }

    /**
     * The FluentObject instance.
     * @returns {FluentObject}
     */
    get fluentObject(): T {
        return this.$$.fluentObject;
    }
}
