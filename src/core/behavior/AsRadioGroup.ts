/*
 Partially based on:
 https://github.com/angular/material2/blob/master/src/components/radio/radio.ts
 https://github.com/angular/material2/commit/5f398d14350401be5e9f5823d86aec98b0a8b8e3
 */

import {
    Directive,
    EventEmitter,
    Input,
    Output,
    Provider,
    forwardRef,
    AfterContentInit,
    QueryList,
    ContentChildren
} from 'angular2/core';

import {
    NG_VALUE_ACCESSOR,
    ControlValueAccessor
} from 'angular2/src/common/forms/directives/control_value_accessor';


import {RadioDispatcher} from './RadioDispatcher';
export {RadioDispatcher} from './RadioDispatcher';

import {AsRadio} from './AsRadio';

/**
 * Provider Expression that allows radio-group to register as a ControlValueAccessor. This
 * allows it to support [(ngModel)] and ngControl.
 */
const AS_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = new Provider(
    NG_VALUE_ACCESSOR, {
        useExisting: forwardRef(() => RadioGroup),
        multi: true
    });

let _uniqueIdCounter = 0;

/** A simple change event emitted by either RadioButton or RadioGroup. */
export class RadioChange {
    source: AsRadio;
    value: any;
}

@Directive({
    selector: '[bsAsRadioGroup]',
    providers: [AS_RADIO_GROUP_CONTROL_VALUE_ACCESSOR],
    host: {
        'role': 'radiogroup',
    },
})
export class RadioGroup implements AfterContentInit, ControlValueAccessor {
    /** The value for the radio group. Should match currently selected button. */
    private _value: any = null;

    /** The HTML name attribute applied to radio buttons in this group. */
    private _name: string = null;

    /** Disables all individual radio buttons assigned to this group. */
    private _disabled: boolean = false;

    /** The currently selected radio button. Should match value. */
    private _selected: AsRadio = null;

    /** Change event subscription set up by registerOnChange (ControlValueAccessor). */
    private _changeSubscription: {unsubscribe: () => any} = null;

    /** Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor. */
    onTouched(): any {}

    /** Event emitted when the group value changes. */
    @Output() change: EventEmitter<RadioChange> = new EventEmitter();

    /** Child radio buttons. */
    @ContentChildren(forwardRef(() => AsRadio)) private _radios: QueryList<AsRadio> = null;

    /**
     * Initialize properties once content children are available.
     * This allows us to propagate relevant attributes to associated buttons.
     */
    ngAfterContentInit() {
        if (this._name == null) {
            this.name = `md-radio-group-${_uniqueIdCounter++}`;
        } else {
            this._updateChildRadioNames();
        }
    }

    @Input()
    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;

        this._updateChildRadioNames();
    }

    /** Propagate name attribute to radio buttons. */
    private _updateChildRadioNames(): void {
        if (this._radios != null) {
            this._radios.forEach((radio) => {
                radio.name = this._name;
            });
        }
    }

    @Input()
    get disabled(): boolean {
        return this._disabled;
    }

    set disabled(value) {
        // The presence of *any* disabled value makes the component disabled, *except* for false.
        this._disabled = (value != null && value !== false) ? true : null;
    }

    @Input()
    get value(): any {
        return this._value;
    }

    set value(newValue: any) {
        if (this._value != newValue) {
            // Set this before proceeding to ensure no circular loop occurs with selection.
            this._value = newValue;

            this._updateSelectedRadioFromValue();
            this._emitChangeEvent();
        }
    }

    private _updateSelectedRadioFromValue(): void {
        // Update selected if different from current value.
        let isAlreadySelected = this._selected != null && this._selected.value == this._value;
        if (this._radios != null && !isAlreadySelected) {
            let matched = this._radios.filter((radio) => {
                return radio.value == this._value;
            });

            if (matched.length == 0) {
                // Didn't find a button that matches this value, return early without setting.
                return;
            }

            // Change the selection immediately.
            this.selected = matched[0];
        }
    }

    /** Dispatch change event with current selection and group value. */
    private _emitChangeEvent(): void {
        let event = new RadioChange();
        event.source = this._selected;
        event.value = this._value;
        this.change.emit(event);
    }

    @Input()
    get selected() {
        return this._selected;
    }

    set selected(selected: AsRadio) {
        this._selected = selected;
        this.value = selected.value;

        selected.checked = true;
    }

    /** Implemented as part of ControlValueAccessor. */
    writeValue(value: any) {
        this.value = value;
    }

    /** Implemented as part of ControlValueAccessor. */
    registerOnChange(fn: any) {
        if (this._changeSubscription) {
            this._changeSubscription.unsubscribe();
        }
        this._changeSubscription = <{unsubscribe: () => any}>this.change.subscribe(
            (changeEvent: RadioChange) => { fn(changeEvent.value); });
    }

    /** Implemented as part of ControlValueAccessor. */
    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }
}
