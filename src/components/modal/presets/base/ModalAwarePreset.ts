import { ResolvedProvider, ElementRef } from 'angular2/core';
import {
    FLUENT_MEMBER_TYPE,
    FluentMemberMeta,
    FluentObjectMethod,
    FluentObject
} from './../../../../core/fluent';

import {Modal} from '../../providers/Modal';
import {IModalConfig, ModalConfig, BootstrapModalSize} from '../../models/ModalConfig';
import {ModalDialogInstance} from '../../models/ModalDialogInstance';

export interface ModalAwarePresetData extends IModalConfig {
    component: any;
    modal: Modal;
    bindings: <T>(config: T) => ResolvedProvider[];
}

/**
 * A Preset that knows about the modal service, and so can open a modal window on demand.
 * Use the fluent API to configure the preset and then invoke the 'open' method to open a modal
 * based on the preset.
 * ModalAwarePreset occupy the following properties:
 * - ModalConfig (size, isBlocking, keyboard): You can set them, if not they will get the
 * default values defined in the Modal service.
 * - component, modal, bindings: Preset values needed to fire up the modal.
 * - open: A Method used to open the modal window.
 */
export interface ModalAwarePreset<T extends ModalAwarePresetData> extends FluentObject<T> {
    modal: FluentObjectMethod<Modal, this>;

    /**
     * The component used for main modal content.
     */
    component: FluentObjectMethod<any, this>;

    /**
     * Binding function, returns a binding provider from the preset.
     */
    bindings: FluentObjectMethod<(config: ModalAwarePresetData) => ResolvedProvider[], this>;

    /**
     * Size of the modal.
     * 'lg' or 'sm' only.
     * NOTE: No validation.
     * Default to 'lg'
     */
    size: FluentObjectMethod<string, this>;

    /**
     * Describes if the modal is blocking modal.
     * A Blocking modal is not closable by clicking outside of the modal window.
     * Defaults to false.
     */
    isBlocking: FluentObjectMethod<boolean, this>;
    /**
     * Keyboard value/s that close the modal.
     * Accepts either a single numeric value or an array of numeric values.
     * A modal closed by a keyboard stroke will result in a 'reject' notification from the promise.
     * Defaults to 27, set `null` implicitly to disable.
     */
    keyboard: FluentObjectMethod<Array<number> | number, this>;
    /**
     * A Class for the modal dialog container.
     * Default: modal-dialog
     */
    dialogClass: FluentObjectMethod<BootstrapModalSize, this>;

    /**
     * Open a modal window based on the configuration of this config instance.
     * @param inside If set opens the modal inside the supplied elements ref at the specified anchor
     * @returns Promise<ModalDialogInstance>
     */
    open(inside?: {elementRef: ElementRef, anchorName: string}): Promise<ModalDialogInstance>;
}

export function open(inside?: {elementRef: ElementRef, anchorName: string})
                                                                    : Promise<ModalDialogInstance> {
    let config: ModalAwarePresetData = this.toJSON();

    if (! (config.modal instanceof Modal) ) {
        return <any>Promise.reject(new Error('Configuration Error: modal service not set.'));
    }

    if (typeof config.bindings !== 'function') {
        return <any>Promise.reject(new Error('Configuration Error: bindings not set.'));
    }

    if (!config.component) {
        return <any>Promise.reject(new Error('Configuration Error: component not set.'));
    }

    if (inside) {
        // TODO: Validate inside?
        return config.modal.openInside(config.component,
            inside.elementRef,
            inside.anchorName,
            config.bindings(config),
            new ModalConfig(config.size, config.isBlocking, config.keyboard));
    } else {
        return config.modal.open(config.component,
            config.bindings(config),
            new ModalConfig(config.size,
                config.isBlocking,
                config.keyboard,
                config.dialogClass));
    }
}

export const modalAwareInstructions: FluentMemberMeta[] = [
    {type: FLUENT_MEMBER_TYPE.Value, name: 'open', value: open, once: true},
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'modal'},
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'component'},
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'bindings'},
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'size'},
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'isBlocking'},
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'keyboard'},
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'dialogClass'}
];
