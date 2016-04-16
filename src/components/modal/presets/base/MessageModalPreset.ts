import {
    FLUENT_MEMBER_TYPE,
    FluentObjectMethod,
    FluentMemberMeta
} from './../../../../core/fluent';
import {ModalAwarePreset, ModalAwarePresetData} from './ModalAwarePreset';
import {MessageModal, MessageModalContext} from '../../modals/MessageModal';


export interface MessageModalPresetData extends MessageModalContext, ModalAwarePresetData {}

/**
 * A Preset representing the configuration needed to open MessageModal.
 * This is an abstract implementation with no concrete behaviour.
 * Use derived implementation.
 */
export interface MessageModalPreset<T extends MessageModalPresetData> extends ModalAwarePreset<T> {

    /**
     * A Class for the header (title) container.
     * Default: modal-header
     */
    headerClass: FluentObjectMethod<string, this>;

    /**
     * Caption for the title, enclosed in a H3 container.
     */
    title: FluentObjectMethod<string, this>;

    /**
     * HTML for the title, if set overrides title property.
     * The HTML is wrapped in a DIV element, inside the header container.
     * Example:
     <div class="modal-header">
     <div> HTML CONTENT INSERTED HERE </div>
     </div>
     * Note: HTML is not compiled.
     */
    titleHtml: FluentObjectMethod<string, this>;

    /**
     * The body of the message.
     * Can be either text or HTML.
     * Note: HTML is not compiled.
     */
    body: FluentObjectMethod<string, this>;

    /**
     * A Class for the body container.
     * Default: modal-body
     */
    bodyClass: FluentObjectMethod<string, this>;

    /**
     * A Class for the footer container.
     * Default: modal-footer
     */
    footerClass: FluentObjectMethod<string, this>;
}

export const messageModalInstructions: FluentMemberMeta[] = [
    {type: FLUENT_MEMBER_TYPE.DirectValue, name: 'component', value: MessageModal},
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'headerClass', value: 'modal-header'},
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'title'},
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'titleHtml'},
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'body'},
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'bodyClass', value: 'modal-body'},
    {type: FLUENT_MEMBER_TYPE.Setter, name: 'footerClass', value: 'modal-footer'}
];
