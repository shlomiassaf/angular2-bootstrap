/*
 Partially based on:
 https://github.com/angular/material2/blob/master/src/components/checkbox/checkbox.ts
 https://github.com/angular/material2/commit/5f398d14350401be5e9f5823d86aec98b0a8b8e3
 */

import {
    Directive,
    Provider,
    forwardRef,
    OnInit,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';

import {
    NG_VALUE_ACCESSOR,
    ControlValueAccessor
} from 'angular2/src/common/forms/directives/control_value_accessor';

import {Checkable} from '../directives/Checkable';
/**
 * Monotonically increasing integer used to auto-generate unique ids for checkbox components.
 */
let nextId = 0;

/**
 * Provider Expression that allows md-checkbox to register as a ControlValueAccessor. This allows it
 * to support [(ngModel)] and ngControl.
 */
const AS_CHECKBOX_CONTROL_VALUE_ACCESSOR = new Provider(
    NG_VALUE_ACCESSOR, {
        useExisting: forwardRef(() => AsCheckbox),
        multi: true
    });


@Directive({
    selector: '[bsAsCheckbox]',
    host: {
        'role': 'checkbox',
        '[id]': 'id',
        '[class.active]': 'checked',
        '[class.disabled]': 'disabled',
        '[attr.tabindex]': 'tabIndexState',
        '[attr.aria-pressed]': 'ariaPressed',
        '[attr.aria-disabled]': 'disabled',
        '(click)': 'onInteractionEvent($event)',
        '(keydown.space)': 'onKeyDown($event)',
        '(keyup.space)': 'onInteractionEvent($event)',
        '(blur)': 'onTouched()'
    },
    providers: [AS_CHECKBOX_CONTROL_VALUE_ACCESSOR]
})
export class AsCheckbox extends Checkable implements ControlValueAccessor, OnInit {
    /** A unique id for the element. If one is not supplied, it is auto-generated. */
    @Input() id: string;

    /**
     * Whether the bs-btn-checkbox is disabled. When the bs-btn-checkbox is disabled it cannot be
     * interacted with. The correct ARIA attributes are applied to denote this to assistive technology.
     */
    @Input() disabled: boolean;

    /**
     * The tabindex attribute for the checkbox. Note that when the bs-btn-checkbox is disabled,
     * the attribute on the host element will be removed. It will be placed back when the
     * checkbox is re-enabled.
     */
    @Input() tabindex: number;

    /**
     * Whether the bs-btn-checkbox is checked.
     */
    @Input() checked: boolean;

    @Output() change: EventEmitter<boolean> = new EventEmitter();

    private _changeSubscription: {unsubscribe: () => any} = null;

    ngOnInit() {
        if (this.id == null) {
            this.id = `bs-btn-checkbox-${++nextId}`;
        }
    }

    /*                          ControlValueAccessor Implementation         */
    writeValue(value: any) {
        this.checked = !!value;
    }
    registerOnChange(fn: any) {
        if (this._changeSubscription) {
            this._changeSubscription.unsubscribe();
        }
        this._changeSubscription = <{unsubscribe: () => any}>this.change.subscribe(fn);
    }
    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }
    /** 
     * Called when the bs-btn-checkbox is blurred. 
     * Needed to properly implement ControlValueAccessor. 
     */
    onTouched(): any {}
    /*                          ControlValueAccessor Implementation         */

    protected _onCheckChanged () {
        this.change.emit(this._checked);
    }
}