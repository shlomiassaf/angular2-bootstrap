import { Component, provide, ElementRef, Injector} from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {ModalConfig, Modal, ICustomModal, ModalDialogInstance} from '../../../components/modal/modal';
import {AdditionCalculateWindowData, AdditionCalculateWindow} from '../customModalDemo/customModal';
import {SampleElement} from '../sampleElement/sampleElement';
import * as presets from './presets';

const BUTTONS = [
    {
        text: 'Alert',
        preset: presets.alert
    },
    {
        text: 'Prompt',
        preset: presets.prompt
    },
    {
        text: 'Confirm',
        preset: presets.confirm
    },
    {
        text: 'Cascading',
        preset: presets.cascading
    },
    {
        text: 'In Element',
        preset: presets.inElement
    }
];

@Component({
    selector: 'demo-page',
    directives: [SampleElement, RouterLink],
    providers: [Modal],
    templateUrl: 'demo/app/demoPage/demoPage.tpl.html',
    styleUrls: ['demo/app/demoPage/demoPage.css']
})
export class DemoPage {
    public mySampleElement: ElementRef;
    public lastModalResult: string;
    public buttons = BUTTONS;
    constructor(private modal: Modal) {}

    processDialog(dialog: Promise<ModalDialogInstance>) {
        dialog.then((resultPromise) => {
            return resultPromise.result.then((result) => {
                this.lastModalResult = result;
            }, () => this.lastModalResult = 'Rejected!');
        });
    }
    open(btn) {
        let dialog,
            preset = btn.preset(this.modal);
        if (btn.text === 'In Element') {
            dialog = preset.open({
                elementRef: this.mySampleElement,
                anchorName: 'myModal'
            });
        } else {
            dialog = preset.open();
        }

        this.processDialog(dialog);
    }


    openCustomModal() {
        let resolvedBindings = Injector.resolve([provide(ICustomModal, {
                                                useValue: new AdditionCalculateWindowData(2, 3)})]),
            dialog = this.modal.open(
                <any>AdditionCalculateWindow,
                resolvedBindings,
                new ModalConfig('lg', true, 27)
        );
       this.processDialog(dialog);
    }
}
