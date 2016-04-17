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
    Optional,
    OnInit
} from 'angular2/core';

import {
    NG_VALUE_ACCESSOR,
    ControlValueAccessor
} from 'angular2/src/common/forms/directives/control_value_accessor';
import {Checkable} from '../directives/Checkable';
import {RadioChange, RadioGroup, RadioDispatcher} from './AsRadioGroup';

enum OpMode {
    None,
    RadioGroup,
    NgModelPerRadio
}

/**
 * Provider Expression that allows md-checkbox to register as a ControlValueAccessor. This allows it
 * to support [(ngModel)] and ngControl.
 */
const AS_RADIO_CONTROL_VALUE_ACCESSOR = new Provider(
    NG_VALUE_ACCESSOR, {
        useExisting: forwardRef(() => AsRadio),
        multi: true
    });

let _uniqueIdCounter = 0;

@Directive({
    selector: '[bsAsRadio]',
    host: {
        'role': 'radio',
        '[id]': 'id',
        '[class.active]': 'checked',
        '[class.disabled]': 'disabled',
        '[attr.tabindex]': 'tabIndexState',
        '[attr.aria-pressed]': 'ariaPressed',
        '[attr.aria-disabled]': 'disabled',
        '(click)': 'onInteractionEvent($event)',
        '(keydown.space)': 'onSpaceDown($event)',
        '(keyup.space)': 'onInteractionEvent($event)',
        '(blur)': 'onTouched()'
    },
    providers: [AS_RADIO_CONTROL_VALUE_ACCESSOR]
})
export class AsRadio extends Checkable implements ControlValueAccessor, OnInit {
    radioGroup: RadioGroup;

    /** Analog to HTML 'name' attribute used to group radios for unique selection. */
    @Input() name: string;


    /** RadioGroup reads this to assign its own value. */
    @Input('bsAsRadio')
    get value(): any {
        return this._value;
    }

    set value(value: any) {
        if (this._value !== value) {
            this._value = value;

            switch (this._opMode) {
                case OpMode.RadioGroup:
                    if (this.checked) this.radioGroup.value = value;
                    break;
                case OpMode.NgModelPerRadio:
                    if (this._selectedValue === value) this.toggle();
                    break;
            }
        }
    }

    @Input()
    get disabled(): boolean {
        return this._disabled || (this.radioGroup != null && this.radioGroup.disabled);
    }

    set disabled(value: boolean) {
        // The presence of *any* disabled value makes the component disabled, *except* for false.
        this._disabled = (value != null && value !== false) ? true : null;
    }

    @Output() change: EventEmitter<RadioChange> = new EventEmitter();

    /** Value assigned to this radio.*/
    private _value: any = null;
    /** Holds selected value when ControlValueAccessor is set (NgModelPerRadio) */
    private _selectedValue: any = null;

    /** Whether this radio is disabled. */
    private _disabled: boolean;

    /** How this radio template is configured */
    private _opMode: OpMode = OpMode.None;

    private _changeSubscription: {unsubscribe: () => any} = null;

    constructor(@Optional() radioGroup: RadioGroup,
                public radioDispatcher: RadioDispatcher) {
        super();
        // Assertions. Ideally these should be stripped out by the compiler.
        // TODO(jelbourn): Assert that there's no name binding AND a parent radio group.
        this.radioGroup = radioGroup;

        // if we have a RadioGroup parent, save for later.
        if (radioGroup) this._opMode = OpMode.RadioGroup;

        radioDispatcher.listen((name: string) => {
            if (name == this.name) {
                this.checked = false;
            }
        });
    }

    ngOnInit() {
        if (this.id == null) {
            this.id = `md-radio-${_uniqueIdCounter++}`;
        }

        if (this._opMode === OpMode.RadioGroup && this._value == this.radioGroup.value) {
            this._checked = true;
        }
    }

    /**
     * There is no toggle in radio, only true.
     */
    toggle() {
        if (this._opMode === OpMode.RadioGroup) {
            // Propagate the change one-way via the group, which will in turn mark this
            // button as checked.
            this.radioGroup.selected = this;
        } else {
            this.checked = true;
        }
    }

    /*                          ControlValueAccessor Implementation         */
    writeValue(value: string) {
        this._selectedValue = value;
        if (value && this.value === value) {
            this.toggle();
        }
    }
    registerOnChange(fn: any) {
        // this means user has set ngModel or ngControl
        if (this._opMode !== OpMode.RadioGroup) {
            this._opMode = OpMode.NgModelPerRadio
        }

        if (this._changeSubscription) {
            this._changeSubscription.unsubscribe();
        }
        this._changeSubscription = <{unsubscribe: () => any}>this.change.subscribe(fn);
    }
    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }
    onTouched(): any {
        // if ngModel is present this is overriden.
        this._opMode === OpMode.RadioGroup && this.radioGroup.onTouched();
    }
    /*                          ControlValueAccessor Implementation         */

    protected _onCheckChanging(newValue: boolean) {
        if (newValue) {
            // Notify all radio buttons with the same name to un-check.
            this.radioDispatcher.notify(this.name);

            if (!this._checked) {
                this._emitChangeEvent();
            }
        }
    }

    private _emitChangeEvent(): void {
        if (this._opMode === OpMode.NgModelPerRadio) {
            this.change.emit(this._value);
        }
        else {
            let event = new RadioChange();
            event.source = this;
            event.value = this._value;
            this.change.emit(event);
        }
    }
}