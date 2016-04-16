import {Injector, provide , ResolvedBinding} from 'angular2/core';
import {
    FluentObjectMethod,
    FluentObjectFactory,
    FluentObject,
    FLUENT_MEMBER_TYPE
} from './../../../core/fluent';
import {modalAwareInstructions} from './base/ModalAwarePreset';
import {
    MessageModalPreset,
    messageModalInstructions
} from './base/MessageModalPreset';
import {OneButtonPresetData, oneButtonPresetInstructions} from './OneButtonPreset';

import {MessageModalContext, MessageModal} from '../modals/MessageModal';


function createBindings(config: TwoButtonPresetData): ResolvedBinding[] {
    config.buttons = [
        {
            cssClass: config.okBtnClass,
            caption: config.okBtn,
            onClick: (modalComponent: MessageModal, $event: MouseEvent) =>
                modalComponent.dialog.close(true)
        },
        {
            cssClass: config.cancelBtnClass,
            caption: config.cancelBtn,
            onClick: (modalComponent: MessageModal, $event: MouseEvent) =>
                modalComponent.dialog.dismiss()
        }
    ];

    return Injector.resolve([
        provide(MessageModalContext, {useValue: config})
    ]);
}

export interface TwoButtonPresetData extends OneButtonPresetData {
    /** 
     * Caption for the Cancel button.
     * Default: Cancel
     */
    cancelBtn: string;

    /**
     * A Class for the Cancel button.
     * Default: btn btn-default
     */
    cancelBtnClass: string;
}

/**
 * A Preset for a classic 2 button modal window.
 */
export interface TwoButtonPreset extends MessageModalPreset<TwoButtonPresetData> {
    okBtn: FluentObjectMethod<string, this>;
    okBtnClass: FluentObjectMethod<string, this>;
    cancelBtn: FluentObjectMethod<string, this>;
    cancelBtnClass: FluentObjectMethod<string, this>;
}


export function twoButtonPresetFactory(defaultValues: TwoButtonPresetData = undefined)
                                                            : FluentObjectFactory<TwoButtonPreset> {
    return new FluentObjectFactory<TwoButtonPreset>
                            (<TwoButtonPreset>new FluentObject<OneButtonPresetData>(defaultValues))
        .setDynamic<TwoButtonPreset>([
            ...modalAwareInstructions,
            ...messageModalInstructions,
            ...oneButtonPresetInstructions,
            {type: FLUENT_MEMBER_TYPE.Setter, name: 'cancelBtn', value: 'Cancel'},
            {type: FLUENT_MEMBER_TYPE.Setter, name: 'cancelBtnClass', value: 'btn btn-default'},
            {type: FLUENT_MEMBER_TYPE.DirectValue, name: 'bindings', value: createBindings}
        ]);
}
