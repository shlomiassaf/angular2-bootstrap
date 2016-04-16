import {Injector, provide , ResolvedBinding} from 'angular2/core';
import {
    FluentObjectMethod,
    FluentObjectFactory,
    FluentMemberMeta,
    FluentObject,
    FLUENT_MEMBER_TYPE
} from './../../../core/fluent';
import {modalAwareInstructions} from './base/ModalAwarePreset';
import {
    MessageModalPreset,
    MessageModalPresetData,
    messageModalInstructions
} from './base/MessageModalPreset';
import {MessageModalContext, MessageModal} from '../modals/MessageModal';


function createBindings(config: OneButtonPresetData): ResolvedBinding[] {
    config.buttons = [
        {
            cssClass: config.okBtnClass,
            caption: config.okBtn,
            onClick: (modalComponent: MessageModal, $event?: MouseEvent) =>
                modalComponent.dialog.close(true)
        }
    ];

    return Injector.resolve([
        provide(MessageModalContext, {useValue: config})
    ]);
}

export interface OneButtonPresetData extends MessageModalPresetData {
    /** 
     * Caption for the OK button.
     * Default: OK
     */
    okBtn: string;

    /**
     * A Class for the OK button.
     * Default: btn btn-primary
     */
    okBtnClass: string;
}

/**
 * A Preset for a classic 1 button modal window.
 */
export interface OneButtonPreset extends MessageModalPreset<OneButtonPresetData> {
    okBtn: FluentObjectMethod<string, this>;
    okBtnClass: FluentObjectMethod<string, this>;
}

export const oneButtonPresetInstructions: FluentMemberMeta[] = [
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'okBtn', value: 'OK'},
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'okBtnClass', value: 'btn btn-primary'}
];

export function oneButtonPresetFactory(defaultValues: OneButtonPresetData = undefined)
                                                            : FluentObjectFactory<OneButtonPreset> {
    return new FluentObjectFactory<OneButtonPreset>
                            (<OneButtonPreset>new FluentObject<OneButtonPresetData>(defaultValues))
        .setDynamic<OneButtonPreset>([
            ...modalAwareInstructions,
            ...messageModalInstructions,
            ...oneButtonPresetInstructions,
            {type: FLUENT_MEMBER_TYPE.DirectValue, name: 'bindings', value: createBindings}
        ]);
}
