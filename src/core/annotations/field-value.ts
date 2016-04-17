/*
 Partially based on:
 https://github.com/angular/material2/blob/master/src/core/annotations/field-value.ts
 https://github.com/angular/material2/commit/5f398d14350401be5e9f5823d86aec98b0a8b8e3
 */


declare var Symbol: any;


/**
 * Annotation Factory that allows HTML style boolean attributes. For example,
 * a field declared like this:
 * @Directive({ selector: 'component' }) class MyComponent {
 *   @Input() @BooleanFieldValueFactory() myField: boolean;
 * }
 *
 * You could set it up this way:
 *   <component myField>
 * or:
 *   <component myField="">
 */
function booleanFieldValueFactory() {
    return function booleanFieldValueMetadata(target: any, key: string): void {
        const defaultValue = target[key];

        // Use a fallback if Symbol isn't available.
        const localKey = Symbol ? Symbol(key) : `__md_private_symbol_${key}`;
        target[localKey] = defaultValue;
        Object.defineProperty(target, key, {
            get() { return this[localKey]; },
            set(value: boolean) {
                this[localKey] = value != null && `${value}` !== 'false';
            }
        });
    };
}
export { booleanFieldValueFactory as BooleanFieldValue };