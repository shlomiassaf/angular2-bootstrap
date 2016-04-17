import {Component} from 'angular2/core';
import {AsRadio} from '../../../core/behavior/AsRadio';
import {RadioGroup, RadioDispatcher, RadioChange} from '../../../core/behavior/AsRadioGroup';

@Component({
    selector: 'button-radio-demo',
    templateUrl: 'demo/components/button/button.radio.tpl.html',
    providers: [RadioDispatcher],
    directives: [RadioGroup, AsRadio]
})
export class ButtonRadioDemo {
    public simpleRadioModal: string = 'Middle';
    public groupRadioModel:string = 'Middle';
    public dynamicRadioModel:string = 'Middle';

    public groupRadioNgModel: string = 'Middle';
    
    public dynamicOptions = [
        {
            text: "Left",
            value: "Left",
            disabled: true
        },
        {
            text: "Middle",
            value: "Middle",
            disabled: false
        },
        {
            text: "Right",
            value: "Right",
            disabled: false
        }
    ]
}