export class Checkable {
    /** A unique id for the element. If one is not supplied, it is auto-generated. */
    id: string;

    /**
     * Whether the checkbox is disabled. When the checkbox is disabled it cannot be interacted with.
     * The correct ARIA attributes are applied to denote this to assistive technology.
     */
    disabled: boolean = false;

    /**
     * The tabindex attribute for the checkbox. Note that when the btn-checkbox is disabled,
     * the attribute on the host element will be removed. It will be placed back when the
     * checkbox is re-enabled.
     */
    tabindex: number = 0;


    get checked(): boolean {
        return this._checked;
    }

    set checked(checked: boolean) {
        if (checked === this._checked) return;
        this._onCheckChanging(checked);
        this._checked = checked;
        this._onCheckChanged();
    }

    protected _checked: boolean = false;

    get ariaPressed(): 'true' | 'false' {
        return this.checked ? 'true' : 'false';
    }

    get tabIndexState(): number {
        return this.disabled ? null : this.tabindex;
    }

    /** Toggles the checked state of the checkbox. If the checkbox is disabled, this does nothing. */
    toggle() {
        this.checked = !this.checked;
    }

    /**
     * Event handler used for both (click) and (keyup.space) events. Delegates to toggle().
     */
    onInteractionEvent(event: Event) {
        if (this.disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.toggle();
    }

    /**
     * Event handler used for (keydown.space) events. Used to prevent spacebar events from bubbling
     * when the component is focused, which prevents side effects like page scrolling from happening.
     */
    onKeyDown(evt: Event) {
        evt.preventDefault();
    }


    protected _onCheckChanged(): void {};
    protected _onCheckChanging(newValue: boolean): void {};
}