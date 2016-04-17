import {
    Component,
    EventEmitter,
    Input,
    Output,
    ElementRef,
    Renderer,
    AppViewManager,
    ViewChild,
    AfterViewInit,
    ViewEncapsulation,
    ChangeDetectionStrategy
} from 'angular2/core';

import {BooleanFieldValue } from '../../core/annotations/field-value';

export type ALERT_TYPE = 'success' | 'info' | 'warning' | 'danger';


@Component({
    selector: 'alert',
    templateUrl: '/components/alert/alert.tpl.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Provide contextual feedback messages for typical user actions with the handful of available and
 * flexible alert messages.
 */
export class Alert implements AfterViewInit{
    /**
     *
     * @type {string}
     */
    @Input() type: ALERT_TYPE = 'info';

    /**
     * Enables settings a custom class instead of type, if set overrides type.
     */
    @Input() customType: string;

    /**
     * The number of milliseconds to wait before closing the alert.
     */
    @Input() dismissOnTimeout: number;

    /**
     * If set an inline close button is displayed
     */
    @Input() @BooleanFieldValue() closeable: boolean;
    
    @Output() public close: EventEmitter<Alert> = new EventEmitter();

    @ViewChild('alert') private alertRef: ElementRef;

    private _closed: boolean;

    constructor(private elementRef: ElementRef, private renderer: Renderer) {}

    get closed(): boolean {
        return this._closed;
    }

    ngAfterViewInit() {
        let t = this.customType || `alert-${this.type}`;
        this.renderer.setElementClass(this.alertRef.nativeElement, t, true);
        if (this.closeable)
            this.renderer.setElementClass(this.alertRef.nativeElement, `alert-dismissible`, true);

        this.dismissOnTimeout > 0 && setTimeout(() => this.dismiss(), this.dismissOnTimeout);
    }
    
    public dismiss(): void {
        this.close.emit(this);

        // TODO, remove in a better way, also support animation.
        this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'removeChild',
            [this.alertRef.nativeElement]);
    }
}